const nameColor = {
    'mod': '#6f00ff',
    'su': '#6f00ff',
    'pu': '#AD8B00',
    'lv0': '#c2ccd0',
    'lv1': '#c2ccd0',
    'lv2': '#c2ccd0',
    'lv3': '#0e90d2',
    'lv4': '#0e90d2',
    'lv5': '#00bc12',
    'lv6': '#00bc12',
    'lv7': '#ff8936',
    'lv8': '#ff8936',
    'lv9': '#ff3300',
    'lv10': '#ff3300',
};
const badgeBgColor = {
    'mod': '#cf70ab',
    'su': '#6f00ff',
    'pu': '#AD8B00',
    'lv0': '#efefef',
    'lv1': '#9db4bd',
    'lv2': '#9db4bd',
    'lv3': '#73c3bc',
    'lv4': '#73c3bc',
    'lv5': '#81ba6c',
    'lv6': '#81ba6c',
    'lv7': '#f7b200',
    'lv8': '#ff9251',
    'lv9': '#eb6363',
    'lv10': '#575757',
};
const badgeTextColor = {
    'mod': '#FFF',
    'su': '#FFF',
    'pu': '#FFF',
    'lv0': '#727171',
    'lv1': '#FFF',
    'lv2': '#FFF',
    'lv3': '#FFF',
    'lv4': '#FFF',
    'lv5': '#FFF',
    'lv6': '#FFF',
    'lv7': '#FFF',
    'lv8': '#FFF',
    'lv9': '#FFF',
    'lv10': '#FFF',
};

console.log('Powered by BPJudge https://github.com/BPJudge');

const style = document.createElement('style');
document.head.appendChild(style);

// style.sheet.insertRule(
//     `.row { max-width: 1400px; }`,
//     style.sheet.cssRules.length
// );
// 修改页宽

for (const key in nameColor) {
    const className = `.uname--${key}`;
    const colorValue = nameColor[key];
    style.sheet.insertRule(
        `${className} { color: ${colorValue} !important; font-weight: bold; }`,
        style.sheet.cssRules.length
    );
}

for (const key in badgeBgColor) {
    const className = `.badge--${key}`;
    const colorValue = badgeBgColor[key];
    style.sheet.insertRule(
        `${className} { background-color: ${badgeBgColor[key]} !important; color: ${badgeTextColor} !important }`,
        style.sheet.cssRules.length
    );
}