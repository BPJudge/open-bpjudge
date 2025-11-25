import { $, _, addPage, NamedPage, Socket, withTransitionCallback } from '@hydrooj/ui-default'
import { DiffDOM } from 'diff-dom';

let currentTabTarget = null;
let userSelectedTab = false;   // 用户是否手动点过 tab

function switchTab($button) {
    const targetSelector = String($button.data('x-target') || '');
    if (!targetSelector) return;

    currentTabTarget = targetSelector;

    const $groupRoot = $button.closest('[data-x-group]');
    const group = String($groupRoot.data('x-group') || '');
    const $header = $groupRoot.find('.x-tab-header');
    const $content = $(`.x-tabs-content[data-x-group="${group}"]`);
    if (!$content.length) return;
    $header.find('.entry')
        .removeClass('selected')
        .attr('aria-selected', 'false')
        .attr('tabindex', '-1');
    $button
        .addClass('selected')
        .attr('aria-selected', 'true')
        .attr('tabindex', '0');

    $content.find('.x-pane')
        .removeClass('selected')
        .attr('hidden', 'hidden')
        .hide();
    const $pane = $content.find(targetSelector).first();
    if ($pane.length) {
        $pane
            .addClass('selected')
            .removeAttr('hidden')
            .show()
            .trigger('vjContentShow');
    }
}

function selectDefaultTab(forceRechoose = false) {
    $('.x-tab-header').each(function () {
        const $header = $(this);
        const $groupRoot = $header.closest('[data-x-group]');
        const group = String($groupRoot.data('x-group') || '');
        const $content = $(`.x-tabs-content[data-x-group="${group}"]`);
        if (!$content.length) return;

        if (!forceRechoose && currentTabTarget) {
            const $keep = $header.find(`.entry[data-x-target="${currentTabTarget}"]`)
                .not('[hidden]');
            if (
                $keep.length &&
                $content.find(currentTabTarget).length
            ) {
                switchTab($keep.first());
                return;
            }
        }

        let $candidate = $header.find('.entry.selected')
            .not('[hidden]')
            .filter(function () {
                const sel = String($(this).data('x-target') || '');
                return sel && $content.find(sel).length > 0;
            }).first();

        const priority = ['#pane-cases', '#pane-compiler', '#pane-code'];
        if (!$candidate.length) {
            for (const sel of priority) {
                const $btn = $header.find(`.entry[data-x-target="${sel}"]`)
                    .not('[hidden]').first();
                if ($btn.length && $content.find(sel).length) {
                    $candidate = $btn;
                    break;
                }
            }
        }

        if (!$candidate.length) {
            $candidate = $header.find('.entry')
                .not('[hidden]')
                .filter(function () {
                    const sel = String($(this).data('x-target') || '');
                    return sel && $content.find(sel).length > 0;
                }).first();
        }

        if ($candidate.length) switchTab($candidate);
    });
}

addPage(new NamedPage('record_detail_new', () => {
    if (!UserContext.recordex) return;

    $(document).on('click', '.x-tab-header .entry', function (e) {
        e.preventDefault();
        userSelectedTab = true;
        switchTab($(this));
    });
    selectDefaultTab();

    const sock = new Socket(UiContext.ws_prefix + UiContext.socketUrl, false, true);
    const dd = new DiffDOM();
    sock.onmessage = (_, data) => {
        const msg = JSON.parse(data);
        if (typeof msg.status === 'number' && window.parent) window.parent.postMessage({ status: msg.status });
        withTransitionCallback(() => {
            const newHeader = $(msg.header_html);
            const oldHeader = $('#header');
            oldHeader.trigger('vjContentRemove');
            dd.apply(oldHeader[0], dd.diff(oldHeader[0], newHeader[0]));
            $('#header').trigger('vjContentNew');

            const newStatus = $(msg.status_html);
            const oldStatus = $('#status');
            if (oldStatus.length) {
                oldStatus.trigger('vjContentRemove');
                dd.apply(oldStatus[0], dd.diff(oldStatus[0], newStatus[0]));
                oldStatus.trigger('vjContentNew');
                oldStatus.removeAttr('hidden');
            }

            const newStatusSummary = $(msg.status_summary_html);
            const oldStatusSummary = $('#status_summary');
            oldStatusSummary.trigger('vjContentRemove');
            dd.apply(oldStatusSummary[0], dd.diff(oldStatusSummary[0], newStatusSummary[0]));
            $('#status_summary').trigger('vjContentNew');

            const newSummary = $(msg.summary_html);
            const oldSummary = $('#summary');
            oldSummary.trigger('vjContentRemove');
            dd.apply(oldSummary[0], dd.diff(oldSummary[0], newSummary[0]));
            $('#summary').trigger('vjContentNew');

            if (msg.compiler_html && msg.compiler_html.trim()) {
                const newCompiler = $(msg.compiler_html);
                const oldCompiler = $('#compiler');
                oldCompiler.trigger('vjContentRemove');
                dd.apply(oldCompiler[0], dd.diff(oldCompiler[0], newCompiler[0]));
                oldCompiler.removeAttr('hidden');
                $('#compiler').trigger('vjContentNew');
            }

            selectDefaultTab(/* forceRechoose= */ !userSelectedTab);
        });
    };
}));