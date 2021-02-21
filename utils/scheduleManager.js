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
 * @Description: 封装定时任务 暴露出一个开始功能 在 express 起动时调用
 */

const everydayTask = require("./task/everydayTask");
const schedule = require("node-schedule");
const shuffleUtil = require("./shuffle");
const syncUtil = require("./sync/syncUtil");

/**
 * 每天将{背知识点数据}写入{数据库}
 */
const write2DbSchedule = () => {
  // 每天凌晨{3:00}写入任务
  // schedule.scheduleJob("40 * * * * *", () => {
  schedule.scheduleJob("0 0 3 * * *", () => {
    global.logger.debug("今日知识点任务背诵完成后写回数据库......");
    everydayTask.pushTodayPoint();
  });
};

/**
 * 每天将{每日需要背诵的知识点}从{数据库}中读出
 */
const readFromDbSchedule = () => {
  // 每天凌晨{4:00}拿取今天的任务
  // schedule.scheduleJob("20 * * * * *", () => {
  schedule.scheduleJob("0 0 4 * * *", () => {
    global.logger.debug("从数据库中获取今日背诵任务......");
    everydayTask.pullTodayPoint();
  });
};

/**
 * 每天将{每日任务}打乱，防止总结的相似知识点聚集
 */
const shufflePoints = () => {
  // schedule.scheduleJob("30 0 0 * * *", () => {
  schedule.scheduleJob("0 30 4 * * *", () => {
    global.logger.debug("获取数据后开始打乱今日背诵任务......");
    everydayTask.shufflePoints();
  });
};

/**
 * 用数组维护任务列表
 */
const tasks = [write2DbSchedule, readFromDbSchedule, shufflePoints];

module.exports.startTasks = function () {
  for (let i = 0; i < tasks.length; i++) {
    tasks[i]();
  }
};
