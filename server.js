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
      global.config.global.path = __dirname;

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
        global.logger.debug("项目启动完毕……初始化……");
        init();
        global.logger.debug("初始化完毕……加油!!!");
      });
    })
  );
}

startServer();

/**
 * 数据初始化
 */
function init() {
  global.logger.debug("初始化数据");
}

/**
 * 相关参数设置
 */
function setParameters() {
  global.logger = log4js.logger;
  global.pool = require("./utils/mysql/pool");
  global.everydayPoint = {
    semaphore: 1,
    point: [
      { hintA: "hintA1", hintB: "hintB1", hintC: "hintC1" },
      { hintA: "hintA2", hintB: "hintB2", hintC: "hintC2" },
      { hintA: "hintA3", hintB: "hintB3", hintC: "hintC3" },
      { hintA: "hintA4", hintB: "hintB4", hintC: "hintC4" },
      { hintA: "hintA5", hintB: "hintB5", hintC: "hintC5" },
      { hintA: "hintA6", hintB: "hintB6", hintC: "hintC6" },
      { hintA: "hintA7", hintB: "hintB7", hintC: "hintC7" },
      { hintA: "hintA8", hintB: "hintB8", hintC: "hintC8" },
      { hintA: "hintA9", hintB: "hintB9", hintC: "hintC9" },
      { hintA: "hintA10", hintB: "hintB10", hintC: "hintC10" },
      { hintA: "hintA11", hintB: "hintB11", hintC: "hintC11" },
    ],
  };
  //  (hint.\d+)
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

  /**
   * 配置 express 路由
   */
  app.use(
    "/subjectManager",
    require(path.join(__dirname, "routers", "subjectManager"))
  );
  app.use("/", require(path.join(__dirname, "routers", "index")));
  app.use("/point", require(path.join(__dirname, "routers", "point")));
  app.use("/upload", require(path.join(__dirname, "routers", "upload")));
  app.use("/views", require(path.join(__dirname, "routers", "views")));
}
