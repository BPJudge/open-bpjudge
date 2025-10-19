import { Context, SettingModel } from 'hydrooj';

export function apply(ctx: Context) {
    ctx.inject(['setting'], (c) => {
        c.setting.SystemSetting(
            SettingModel.Setting('acImage', 'acImage.duration', 3500, 'number', 'Image display duration', 'display duration(ms)'),
            SettingModel.Setting('acImage', 'acImage.url', '/ac-congrats.png', 'text', 'Image url', 'image url'),
        );
    });
    ctx.on('handler/after/RecordDetail#get', async (that) => {
        const duration = ctx.setting.get('acImage.duration');
        const imgUrl = ctx.setting.get('acImage.url');
        that.response.body.acImgDuration = duration;
        that.response.body.acImgUrl = imgUrl;
    });
}
