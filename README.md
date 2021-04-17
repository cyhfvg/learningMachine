<!--
 * @Copyright:
 *
 * Copyright (c) 2021 ZhangGuangzhou
 * learningMachine is licensed under Mulan PubL v1.
 * You can use this software according to the terms and conditions of the Mulan PubL v1.
 * You may obtain a copy of Mulan PubL v1 at:
 *             http://license.coscl.org.cn/MulanPubL-1.0
 * THIS SOFTWARE IS PROVIDED ON AN "AS IS" BASIS, WITHOUT WARRANTIES OF ANY KIND,
 * EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO NON-INFRINGEMENT,
 * MERCHANTABILITY OR FIT FOR A PARTICULAR PURPOSE.
 * See the Mulan PubL v1 for more details.
 *
 * @Author: ZhangGuangzhou
 * @Date: 2021-02-08
 * @LastEditTime: 2021-02-08
 * @Github: https://github.com/cyhfvg/learningMachine
 * @Description: README
-->

# leaningMachine

## 概述

学习资料背诵辅助项目，宠物学习机。

- 脱胎于[日语单词背诵网站](https://github.com/cyhfvg/nihonngonobennkyo)
- 应用艾宾浩斯记忆曲线
- 手动上传额外背诵单词

## 应用技术

- BootStrap 4.5.2
- MySQL 10.1.44-MariaDB-0+deb9u1
- Nodejs v14.4.0
- 赫蹏

## 使用

1. 确保 **_Nodejs_** , **_MySQL_** 正确安装。

1. 将项目克隆到本地

   ```bash
   git clone git@github.com:cyhfvg/learningMachine.git
   ```

1. 安装依赖

   ```bash
   # 进入项目目录
   cd learningMachine
   # 安装Nodejs模块依赖
   yarn install
   ```

1. 根据 **_./docs_** 下 sql 文件创建数据库
1. **_./config/default.toml_** 中更改对应 MySQL 配置
1. 运行项目
   ```bash
   npm start
   ```
1. 可访问 **_http://localhost:4090_** 进入主页  
   **_./config_** 文件中可进行有限的设置

## 文档

- [开发愿景](./developmentVision.md)
- [开发日志](./developmentLogs.md)

## 许可

- 查看[木兰公共许可证](http://license.coscl.org.cn/MulanPubL-1.0)

- 遵从[语义化版本控制](https://semver.org/lang/zh-CN/)
