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
 * @Description: 艾宾浩斯阶段工具
 */
const dateUtil = require("./dateUtil");

/**
 * 艾宾浩斯阶段
 */
const stages = {
  zero: 0,
  one: 1,
  two: 2,
  three: 4,
  four: 7,
  five: 15,
};

/**
 * 记录阶段链表
 */
const nextStages = {
  zero: "one",
  one: "two",
  two: "three",
  three: "four",
  four: "five",
  five: "zero",
};

/**
 * 获取第一个阶段的名称
 */
module.exports.getFirstStage = function () {
  return Object.keys(stages)[0];
};

/**
 * [获取艾宾浩斯下个阶段]
 * @param {string} curStage 当前阶段
 */
module.exports.getNextStage = function (curStage) {
  let nextStage = nextStages[curStage];
  if (nextStage === undefined) {
    return "zero";
  }
  return nextStage;
};

/**
 * [根据当前阶段与当前日期计算下一个阶段的日期]
 * @param {Date} curDate 当前日期
 * @param {String} curStage 当前阶段
 */
module.exports.getNextStageDate = function (curDate, curStage) {
  // 0阶段的单词 下个阶段就是今天开始背
  if (curStage === "zero") {
    return dateUtil.getToday();
  }
  // 其它阶段的 下个阶段按照链表排列
  let nextDate = curDate;
  let stageLength = stages[curStage];
  if (stageLength === undefined) {
    return dateUtil.getZeroDate();
  }
  for (let i = 0; i < stageLength; i++) {
    nextDate = dateUtil.getNextDate(nextDate);
  }
  return nextDate;
};
