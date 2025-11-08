import {
    _, Context
} from 'hydrooj';

export async function apply(ctx: Context) {
    ctx.on('handler/init', () => {
        const { plugin } = require('@hydrooj/ui-default/backendlib/markdown');
        const mermaidPlugin = require('markdown-it-mermaid').default;
        plugin(mermaidPlugin);
    });
}