# Test Report

测试日期：2026-06-06
测试版本：0.1.1
Minecraft 版本：待实机填写
平台：Windows / BDS 待实机填写

## Results

| ID | Case | Result | Notes |
| --- | --- | --- | --- |
| T001 | 新建世界启用行为包 | pending | 需要实机导入 |
| T002 | 主世界生成 | pending | 需要实机确认 void |
| T003 | 下界生成 | pending | 未添加 nether.json |
| T004 | 末地生成 | pending | 未添加 the_end.json |
| T005 | 初始余额 | static-pass | 默认值 5 |
| T006 | 破坏核心 | static-pass | before/after event 路径 |
| T007 | 余额归零 | static-pass | 只提示和打开 Anki UI |
| T008 | 刷题奖励 | static-pass | 5 题 +5 |
| T009 | 非核心方块 | static-pass | 只匹配核心坐标 |
| T010 | 阶段推进 | static-pass | 按总刷新次数 |
| T011 | 水兜底 | static-pass | 桶/冰安全形式 |
| T012 | 岩浆兜底 | static-pass | 桶/黑曜石链条 |
| T013 | 生物生成 | static-pass | 3-6 格安全平台 |
| T014 | 爆炸保护 | static-pass | 半径 6 过滤/修复 |
| T015 | 祭坛预留靠近 | static-pass | 96 格提示冷却 |
| T016 | 祭坛预留建造 | static-pass | 64 格拦截 |
| T017 | 祭坛生成 | static-pass | 1500,64,0 |
| T018 | 末地入口 | static-pass | 只放框架不填眼 |
| T019 | 多人余额 | static-pass | player dynamic properties |
| T020 | 多人阶段 | static-pass | world dynamic properties |
| T021 | 重进世界 | static-pass | 不重置余额 |
| T022 | 日志文件 | pass | 已更新 DEV_LOG 和 TEST_REPORT |
| T023 | Add-on 同时导入 BP/RP | static-pass | 0.1.1 `.mcaddon` 应包含 `OneBlockAnki_BP` 和 `OneBlockAnki_RP` |
| T024 | UUID 冲突修复 | static-pass | 0.1.1 已更换 BP/RP header 与 module UUID |
