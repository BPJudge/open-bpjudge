import {
    UserModel, db, DomainModel, BaseUserDict, _, Context,
} from 'hydrooj';
import markdown from '@hydrooj/ui-default/backendlib/markdown';

const collUser = db.collection('domain.user');
export const coll: Collection<Udoc> = db.collection('user');
export const collV: Collection<VUdoc> = db.collection('vuser');
export const collGroup: Collection<GDoc> = db.collection('user.group');

function cuteTablePlugin(md) {
    md.core.ruler.push('cute_table', (state) => {
        const tokens = state.tokens;
        for (let i = 0; i < tokens.length - 3; i++) {
            if (tokens[i].type === 'paragraph_open'
                && tokens[i + 1].type === 'inline'
                && tokens[i + 2].type === 'paragraph_close'
                && tokens[i + 3].type === 'table_open') {
                const content = tokens[i + 1].content.trim();
                const match = content.match(/^::cute-table\{(.+)\}$/);
                if (match) {
                    const className = match[1];
                    tokens[i + 3].attrs = tokens[i + 3].attrs || [];
                    const attr = tokens[i + 3].attrs.find((a) => a[0] === 'class');
                    if (attr) {
                        attr[1] += ` cute-table ${className}`;
                    } else {
                        tokens[i + 3].attrs.push(['class', `cute-table ${className}`]);
                    }
                    // remove the paragraph tokens
                    tokens.splice(i, 3);
                    i--;
                }
            }
        }
    });
}

export async function apply(ctx: Context) {
    markdown.plugin(cuteTablePlugin);
    UserModel.getListForRender = async function (domainId: string, uids: number[], arg: string[] | boolean) {
        const fields = ['_id', 'uname', 'mail', 'avatar', 'school', 'studentId'].concat(arg instanceof Array ? arg : []);
        const showDisplayName = arg instanceof Array ? fields.includes('displayName') : arg;
        const [vudocs, dudocs] = await Promise.all([
            // UserModel.getMulti({ _id: { $in: uids } }, fields).toArray(),
            collV.find({ _id: { $in: uids } }).toArray(),
            DomainModel.getDomainUserMulti(domainId, uids).project({ uid: 1, ...(showDisplayName ? { displayName: 1 } : {}) }).toArray(),
        ]);
        const udocs = [];
        // eslint-disable-next-line no-await-in-loop
        for (const i of uids) udocs.push(await UserModel.getById(domainId, i));
        const udict = {};
        for (const udoc of udocs) udict[udoc._id] = udoc;
        for (const udoc of vudocs) udict[udoc._id] = udoc;
        if (showDisplayName) for (const dudoc of dudocs) udict[dudoc.uid].displayName = dudoc.displayName;
        for (const uid of uids) udict[uid] ||= { ...UserModel.defaultUser };
        for (const key in udict) {
            udict[key].school ||= '';
            udict[key].studentId ||= '';
            udict[key].displayName ||= udict[key].uname;
            udict[key].avatar ||= `gravatar:${udict[key].mail}`;
        }
        return udict as BaseUserDict;
    };
    ctx.on('handler/after/SystemUserPriv#get', async (that) => {
        const udocs = that.response.body.udocs;
        const udict = [];
        for (const udoc of udocs) {
            udict.push(await UserModel.getById('system', udoc._id));
        }
        that.response.body.udocs = udict;
    });
}
