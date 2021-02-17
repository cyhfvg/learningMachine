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
 * @Date: 2021-02-16
 * @LastEditTime: 2021-02-16
 * @Github: https://github.com/cyhfvg/learningMachine
 * @Description: 处理所有上传请求
 */

const dateUtil = require("../utils/dateUtil");
const express = require("express");
const myMulter = require("../utils/multer");
const parser = require("../utils/parserUtils");
const transaction = require("../utils/mysql/transaction");
const xlsx = require("../utils/xlsx");

let router = express.Router();

/**
 * 每单元单词excel文件上传
 */
router.post("/pointFileUpload", myMulter.single("file"), (req, res) => {
  let { bookId, unitId } = req.body;
  let zeroDate = dateUtil.getZeroDate();
  let file = req.file;

  let localFile = file.path;

  let excelTonngo = xlsx.getExcelData(localFile);
  let tms_tanngo_id;

  global.logger.debug("tms_tanngo_id: " + tms_tanngo_id);

  // 获取 插入时需要的主键id
  global.pool.getConnection(function (err, connection) {
    connection.query(
      "select nextVal from tms_tanngo_idgenerator",
      (error, results, fields) => {
        if (error) {
          // Todo: mysql 连接成功；更换对应mysql表
          global.logger.error("查询tms_tanngo_idgenerator出错" + error);
          return;
        } else {
          let temp = results[0].nextVal;
          tms_tanngo_id = results[0].nextVal;
          // 执行事务插入
          transaction.execTrans(() => {
            let sql =
              "insert into tms_tanngo(id, tanngo, akusennto, kannji, type, imi, date,bookid,unitid,dannkai)" +
              " values(?,?,?,?,?,?,?,?,?,?);" +
              "update tms_tanngo_idgenerator set nextVal = ?;";
            let sqlparamsEntities = [];
            for (let index = 0; index < excelTonngo.length; index++) {
              const element = excelTonngo[index];
              let params = [];
              let id = tms_tanngo_id;
              // 主键游标指向下一个
              tms_tanngo_id += 1;
              if (element.akusennto === "") {
                element.akusennto = -1;
              }
              [...params] = [
                id,
                element.tonngo,
                element.akusennto,
                element.kannji,
                element.type,
                element.imi,
                zeroDate,
                bookId,
                unitId,
                "zero",
                tms_tanngo_id,
              ];
              // console.log(JSON.parse(JSON.stringify(params)));
              // 添加入 sqlparamsEntities中
              sqlparamsEntities.push({ sql: sql, params: params });
            }
            return sqlparamsEntities;
          });
        }
      }
    );
    connection.release();
    let resData = {
      meta: true,
    };
    res.send(resData);
  });
});

module.exports = router;
