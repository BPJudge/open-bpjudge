import { $, addPage, AutoloadPage } from '@hydrooj/ui-default';

addPage(new AutoloadPage('mermaid', async () => {
    const mermaid = (await import('mermaid')).default;
    mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'antiscript'
    });
    async function runMermaid($nodes) {
        const elements = $nodes.find('pre code.language-mermaid').toArray();
        for (let i = 0; i < elements.length; i++) {
            const $code = $(elements[i]);
            const $pre = $code.parent();
            if ($pre.data('rendered')) continue;
            const code = $code.text();
            try {
                const id = `mermaid-${Date.now()}-${i}`;
                const { svg } = await mermaid.render(id, code);
                const $div = $('<div class="mermaid-rendered"></div>').html(svg);
                $pre.replaceWith($div);
            } catch (e) {
                console.error('Mermaid render error:', e);
                const $error = $('<pre class="mermaid-error"></pre>').text(e.message);
                $pre.replaceWith($error);
            }
        }
    }
    await runMermaid($('.richmedia'));
    $(document).on('vjContentNew', async (e) => {
        await runMermaid($(e.target).find('.richmedia').addBack('.richmedia'));
    });
}));