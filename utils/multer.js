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
 * @Description: 自定义 multer 中间件
 */

const multer = require("multer");
const path = require("path");
const uuid = require("uuid");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(global.config.global.path, "upload/"));
  },
  filename: function (req, file, cb) {
    // uuid.jpg / uuid.png ...
    cb(null, uuid.v1() + path.extname(file.originalname).toLowerCase());
  },
});

// let fileFilter = function (req, file, cb) {
//   // note: 限制上传文件类型 png/jpeg
//   if (
//     file.mimetype ===
//     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'"
//   ) {
//     cb(null, true);
//   } else {
//     cb(null, false);
//   }
// };

let upload = multer({
  storage: storage,
  // fileFilter: fileFilter,
});

module.exports = upload;
