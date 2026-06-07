# Test Report

测试日期：2026-06-07
测试版本：0.1.3
Minecraft 版本：Bedrock Dedicated Server 1.26.21.1
平台：Windows / BDS

## BDS 验收环境

- 测试服目录：`C:\Users\kaxm9\OneDrive\文档\New project\bds-oneblock-test`
- 测试世界：`OneBlockTest`
- 测试端口：`127.0.0.1:19172`
- 测试入口：`scriptevent oba:test ...`

## Results

| ID | Case | Result | Notes |
| --- | --- | --- | --- |
| T001 | 新建世界启用行为包 | pass | BDS Pack Stack 加载 `OneBlock Anki Survival` |
| T002 | 主世界生成 | bds-pass | 干净世界启动后自动创建 `oba_core` ticking area |
| T003 | 下界生成 | static-pass | 未添加 `dimensions/nether.json` |
| T004 | 末地生成 | static-pass | 未添加 `dimensions/the_end.json` |
| T005 | 初始余额 | static-pass | 默认值 5，需玩家加入后确认显示 |
| T006 | 破坏核心 | bds-pass | `oba:test refresh` 可推进刷新并写入实际核心 |
| T007 | 余额归零 | static-pass | 玩家路径会提示并打开 Anki UI，需客户端点验 |
| T008 | 刷题奖励 | static-pass | 5 题 +5，需客户端点验 UI |
| T009 | 非核心方块 | static-pass | 只匹配核心坐标 |
| T010 | 阶段推进 | bds-pass | 29->30 进入 plains，550->551 进入 ocean |
| T011 | 水兜底 | static-pass | 桶/冰安全形式 |
| T012 | 岩浆兜底 | static-pass | 桶/黑曜石链条 |
| T013 | 生物生成 | bds-smoke | 专服可召唤实体，完整自然刷怪需玩家环境验证 |
| T014 | 爆炸保护 | bds-smoke | 核心附近 TNT/creeper 召唤后核心仍存在 |
| T015 | 祭坛预留靠近 | static-pass | 96 格提示冷却，需玩家靠近点验 |
| T016 | 祭坛预留建造 | static-pass | 64 格拦截，需玩家放置点验 |
| T017 | 祭坛生成 | static-pass | 1500,64,0 |
| T018 | 末地入口 | static-pass | 只放框架不填眼 |
| T019 | 多人余额 | static-pass | player dynamic properties |
| T020 | 多人阶段 | bds-pass | world dynamic properties 由总刷新次数推进 |
| T021 | 重进世界 | static-pass | 不重置余额，需玩家重连点验 |
| T022 | 日志文件 | pass | 已更新 DEV_LOG 和 TEST_REPORT |
| T023 | Add-on 同时导入 BP/RP | build-pass | `.mcaddon` 包含 `OneBlockAnki_BP` 和 `OneBlockAnki_RP` |
| T024 | UUID 冲突修复 | pass | 0.1.1 起已更换 BP/RP header 与 module UUID |
| T025 | 初始虚空出生兜底 | bds-pass | 启动自动设置 world spawn 并放置核心 |
| T026 | 受重力方块不会吞核心 | bds-pass | plains/ocean 阶段核心实际方块稳定，不再由 gravel/sand 掉落 |
| T027 | BDS 快捷测试入口 | pass | `oba:test status/refresh/stage/refreshes` 可用 |

## Command Evidence

```text
tickingarea list all-dimensions -> oba_core preload
oba:test status -> core=minecraft:grass_block
oba:test refreshes 29 + refresh -> stage=plains actual=minecraft:birch_log
oba:test stage 4 + refresh -> stage=ocean actual=minecraft:prismarine
nearby TNT/creeper smoke -> core=minecraft:prismarine
```

## 未覆盖

1. 玩家客户端首次加入、表单 UI、Anki 答题奖励需要进服手动点验。
2. 双人同时挖核心需要两个客户端或自动化客户端补测。
3. 末地祭坛完整通关链需要长流程生存验证。
