import {
    i18n, pjax, request, tpl, NamedPage, Notification, $, addPage
} from '@hydrooj/ui-default';

addPage(new NamedPage(['announce_main', 'homepage'], () => {
    console.log('Powered by OpenBPJudge Project https://github.com/BPJudge/open-bpjudge');
    const style = document.createElement('style');
    document.head.appendChild(style);
    style.sheet.insertRule(`.discussion__item { border-left: 5px solid transparent;}`, style.sheet.cssRules.length);
    style.sheet.insertRule(`.discussion__item.highlight { border-left: 5px solid #df6589 }`, style.sheet.cssRules.length);
    style.sheet.insertRule(`.discussion__title { font-size: 20px; line-height: 1.2em; margin-bottom: 10px; }`, style.sheet.cssRules.length);
    style.sheet.insertRule(`.discussion__title a:visited { color: #bbb; }`, style.sheet.cssRules.length);
    style.sheet.insertRule(`.discussion__replies { width: 70px; }`, style.sheet.cssRules.length);
}));