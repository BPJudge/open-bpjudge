import { Context, SettingModel } from 'hydrooj';

export function apply(ctx: Context) {
    ctx.inject(['setting'], (c) => {
        c.setting.SystemSetting(
            SettingModel.Setting('acImage', 'acImage.duration', 3500, 'number', 'Image display duration', 'display duration(ms)'),
            SettingModel.Setting('acImage', 'acImage.url', '/ac-congrats.png', 'textarea', 'Image url', '图片链接（每行一个）'),
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
        const imgUrls = imgUrl.split('\n').map(url => url.trim()).filter(url => url);
        const selectedUrl = imgUrls.length > 0
            ? imgUrls[Math.floor(Math.random() * imgUrls.length)]
            : imgUrl.trim();

        that.UiContext.acImgDuration = duration;
        that.UiContext.acImgUrl = selectedUrl;
        that.UiContext.showInContest = showInContest;
        that.UiContext.rdoc = that.response.body.rdoc;
    });
    ctx.on('handler/after/ProblemDetail#get', async (that) => {
        const duration = ctx.setting.get('acImage.duration');
        const imgUrl = ctx.setting.get('acImage.url');
        const showInContest = ctx.setting.get('acImage.showInContest');
        const imgUrls = imgUrl.split('\n').map(url => url.trim()).filter(url => url);
        const selectedUrl = imgUrls.length > 0
            ? imgUrls[Math.floor(Math.random() * imgUrls.length)]
            : imgUrl.trim();

        that.UiContext.acImgDuration = duration;
        that.UiContext.acImgUrl = selectedUrl;
        that.UiContext.showInContest = showInContest;
    });
}
