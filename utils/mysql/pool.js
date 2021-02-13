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
 * @Description: mysql 连接池
 */

const mysql = require("mysql");
const conf = global.config.mysql;

pool = mysql.createPool({
  connectionLimit: conf.connectionLimit,
  database: conf.database,
  host: conf.host,
  // 开启多条查询开关
  multipleStatements: conf.multipleStatements,
  password: conf.password,
  timezone: conf.timezone,
  user: conf.user,
});

module.exports = pool;
