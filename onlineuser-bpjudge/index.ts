import {
    Handler, Context, UserModel, db,
} from 'hydrooj'

const token = db.collection('token');

class OnlineUserHandler extends Handler {
    async get({ domainId }) {
        const res = await token.aggregate([
            { $match: { updateAt: { $gte: new Date(Date.now() - 300 * 1000) }, uid: { $gt: 1 } } },
            { $group: { _id: '$uid' } },
            { $lookup: { from: 'user', localField: '_id', foreignField: '_id', as: 'user' } },
            { $project: { _id: '$_id' } },
            { $unwind: '$_id' },
        ]).toArray();
        const udocs = await Promise.all(res.map((doc) => UserModel.getById(domainId, doc._id)));
        this.response.body = { udocs };
        this.response.template = 'onlineuser.html';
    }
}

export const description = 'Show Online User';

export async function apply(ctx: Context) {
    ctx.Route('onlineuser', '/onlineuser', OnlineUserHandler);
    ctx.i18n.load('zh', {
        "No Online Users": '暂无在线用户',
        "There are {0} users online.": '共有 {0} 位用户在线',
        "Online User": '在线用户',
        onlineuser: '在线用户',
    });
    ctx.i18n.load('zh_TW', {
        "No Online Users": '暫無線上使用者',
        "There are {0} users online.": '共有 {0} 位使用者線上',
        "Online User": '線上使用者',
        onlineuser: '線上使用者',
    });
    ctx.i18n.load('kr', {
        "No Online Users": '온라인 사용자 없어요',
        "There are {0} users online.": '총 {0}명의 사용자가 온라인에 있어요',
        "Online User": '온라인 사용자',
        onlineuser: '온라인 사용자',
    });
}