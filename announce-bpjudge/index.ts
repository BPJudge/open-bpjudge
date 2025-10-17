import { Handler, Context, param, Types, ObjectId, DocumentModel, _, NumberKeys, Filter, PERM, UserModel, NotFoundError, OplogModel, SettingModel, PRIV } from "hydrooj";

export const TYPE_ANNOUNCE = 1000 as const;

export interface AnnounceDoc {
    _id: ObjectId;
    docType: 100;
    docId: ObjectId;
    domainId: string;
    owner: number;
    title: string;
    content: string;
    hidden: boolean;
    ip: string;
    updateAt: Date;
    pin: number;
    views: number;
    sort: number;
    highlight: boolean;
    global: boolean;
}

declare module 'hydrooj' {
    interface Model {
        announce: typeof AnnounceModel;
    }
    interface DocType {
        [TYPE_ANNOUNCE]: AnnounceDoc;
    }
}

export class AnnounceModel {
    static async add(
        domainId: string, owner: number, title: string, content: string, hidden: boolean, highlight: boolean,
        global: boolean, pin: number, ip?: string
    ): Promise<ObjectId> {
        const payload: Partial<AnnounceDoc> = {
            domainId,
            content,
            owner,
            title,
            hidden,
            ip,
            highlight,
            pin,
            global,
            updateAt: new Date(),
            views: 0,
            sort: 100
        };
        const res = await DocumentModel.add(
            domainId, payload.content!, payload.owner!, TYPE_ANNOUNCE,
            null, null, null, _.omit(payload, ['domainId', 'content', 'owner']),
        );
        payload.docId = res;
        return payload.docId;
    }

    static async get(domainId: string, aid: ObjectId): Promise<AnnounceDoc> {
        return await DocumentModel.get(domainId, TYPE_ANNOUNCE, aid);
    }

    static edit(domainId: string, aid: ObjectId, $set: Partial<AnnounceDoc>): Promise<AnnounceDoc> {
        return DocumentModel.set(domainId, TYPE_ANNOUNCE, aid, $set);
    }

    static inc(domainId: string, aid: ObjectId, key: NumberKeys<AnnounceDoc>, value: number): Promise<AnnounceDoc | null> {
        return DocumentModel.inc(domainId, TYPE_ANNOUNCE, aid, key, value);

    }

    static del(domainId: string, aid: ObjectId): Promise<never> {
        return Promise.all([
            DocumentModel.deleteOne(domainId, TYPE_ANNOUNCE, aid),
            DocumentModel.deleteMultiStatus(domainId, TYPE_ANNOUNCE, { docId: aid }),
        ]) as any;
    }

    static count(domainId: string, query: Filter<AnnounceDoc>) {
        return DocumentModel.count(domainId, TYPE_ANNOUNCE, query);
    }

    static getMulti(domainId: string, query: Filter<AnnounceDoc> = {}) {
        return DocumentModel.coll.find({ docType: TYPE_ANNOUNCE, ...query }).sort({ pin: -1, _id: -1 });
        // return DocumentModel.getMulti(domainId, TYPE_ANNOUNCE, query)
    }

    static getStatus(domainId: string, aid: ObjectId, uid: number) {
        return DocumentModel.getStatus(domainId, TYPE_ANNOUNCE, aid, uid);
    }

    static setStatus(domainId: string, aid: ObjectId, uid: number, $set) {
        return DocumentModel.setStatus(domainId, TYPE_ANNOUNCE, aid, uid, $set);
    }
}

global.Hydro.model.announce = AnnounceModel;

class AnnounceHandler extends Handler {
    adoc?: AnnounceDoc;

    @param('aid', Types.ObjectId, true)
    async _prepare(domainId: string, aid: ObjectId) {
        if (aid) {
            this.adoc = await AnnounceModel.get(domainId, aid);
            if (!this.adoc) throw new NotFoundError(domainId, aid);
        }
    }
}

class AnnounceMainHandler extends AnnounceHandler {
    @param('page', Types.PositiveInt, true)
    async get(domainId: string, page = 1) {
        const q: any = {
            $or: [
                { domainId },
                { global: { $exists: true, $eq: true } },
            ],
        };
        if (!this.user.hasPerm(PERM.PERM_EDIT_DOMAIN)) {
            q.hidden = false;
        }
        const [adocs, apcount] = await this.paginate(
            AnnounceModel.getMulti(domainId, q),
            page,
            this.ctx.setting.get('pagination.announce') || 10,
        );
        const udict = await UserModel.getList(domainId, adocs.map((adoc) => adoc.owner));
        this.response.template = 'announce_main.html';
        this.response.body = {
            adocs,
            udict,
            apcount,
            page,
        };
    }
}

class AnnounceDetailHandler extends AnnounceHandler {
    @param('aid', Types.ObjectId)
    async get(domainId: string, aid: ObjectId) {
        if (this.adoc.hidden) {
            this.checkPerm(PERM.PERM_EDIT_DOMAIN);
        }
        const dsdoc = this.user.hasPriv(PRIV.PRIV_USER_PROFILE)
            ? await AnnounceModel.getStatus(domainId, aid, this.user._id)
            : null;
        if (!dsdoc?.view) {
            await Promise.all([
                AnnounceModel.inc(domainId, aid, 'views', 1),
                AnnounceModel.setStatus(domainId, aid, this.user._id, { view: true }),
            ]);
        }
        const udoc = await UserModel.getById(domainId, this.adoc.owner);
        this.response.template = 'announce_detail.html';
        this.response.body = {
            adoc: this.adoc, udoc
        };
        this.UiContext.extraTitleContent = this.adoc.title;
    }
}

class AnnounceRawHandler extends AnnounceHandler {
    @param('aid', Types.ObjectId)
    async get(domainId: string, aid: ObjectId) {
        this.response.type = 'text/markdown';
        this.response.body = this.adoc.content;
    }
}

class AnnounceEditHandler extends AnnounceHandler {
    async get() {
        if (this.adoc) this.checkPerm(PERM.PERM_EDIT_DOMAIN);
        this.response.template = 'announce_edit.html';
        this.response.body = {
            adoc: this.adoc,
            page_name: this.adoc ? 'announce_edit' : 'announce_create',
        };
    }

    @param('title', Types.Title)
    @param('content', Types.Content)
    @param('hidden', Types.Boolean)
    @param('highlight', Types.Boolean)
    @param('global', Types.Boolean)
    @param('pin', Types.UnsignedInt)
    async postCreate(domainId: string, title: string, content: string, hidden: boolean = false, highlight: boolean = false, global: boolean = false, pin: number) {
        await this.limitRate('add_announce', 3600, 60);
        const aid = await AnnounceModel.add(
            domainId, this.user._id, title, content, hidden, highlight, global, pin, this.request.ip
        );
        this.response.body = { aid };
        this.response.redirect = this.url('announce_detail', { domainId, aid });
    }

    @param('aid', Types.ObjectId)
    @param('title', Types.Title)
    @param('content', Types.Content)
    @param('hidden', Types.Boolean)
    @param('highlight', Types.Boolean)
    @param('global', Types.Boolean)
    @param('pin', Types.UnsignedInt)
    async postUpdate(domainId: string, aid: ObjectId, title: string, content: string, hidden: boolean = false, highlight: boolean = false, global: boolean = false, pin = 0) {
        await Promise.all([
            AnnounceModel.edit(domainId, aid, {
                title, content, hidden, highlight, global, pin
            }),
            OplogModel.log(this, 'announce.edit', this.adoc),
        ]);
        this.response.body = { aid };
        this.response.redirect = this.url('announce_detail', { domainId, aid });
    }

    @param('aid', Types.ObjectId)
    async postDelete(domainId: string, aid: ObjectId) {
        await Promise.all([
            AnnounceModel.del(domainId, aid),
            OplogModel.log(this, 'announce.delete', this.adoc),
        ]);
        this.response.redirect = this.url('announce_main', { domainId });
    }
}

async function getAnnounce(domainId: string, limit = 10) {
    const q: any = {
        $or: [
            { domainId },
            { global: { $exists: true, $eq: true } },
        ],
    };
    if (!this.user.hasPerm(PERM.PERM_EDIT_DOMAIN)) {
        q.hidden = false;
    }
    const adocs = await AnnounceModel.getMulti(domainId, q).limit(limit + 1).toArray();
    const hasmore = adocs.length > limit;
    if (hasmore && adocs.length) adocs.pop();
    const udict = await UserModel.getList(domainId, adocs.map((adoc) => adoc.owner));
    return [adocs, udict, hasmore];
}

export async function apply(ctx: Context) {
    ctx.Route('announce_main', '/announce', AnnounceMainHandler);
    ctx.Route('announce_create', '/announce/create', AnnounceEditHandler, PERM.PERM_EDIT_DOMAIN);
    ctx.Route('announce_detail', "/announce/:aid", AnnounceDetailHandler);
    ctx.Route('announce_raw_detail', "/announce/:aid/raw", AnnounceRawHandler);
    ctx.Route('announce_edit', "/announce/:aid/edit", AnnounceEditHandler);
    ctx.withHandlerClass('HomeHandler', (HomeHandler) => {
        HomeHandler.prototype['getAnnounce'] = getAnnounce;
    });
    ctx.inject(['setting'], (c) => {
        c.setting.SystemSetting(
            SettingModel.Setting('setting_limit', 'pagination.announce', 10, 'number', 'pagination.announce', 'Announce per page'),
        );
    });
    ctx.injectUI("Nav", "announce_main", { prefix: "announce", before: 'domain_dashboard' });
    ctx.i18n.load('zh', {
        Announce: '公告',
        announce: '公告',
        announce_detail: '公告详情',
        announce_edit: '编辑公告',
        announce_create: '创建公告',
        announce_main: '公告',
    });
    ctx.i18n.load('en', {
        announce: 'Announce',
        announce_detail: 'Announce Detail',
        announce_edit: 'Edit Announce',
        announce_create: 'Create Announce',
        announce_main: 'Announce',
    });
}