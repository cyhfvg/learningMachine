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
 * @Description: 此工具对 xlsx 模块进行 自定义封装
 */

const xlsx = require("xlsx");

const sheet2JSONOpts = {
  // 给为空的单元格赋空值，而不是省略
  defval: "",
};

/**
 * 从excel文件中读取数据
 * @param {string} excelPath excel文件路径
 */
module.exports.getExcelData = function (excelPath) {
  excelFile = xlsx.read(excelPath, { type: "file" });
  const results = xlsx.utils.sheet_to_json(
    excelFile.Sheets[excelFile.SheetNames[0]],
    sheet2JSONOpts
  );
  return results;
};
