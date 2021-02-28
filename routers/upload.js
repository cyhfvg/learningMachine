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
 * @LastEditTime: 2021-02-27
 * @Github: https://github.com/cyhfvg/learningMachine
 * @Description: 处理所有上传请求
 */

const axios = require("axios");
const dateUtil = require("../utils/dateUtil");
const express = require("express");
const myMulter = require("../utils/multer");
const parser = require("../utils/parserUtils");
const stageUtil = require("../utils/stageUtil");
const transaction = require("../utils/mysql/transaction");
const xlsx = require("../utils/xlsx");

let router = express.Router();

/**
 * 每知识点 excel 文件上传
 */
router.post("/pointFileUpload", myMulter.single("file"), (req, res) => {
  let subjectId = req.body.subjectId;
  console.log(subjectId);
  let file = req.file;

  let localFile = file.path;

  let excelPoints = xlsx.getExcelData(localFile);
  let tms_tanngo_id;
  // 获取 插入时需要的主键id
  global.pool.getConnection(function (err, connection) {
    connection.query(
      "select subjectId from subjects;",
      (error, results, fields) => {
        if (error) {
          // Todo: mysql 连接成功；更换对应mysql表
          global.logger.error("查询学科id失败" + error);
          return;
        } else {
          if (results.length === 0) {
            let resData = {
              meta: false,
            };
            res.send(resData);
            return;
          }
          // 执行事务插入
          transaction.execTrans(() => {
            let sql =
              "INSERT INTO points (hintA, hintB, hintC, studyDate, stage)" +
              " values(?,?,?,?,?);" +
              "INSERT INTO subject_points SELECT '" +
              subjectId +
              "' as subjectId, LAST_INSERT_ID();";
            let sqlparamsEntities = [];
            for (let index = 0; index < excelPoints.length; index++) {
              const element = excelPoints[index];

              if (element.hintC === "") {
                element.hintC = "无内容";
              }
              let params = [];
              [...params] = [
                element.hintA,
                element.hintB,
                element.hintC,
                dateUtil.getZeroDate(),
                stageUtil.getFirstStage(),
              ];
              // console.log(JSON.parse(JSON.stringify(params)));
              // 添加入 sqlparamsEntities中
              sqlparamsEntities.push({ sql: sql, params: params });
            }
            return sqlparamsEntities;
          });
          let resData = {
            meta: true,
          };
          res.send(resData);
        }
      }
    );
    connection.release();
  });
});

/**
 * NOTE: 从 nihonngonobennkyo 中获取单词
 */
router.get("/getFromNhg", (req, res) => {
  axios
    .get("http://localhost:1813/everyday/getAllWord", {})
    .then((response) => {
      console.dir(response.data);
      let flag = response.data.meta;
      let word = response.data.data;
      if (flag) {
        let myWord = [];
        for (i = 0; i < word.length; i++) {
          let element = {};
          element.hintB = word[i].imi;
          element.hintC = "";
          if (word[i].akusennto !== "") {
            element.hintC += "アクセント: " + word[i].akusennto + "; ";
          }
          if (word[i].kannji !== "") {
            element.hintA = word[i].kannji;
            element.hintC += "假名: " + word[i].tanngo + "; ";
          } else {
            element.hintA = word[i].tanngo;
          }
          if (word[i].type !== "") {
            element.hintC += "类型: " + word[i].type + "; ";
          }
          myWord.push(element);
        }

        // 执行事务插入
        transaction.execTrans(() => {
          let sql =
            "INSERT INTO points (hintA, hintB, hintC, studyDate, stage)" +
            " values(?,?,?,?,?);" +
            "INSERT INTO subject_points SELECT '" +
            1 +
            "' as subjectId, LAST_INSERT_ID();";
          let sqlparamsEntities = [];
          for (let index = 0; index < myWord.length; index++) {
            const element = myWord[index];

            if (element.hintC === "") {
              element.hintC = "无内容";
            }
            let params = [];
            [...params] = [
              element.hintA,
              element.hintB,
              element.hintC,
              dateUtil.getZeroDate(),
              stageUtil.getFirstStage(),
            ];
            console.log(JSON.parse(JSON.stringify(params)));
            // 添加入 sqlparamsEntities中
            sqlparamsEntities.push({ sql: sql, params: params });
          }
          return sqlparamsEntities;
        });
      }
    });
});

module.exports = router;
