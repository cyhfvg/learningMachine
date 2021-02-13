/* @Copyright:
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
 * @Date: 2021-02-13
 * @LastEditTime: 2021-02-13
 * @Github: https://github.com/cyhfvg/learningMachine
 * @Description: 项目入口
 */

const concat = require("concat-stream");
const express = require("express");
const fs = require("fs");
const log4js = require("./utils/log4js");
const path = require("path");
const toml = require("toml");
const parser = require("./utils/parserUtils");

/**
 * 定义express app
 */
const app = express();

/**
 * 开启服务器方法 内含参数定义、express设置
 */
async function startServer() {
  await fs.createReadStream("./configs/default.toml", "utf8").pipe(
    concat(function (data) {
      /**
       * 获取全部配置
       */
      global.config = toml.parse(data);

      /**
       * 设置参数
       */
      setParameters();

      /**
       * 设置 express
       */
      setExpress();

      /**
       * 开启服务器
       */
      app.listen(global.config.global.port, function () {
        global.logger.log("项目启动完毕……初始化……");
        init();
        global.logger.log("初始化完毕……加油!!!");
        init();
      });
    })
  );
}

startServer();

/**
 * 数据初始化
 */
function init() {
  console.log("初始化");
  global.logger.log("初始化数据");
}

/**
 * 相关参数设置
 */
function setParameters() {
  global.logger = log4js.logger;
  global.pool = require("./utils/mysql/pool");
}

/**
 * Express 相关设置
 */
function setExpress() {
  /**
   * 设置express静态资源目录
   */
  app.use(express.static(path.join(__dirname, "public")));

  /**
   * express 使用 log4js 中间件
   */
  app.use(log4js.log4jConnectLogger);

  /**
   * 设置express模板引擎 为 ejs 引擎
   */
  app.set("engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  /**
   * 配置express url 中间件
   */
  app.use(parser.urlencoded);
  app.use(parser.jsonParser);
  app.use(parser.cookieParser);

  app.use("/", require(path.join(__dirname, "routers", "index")));
}
