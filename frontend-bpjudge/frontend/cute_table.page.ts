import { addPage, AutoloadPage } from '@hydrooj/ui-default';

addPage(new AutoloadPage('cute_table', () => {
  const style = document.createElement('style');
  document.head.appendChild(style);

  style.sheet.insertRule(
    `table.cute-table.tuack {
      overflow: auto;
      margin: .5em auto;
    }`,
    style.sheet.cssRules.length,
  );

  style.sheet.insertRule(
    `table.cute-table.tuack tr > *:not(:first-child) {
      border-left: 1px solid #404040;
    }`,
    style.sheet.cssRules.length,
  );

  style.sheet.insertRule(
    `table.cute-table.tuack td,
     table.cute-table.tuack th {
      border: none;
    }`,
    style.sheet.cssRules.length,
  );

  style.sheet.insertRule(
    `table.cute-table.tuack th {
      font-weight: 400;
    }`,
    style.sheet.cssRules.length,
  );

  style.sheet.insertRule(
    `table.cute-table.tuack {
      border-top: 5px solid #404040;
      border-bottom: 5px solid #404040;
    }`,
    style.sheet.cssRules.length,
  );

  style.sheet.insertRule(
    `table.cute-table.tuack thead {
      border-bottom: 3px solid currentcolor;
    }`,
    style.sheet.cssRules.length,
  );

  style.sheet.insertRule(
    `table.cute-table.tuack tr:not(:last-child) {
      border-bottom: 1px solid currentcolor;
    }`,
    style.sheet.cssRules.length,
  );

  style.sheet.insertRule(
    `.typo table.cute-table.tuack thead th {
      background: transparent !important;
    }`,
    style.sheet.cssRules.length,
  );

  style.sheet.insertRule(
    `.typo table.cute-table.tuack,
    .typo table.cute-table.tuack th,
    .typo table.cute-table.tuack td {
      color: #000 !important;
    }
    `,
    style.sheet.cssRules.length,
  );

  // .theme--dark
  style.sheet.insertRule(
    `.theme--dark table.cute-table.tuack tr > *:not(:first-child) {
      border-left: 1px solid #eee;
    }`,
    style.sheet.cssRules.length,
  );

  style.sheet.insertRule(
    `.theme--dark table.cute-table.tuack {
      border-top: 5px solid #eee;
      border-bottom: 5px solid #eee;
    }`,
    style.sheet.cssRules.length,
  );

  style.sheet.insertRule(
    `.theme--dark table.cute-table.tuack thead {
      border-bottom: 3px solid #eee;
    }`,
    style.sheet.cssRules.length,
  );

  style.sheet.insertRule(
    `.theme--dark table.cute-table.tuack tr:not(:last-child) {
      border-bottom: 1px solid #eee;
    }`,
    style.sheet.cssRules.length,
  );

  style.sheet.insertRule(
    `.theme--dark .typo table.cute-table.tuack,
     .theme--dark .typo table.cute-table.tuack th,
     .theme--dark .typo table.cute-table.tuack td {
      color: #eee !important;
    }`,
    style.sheet.cssRules.length,
  );
}));
