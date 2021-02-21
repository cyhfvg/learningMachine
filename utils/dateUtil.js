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
 * @Description: date 工具类
 */

const { retry } = require("async");

/**
 * 扩展Date的Format函数
 * 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * @param {[type]} fmt [description]
 */
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};

/**
 * [getYesterday 获得昨天的格式化日期]
 * @return {[type]} [description]
 */
module.exports.getYesterday = function () {
  return new Date(new Date().getTime() - 1000 * 60 * 60 * 24).Format(
    "yyyy-MM-dd"
  );
};

/**
 * [getToday 获得今天的格式化日期]
 * @return {[type]} [description]
 */
module.exports.getToday = function () {
  return new Date().Format("yyyy-MM-dd");
};

/**
 * [getTomorrow 获得明天的格式化日期]
 * @return {[type]} [description]
 */
module.exports.getTomorrow = function () {
  return new Date(new Date().getTime() + 1000 * 60 * 60 * 24).Format(
    "yyyy-MM-dd"
  );
};

/**
 * [getWantDate 获得指定日期的格式化日期]
 * @param {String} str
 */
module.exports.getWantDate = function (str) {
  return new Date(str).Format("yyyy-MM-dd");
};

/**
 * 获取原点日期 "1111-11-11"
 */
module.exports.getZeroDate = function () {
  return this.getWantDate("1111-11-11");
};

/**
 * [获得指定日期的下一天]
 * @param {Date} date 指定日期
 */
module.exports.getNextDate = function (date) {
  let dateTime = new Date(date);
  return new Date(+dateTime + 1000 * 60 * 60 * 24).Format("yyyy-MM-dd");
};
