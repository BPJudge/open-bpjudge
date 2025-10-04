# OpenBPJudge Project

基于 [Hydro](https://github.com/hydro-dev/Hydro) 框架，已适配最新版。

## frontend-bpjudge

-  用 uname color 代替 level badge。

对应规则：

```
{
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
}
```

- 简化页脚。

- 修改 `getListForRender` 方法，为 scoreboard 添加 uname color 支持。

- 题目列表、题目详情等页面以文字形式显示难度。

其中，difficulty 与文字难度对应如下：

difficulty 1-7 分别对应：

```
[
    "入门", "普及-", "普及/提高-", "普及+/提高", "提高+/省选-", "省选/NOI-", "NOI/NOI+"
];
```

其余难度为 "暂无评定"。

## onlineuser-bpjudge

路由 `/onlineuser`。查询五分钟内活动过的会话。


## activeuser-bpjudge

idea from [topscoding](https://topscoding.com/).

首页滚动展示两小时内活跃用户。

使用方法：

进入控制面板->系统设置->`hydrooj.homepage` 添加如下配置： `active_user: true` 保存即可。