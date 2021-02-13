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
 * @Description: log4js 配置
 */

let log4js = require("log4js");
log4js.configure({
  appenders: {
    console: {
      type: "console",
      layout: {
        type: "pattern",
        pattern: "%d %p %c %f:%l %m%n",
      },
    },
    file: {
      type: "dateFile",
      filename: "./logs/log",
      pattern: "_yyyy-MM-dd.log",
      // 文件名是否始终包含占位符
      alwaysIncludePattern: true,
      // 文件名是否绝对路径
      absolute: false,
    },
  },
  categories: {
    // 设置记录器的默认显示级别,低于这个级别的日志,不会输出
    // trace,debug,info,warn,error,fatal
    cheese: {
      appenders: ["file", "console"],
      level: "debug",
      enableCallStack: true,
    },
    default: {
      appenders: ["console"],
      level: "info",
      enableCallStack: true,
    },
  },
});

let logger = log4js.getLogger("cheese");

let log4jConnectLogger = log4js.connectLogger(logger, {
  level: "auto",
  format: (req, res, format) =>
    format(
      `:remote-addr "HTTP/:http-version :method :url :status ${JSON.stringify(
        req.body
      )}" ":user-agent"`
    ),
  // format: (req, res, format) => format(`:remote-addr - ${req.id} - ":method :url HTTP/:http-version" :status :content-length ":referrer" ":user-agent"`)
});

module.exports = {
  logger: logger,
  log4jConnectLogger: log4jConnectLogger,
};
