import { Context, SettingModel, yaml } from 'hydrooj';

export const description = '方块化评测记录显示（实验性）';

export function apply(ctx: Context) {
    ctx.on('handler/after/RecordDetail#get', async (that) => {
        if (that.user.recordex) {
            that.response.template = 'record_detail_new.html';
        }
    });
    ctx.inject(['setting'], (c) => {
        c.setting.PreferenceSetting(
            SettingModel.Setting('setting_display', 'recordex', false, 'boolean', 'New Record Detail Display', '启用新型评测记录渲染（实验性）'),
        );
    });
    ctx.i18n.load("zh", {
        record_detail_new: '记录详情'
    });

    ctx.on('handler/create', (handler) => {
        if (handler.constructor.name === 'RecordDetailConnectionHandler') {
            handler.sendUpdate = async function (rdoc) {
                if (this.noTemplate) {
                    this.send({ rdoc });
                } else if (handler.user.recordex) {
                    this.send({
                        status: rdoc.status,
                        header_html: await this.renderHTML('record_detail_header_new.html', { rdoc, pdoc: this.pdoc }),
                        status_html: await this.renderHTML('record_detail_status_new.html', { rdoc, pdoc: this.pdoc }),
                        compiler_html: await this.renderHTML('record_detail_compiler_new.html', { rdoc, pdoc: this.pdoc }),
                        status_summary_html: await this.renderHTML('record_status_summary.html', { rdoc, pdoc: this.pdoc }),
                        summary_html: await this.renderHTML('record_detail_summary.html', { rdoc, pdoc: this.pdoc }),
                    });
                } else {
                    this.send({
                        status: rdoc.status,
                        status_html: await this.renderHTML('record_detail_status.html', { rdoc, pdoc: this.pdoc }),
                        summary_html: await this.renderHTML('record_detail_summary.html', { rdoc, pdoc: this.pdoc }),
                    });
                }
            };
        }
    });
}
