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
 * @Description: 此为批量向数据库中插入单词方法
 */

const async = require("async");

/**
 * sqlparamsEntities => [{sql: 'update ...', params: [param1, param2]}]
 * @param {function} prepareInsert 预先处理插入数据的函数，返回sqlparamsEntities
 */
function execTransaction(prepareInsert) {
  let sqlparamsEntities = prepareInsert();
  global.pool.getConnection((err, connection) => {
    if (err) {
      throw err;
    }
    connection.beginTransaction((err) => {
      if (err) {
        throw err;
      }
      global.logger.debug(
        "开始执行transaction...共执行" +
          sqlparamsEntities.length +
          "条数据......"
      );
      // 定义async串行执行的函数数组
      let funcArray = [];
      for (let index = 0; index < sqlparamsEntities.length; index++) {
        let element = sqlparamsEntities[index];
        let sql = element.sql;
        let params = element.params;
        // 定义串行执行的函数
        let func = function (cb) {
          // 执行插入
          connection.query(sql, params, (tErr, results, fields) => {
            if (tErr) {
              connection.rollback(function () {
                global.logger.debug(
                  "事务失败，" + element + ", Error: " + tErr
                );
                throw tErr;
              });
            } else {
              return cb(null, "ok");
            }
          });
        };
        // 添加串行执行的函数
        funcArray.push(func);
      }
      async.series(funcArray, (err, result) => {
        // 执行插入时 遇到错误 则回滚
        if (err) {
          connection.rollback((err) => {
            global.logger.error("transaction err: " + err);
            connection.release();
            return;
          });
        } else {
          connection.commit((err, info) => {
            global.logger.info("transaction info: " + JSON.stringify(info));
            if (err) {
              // 提交时出现错误 回滚
              global.logger.error("事务执行失败, " + err);
              connection.rollback((err) => {
                global.logger.error("transaction error: " + err);
                connection.release();
                return;
              });
            } else {
              // 正常执行释放资源
              global.logger.debug("transaction info:" + result);
              connection.release();
              return;
            }
          });
        }
      });
    });
  });
}

module.exports = {
  execTrans: execTransaction,
};
