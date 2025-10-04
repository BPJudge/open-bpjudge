import {
    Handler, Context, UserModel, db, TokenModel,
} from 'hydrooj';
import { HomeHandler } from 'hydrooj/src/handler/home';

const token = db.collection('token');

async function getActiveUser(domainId) {
    const res = await token.aggregate([
        { $match: { updateAt: { $gte: new Date(Date.now() - 120 * 60 * 1000) }, uid: { $gt: 1 } } },
        { $group: { _id: '$uid' } },
        { $lookup: { from: 'user', localField: '_id', foreignField: '_id', as: 'user' } },
        { $project: { _id: '$_id' } },
        { $unwind: '$_id' },
    ]).toArray();
    const udocs = await Promise.all(res.map(async (doc) => {
        const udoc = await UserModel.getById(domainId, doc._id);
        const sdoc = await TokenModel.getMostRecentSessionByUid(doc._id, ['updateAt', 'createAt']);
        udoc.updateAt = sdoc?.updateAt;
        return udoc;
    }));
    udocs.sort((a, b) => {
        const now = new Date();
        return Math.abs(a.updateAt - now) - Math.abs(b.updateAt - now);
    });
    return [udocs];
}

export async function apply(ctx) {
    HomeHandler.prototype.getActiveUser = async (domainId, payload) => {
        return await getActiveUser(domainId);
    }
}