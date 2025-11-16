import { Context, DocumentModel, ForbiddenError, PERM, PRIV, PrivilegeError, ProblemDoc, ProblemModel, ProblemNotFoundError } from 'hydrooj';

declare module 'hydrooj' {
    interface ProblemDoc {
        vote?: number;
    }
}

async function vote(domainId: string, _id: number, uid: number, value: number) {
    const doc = await DocumentModel.get(domainId, DocumentModel.TYPE_PROBLEM, _id);
    if (!doc) throw new ProblemNotFoundError(domainId, _id);
    const before = await DocumentModel.setStatus(
        domainId, DocumentModel.TYPE_PROBLEM, _id, uid,
        { vote: value }, 'before',
    );
    let inc = value;
    if (before?.vote) inc -= before.vote;
    return inc
        ? await DocumentModel.inc(domainId, DocumentModel.TYPE_PROBLEM, _id, 'vote', inc)
        : doc;
}

export function apply(ctx: Context) {
    if (!ProblemModel.PROJECTION_PUBLIC.includes('vote' as any)) {
        ProblemModel.PROJECTION_PUBLIC.push('vote' as any);
    }
    if (!ProblemModel.PROJECTION_LIST.includes('vote' as any)) {
        ProblemModel.PROJECTION_LIST.push('vote' as any);
    }

    ctx.withHandlerClass('ProblemDetailHandler', (ProblemDetailHandler) => {
        ProblemDetailHandler.prototype.postUpvote = async function postUpvote() {
            const { domainId, psid } = this.args;
            if (!this.user.hasPriv(PRIV.PRIV_USER_PROFILE)) {
                throw new ForbiddenError("You're not logged in.");
            }
            const pdoc = await vote(domainId, +psid, this.user._id, 1);
            this.back({ vote: pdoc.vote, user_vote: 1 });
        }
        ProblemDetailHandler.prototype.postDownvote = async function postDownvote() {
            const { domainId, psid } = this.args;
            if (!this.user.hasPriv(PRIV.PRIV_USER_PROFILE)) {
                throw new ForbiddenError("You're not logged in.");
            }
            const pdoc = await vote(domainId, +psid, this.user._id, -1);
            this.back({ vote: pdoc.vote, user_vote: -1 });
        }
        ProblemDetailHandler.prototype.postCannelvote = async function postCannelvote() {
            const { domainId, psid } = this.args;
            if (!this.user.hasPriv(PRIV.PRIV_USER_PROFILE)) {
                throw new ForbiddenError("You're not logged in.");
            }
            const pdoc = await vote(domainId, +psid, this.user._id, 0);
            this.back({ vote: pdoc.vote, user_vote: 0 });
        }
    });

    ctx.on('handler/before/ProblemDetail', async (h) => {
        h.UiContext.psdoc = h.response.body.psdoc;
    });
    ctx.i18n.load('zh',{
        'Cancel Vote': '取消投票',
    });
}
