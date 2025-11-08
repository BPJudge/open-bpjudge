import { $, addPage, AutoloadPage } from '@hydrooj/ui-default';

addPage(new AutoloadPage('mermaid', async () => {
    const mermaid = (await import('mermaid')).default;
    mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose'
    });
    async function runMermaid($nodes) {
        const eles = $nodes.find('.mermaid').toArray();
        for (let i = 0; i < eles.length; i++) {
            const element = eles[i];
            const $element = $(element);
            if ($element.data('rendered')) continue;
            const code = $element.text();
            try {
                const id = `mermaid-${Date.now()}-${i}`;
                const { svg } = await mermaid.render(id, code);
                $element.html(svg);
                $element.data('rendered', true);
            } catch (e) {
                console.error('Mermaid render error:', e);
                $element.html(`<pre class="mermaid-error">${e.message}</pre>`);
            }
        }
    }
    await runMermaid($('.richmedia'));
    $(document).on('vjContentNew', async (e) => {
        await runMermaid($(e.target).find('.richmedia').addBack('.richmedia'));
    });
}));