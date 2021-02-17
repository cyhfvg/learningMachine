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
 * @LastEditTime: 2021-02-17
 * @Github: https://github.com/cyhfvg/learningMachine
 * @Description: 学科路由
 */

const express = require("express");
const router = express.Router();
const parserUtils = require("../utils/parserUtils");

router.post("/class", parserUtils.jsonParser, function (req, res) {
  let { classId, className } = req.body;
  console.log(classId);
  console.log(className);
  //* 检查后插入数据库
  let resData = { meta: true };
  res.send(resData);
});

module.exports = router;
