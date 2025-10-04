import {
    UserModel, db, DomainModel, BaseUserDict, _,
} from 'hydrooj';

const collUser = db.collection('domain.user');
export const coll: Collection<Udoc> = db.collection('user');
export const collV: Collection<VUdoc> = db.collection('vuser');
export const collGroup: Collection<GDoc> = db.collection('user.group');

export async function apply(ctx) {
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
