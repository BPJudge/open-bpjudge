import { Context, SettingModel } from 'hydrooj';

export function apply(ctx: Context) {
    ctx.inject(['setting'], (c) => {
        c.setting.SystemSetting(
            SettingModel.Setting('acImage', 'acImage.duration', 3500, 'number', 'Image display duration', 'display duration(ms)'),
            SettingModel.Setting('acImage', 'acImage.url', '/ac-congrats.png', 'text', 'Image url', 'image url'),
            SettingModel.Setting('acImage', 'acImage.showInContest', true, 'boolean', 'Show In Contest', 'Show in contest submission (include homework)'),
        );
    });
    ctx.i18n.load('zh', {
        "Show in contest submission (include homework)": "在比赛提交中显示 AC 动画（包含作业）"
    });
    ctx.on('handler/after/RecordDetail#get', async (that) => {
        const duration = ctx.setting.get('acImage.duration');
        const imgUrl = ctx.setting.get('acImage.url');
        const showInContest = ctx.setting.get('acImage.showInContest');
        that.UiContext.acImgDuration = duration;
        that.UiContext.acImgUrl = imgUrl;
        that.UiContext.showInContest = showInContest;
        that.UiContext.rdoc = that.response.body.rdoc;
    });
    ctx.on('handler/after/ProblemDetail#get', async (that) => {
        const duration = ctx.setting.get('acImage.duration');
        const imgUrl = ctx.setting.get('acImage.url');
        const showInContest = ctx.setting.get('acImage.showInContest');
        that.UiContext.acImgDuration = duration;
        that.UiContext.showInContest = showInContest;
        that.UiContext.acImgUrl = imgUrl;
    });
}
