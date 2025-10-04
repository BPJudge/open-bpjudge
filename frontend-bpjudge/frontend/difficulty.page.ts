import { $, _, addPage, NamedPage, UserSelectAutoComplete } from '@hydrooj/ui-default'

const DIFFICULTY_TEXTS = [
    "入门", "普及-", "普及/提高-", "普及+/提高", "提高+/省选-", "省选/NOI-", "NOI/NOI+", "暂无评定"
];

addPage(new NamedPage(['problem_main', 'training_detail'], async () => {
    function difficulty() {
        $("head").append("<style>.col--difficulty { width: 6.375rem!important; }</style>");
        const difficultyElements = Array.from(document.getElementsByClassName("col--difficulty"));
        for (let d of difficultyElements) {
            if (d.tagName.toLowerCase() === "th")
                continue;
            if ($(d).text() == "(无)") {
                $(d).html('<span style="color: rgb(191, 191, 191); font-weight: bold;">暂无评定</span>');
                continue;
            }
            let oldtext = $(d).text();
            if (DIFFICULTY_TEXTS.includes(oldtext)) {
                continue;
            }
            let text = +$(d).text();
            if (text == 1) {
                $(d).html('<span style="color: rgb(254, 76, 97); font-weight: bold;">入门</span>');
            } else if (text == 2) {
                $(d).html('<span style="color: rgb(243, 156, 17); font-weight: bold;">普及-</span>');
            } else if (text == 3) {
                $(d).html('<span style="color: rgb(255, 193, 22); font-weight: bold;">普及/提高-</span>');
            } else if (text == 4) {
                $(d).html('<span style="color: rgb(82, 196, 26); font-weight: bold;">普及+/提高</span>');
            } else if (text == 5) {
                $(d).html('<span style="color: rgb(52, 152, 219); font-weight: bold;">提高+/省选-</span>');
            } else if (text == 6) {
                $(d).html('<span style="color: rgb(157, 61, 207); font-weight: bold;">省选/NOI-</span>');
            } else if (text == 7) {
                $(d).html('<span style="color: rgb(14, 29, 105); font-weight: bold;">NOI/NOI+</span>');
            } else {
                $(d).html('<span style="color: rgb(191, 191, 191); font-weight: bold;">暂无评定</span>');
            }
        }
    }
    await difficulty();
    $(document).on('vjContentNew', () => {
        console.log('vjContentNew triggered');
        difficulty();
    });
}));

addPage(new NamedPage(['problem_detail'], async () => {
    function difficulty() {
        $("head").append("<style>.col--difficulty { width: 6.375rem!important; }</style>");
        const difficultyElements = Array.from(document.getElementsByClassName("problem__tag-item"));
        for (let d of difficultyElements) {
            if ($(d).text() == "(无)") {
                $(d).html('<span style="color: rgb(191, 191, 191); font-weight: bold;">暂无评定</span>');
                continue;
            }
            let oldtext = $(d).text();
            if (DIFFICULTY_TEXTS.includes(oldtext)) {
                continue;
            }
            if ($(d).text().startsWith("难度: ")) {
                let text = +$(d).text().split(": ")[1];
                if (text == 1) {
                    $(d).html('<span style="color: rgb(254, 76, 97); font-weight: bold;">入门</span>');
                } else if (text == 2) {
                    $(d).html('<span style="color: rgb(243, 156, 17); font-weight: bold;">普及-</span>');
                } else if (text == 3) {
                    $(d).html('<span style="color: rgb(255, 193, 22); font-weight: bold;">普及/提高-</span>');
                } else if (text == 4) {
                    $(d).html('<span style="color: rgb(82, 196, 26); font-weight: bold;">普及+/提高</span>');
                } else if (text == 5) {
                    $(d).html('<span style="color: rgb(52, 152, 219); font-weight: bold;">提高+/省选-</span>');
                } else if (text == 6) {
                    $(d).html('<span style="color: rgb(157, 61, 207); font-weight: bold;">省选/NOI-</span>');
                } else if (text == 7) {
                    $(d).html('<span style="color: rgb(14, 29, 105); font-weight: bold;">NOI/NOI+</span>');
                } else {
                    $(d).html('<span style="color: rgb(191, 191, 191); font-weight: bold;">暂无评定</span>');
                }
            }
        }
    }
    await difficulty();
    $(document).on('vjContentNew', () => {
        console.log('vjContentNew triggered');
        difficulty();
    });
}));


addPage(new NamedPage(['problem_edit', 'problem_create'], async () => {
    function select() {
        const element = document.querySelector('div[name="form_item_difficulty"]');
        if (element) {
            const select = document.createElement('select');
            select.name = 'difficulty';
            select.className = 'select';
            const difficultyOptions = [
                { value: 1, text: '入门', color: 'rgb(254, 76, 97)' },
                { value: 2, text: '普及-', color: 'rgb(243, 156, 17)' },
                { value: 3, text: '普及/提高-', color: 'rgb(255, 193, 22)' },
                { value: 4, text: '普及+/提高', color: 'rgb(82, 196, 26)' },
                { value: 5, text: '提高+/省选-', color: 'rgb(52, 152, 219)' },
                { value: 6, text: '省选/NOI-', color: 'rgb(157, 61, 207)' },
                { value: 7, text: 'NOI/NOI+', color: 'rgb(14, 29, 105)' },
                { value: 8, text: '暂无评定', color: 'rgb(191, 191, 191)' }
            ];
            difficultyOptions.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option.value;
                opt.textContent = option.text;
                opt.style.color = option.color;
                opt.style.fontWeight = 'bold'; // 加粗选项文本
                select.appendChild(opt);
            });
            const input = element.querySelector('input[name="difficulty"]');
            if (input) {
                if (input.value) {
                    select.value = input.value;
                }
                element.replaceChild(select, input);
            }
            element.className = 'select-container';
            let updateSelectColor = function () {
                const selectedValue = +select.value;
                const selectedOption = difficultyOptions.find(opt => opt.value == selectedValue);
                if (selectedOption) {
                    select.style.color = selectedOption.color;
                    select.style.fontWeight = 'bold';
                }
            }
            updateSelectColor();
            select.addEventListener('change', updateSelectColor);
        }
    }
    $(document).on("vjContentNew", () => select());
    await select();
}));