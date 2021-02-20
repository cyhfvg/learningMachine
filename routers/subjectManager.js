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
 * @Date: 2021-02-17
 * @LastEditTime: 2021-02-20
 * @Github: https://github.com/cyhfvg/learningMachine
 * @Description: 学科路由
 */

const express = require("express");
const router = express.Router();
const parserUtils = require("../utils/parserUtils");

router.post("/subject", parserUtils.jsonParser, function (req, res) {
  let subjectName = req.body.subjectName;
  let resData = { meta: false };

  if (subjectName === undefined) {
    resData.meta = false;
    res.send(resData);
    return;
  }

  /**
   * 检查数据库中是否已经存在此学科，不存在则插入
   */
  global.pool.getConnection(function (err, connection) {
    // Todo: sql补全，查询学科是否已存在
    let sql =
      "SELECT subjectId FROM subjects WHERE subjectName='" + subjectName + "';";
    connection.query(sql, (error, results, fields) => {
      if (error) {
        global.logger.error("查询学科是否存在失败.....");
        global.logger.error(error);
        resData.meta = false;
      } else {
        global.logger.info("查询学科是否存在成功......");
        global.logger.info("查询结果长度: " + results.length);
        if (results.length > 0) {
          resData.meta = false;
        } else {
          /**
           * 未存在此学科，插入
           */
          let sql =
            "INSERT INTO subjects (subjectName) VALUES ('" +
            subjectName +
            "');";
          global.pool.getConnection(function (err, connection) {
            connection.query(sql, (error, results, fields) => {
              if (error) {
                global.logger.error("添加学科失败.....");
                global.logger.error(error);
              } else {
                global.logger.info("添加学科成功......");
                resData.meta = true;
                res.send(resData);
              }
            });
            connection.release();
          });
        }
      }
    });
    connection.release();
  });
});

module.exports = router;
