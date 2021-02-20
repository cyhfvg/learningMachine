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
 * @Description: 页面路由转发
 */

let express = require("express");
let parser = require("../utils/parserUtils");

let router = express.Router();

/**
 * 单词上传
 */
router.get("/pointUploadPage", parser.urlencoded, (req, res) => {
  res.render("pointUpload.ejs");
});

/**
 * 学科管理页面
 */
router.get("/classManagerPage", parser.urlencoded, (req, res) => {
  res.render("subjectManagerPage.ejs");
});

module.exports = router;
