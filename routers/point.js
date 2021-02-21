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
 * @Date: 2021-02-20
 * @LastEditTime: 2021-02-20
 * @Github: https://github.com/cyhfvg/learningMachine
 * @Description: 知识点路由
 */

const express = require("express");

let router = express.Router();

/**
 * 获取每天的任务单词 (一次获取全部)
 */
router.post("/points", (req, res) => {
  let resData = {
    meta: global.everydayPoint.point,
  };
  res.send(resData);
});

module.exports = router;
