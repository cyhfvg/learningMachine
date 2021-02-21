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
 * @Description: 每日任务
 */

const dateUtil = require("../dateUtil");
const stageUtil = require("../stageUtil");
const syncUtil = require("../sync/syncUtil");
const transaction = require("../mysql/transaction");
const shuffleUtil = require("../shuffle");

/**
 * 获取每天背诵的任务
 */
module.exports.pullTodayPoint = function () {
  if (!isEverydayPointListEmpty()) {
    clearEverydayWordList();
  }
  getTodayNewPoint();
  getTodayReviewPoint();
};

function isEverydayPointListEmpty() {
  if (global.everydayPoint.point.length === 0) {
    return true;
  }
  return false;
}

/**
 * 清空全局知识点列表
 */
function clearEverydayWordList() {
  global.logger.debug("清空全局知识点列表......");
  syncUtil.checkResources(global.everydayPoint.semaphore);
  global.everydayPoint.point = [];
  syncUtil.releaseResources(global.everydayPoint.semaphore);
}

/**
 * 获取今天的背诵任务中的新出现知识点
 */
function getTodayNewPoint() {
  global.logger.debug("开始获取今天的新知识点......");
  global.pool.getConnection(function (err, connection) {
    let sql =
      "SELECT pointId, hintA, hintB, hintC, studyDate, stage " +
      "FROM points " +
      "WHERE stage = 'zero' " +
      "ORDER BY studyDate ASC,	pointId DESC	" +
      "LIMIT 0, " +
      global.config.global.listLength +
      ";";
    global.logger.debug(sql);
    connection.query(sql, function (error, results, fields) {
      if (error) {
        global.logger.error("获取新知识点出现错误: " + error);
        return;
      } else {
        global.logger.debug(
          "获取到今天共" + results.length + "个新知识点。处理中......"
        );
        global.logger.debug("今日新知识点处理完毕。放入全局容器中......");
        // Note:新知识点放入 全局容器中
        syncUtil.checkResources(global.everydayPoint.semaphore);
        global.everydayPoint.point = global.everydayPoint.point.concat(results);
        syncUtil.releaseResources(global.everydayPoint.semaphore);
      }
    });
    connection.release();
  });
}

/**
 * 获取今日背诵任务的复习知识点
 */
function getTodayReviewPoint() {
  global.logger.debug("开始获取今天的复习知识点......");
  global.pool.getConnection(function (err, connection) {
    let sql =
      "SELECT pointId, hintA, hintB, hintC, studyDate, stage " +
      "FROM points " +
      "WHERE studyDate = '" +
      dateUtil.getToday() +
      "' ORDER BY studyDate ASC, pointId DESC;";
    connection.query(sql, function (error, results, fields) {
      if (error) {
        global.logger.error("获取复习知识点出现错误: " + error);
        return;
      } else {
        global.logger.debug(
          "获取到今天共" + results.length + "个复习知识点。处理中......"
        );
        global.logger.debug("今日复习知识点处理完毕。放入全局容器中......");
        // Note:复习知识点放入 全局容器中
        syncUtil.checkResources(global.everydayPoint.semaphore);
        global.everydayPoint.point = global.everydayPoint.point.concat(results);
        syncUtil.releaseResources(global.everydayPoint.semaphore);
      }
    });
    connection.release();
  });
}

/**
 * 将每日任务的数据按规则处理好后，写回数据库中；
 */
module.exports.pushTodayPoint = function () {
  if (!checkGlobalPoint()) {
    global.logger.error("全局知识点列表为空,无法写入......");
    return;
  }
  global.logger.debug("开始进行每日背诵知识点回写......");
  beforePutTodayPoint();
  writeTodayPoint2Db();
};

/**
 * 对每日任务进行预处理
 */
function beforePutTodayPoint() {
  let point = global.everydayPoint.point;
  let singlePoint = {};
  global.logger.debug("开始对知识点回写进行预处理......");
  for (let i = 0; i < point.length; i++) {
    singlePoint = point[i];
    singlePoint.studyDate = stageUtil.getNextStageDate(
      singlePoint.studyDate,
      singlePoint.stage
    );
    singlePoint.stage = stageUtil.getNextStage(singlePoint.stage);
    point[i] = singlePoint;
  }
  syncUtil.checkResources(global.everydayPoint.semaphore);
  global.everydayPoint.point = point;
  syncUtil.releaseResources(global.everydayPoint.semaphore);
  global.logger.debug("回写知识点预处理完成。");
}

/**
 * 实际进行每日知识点写回
 */
function writeTodayPoint2Db() {
  global.logger.debug("开始写回今天的知识点......");
  transaction.execTrans(function () {
    let sql = "update points set studyDate =?, stage=? where pointId=?;";
    let sqlparamsEntities = [];
    let point = global.everydayPoint.point;
    for (let i = 0; i < point.length; i++) {
      let element = point[i];
      let params = [];
      [...params] = [element.studyDate, element.stage, element.pointId];
      // 添加对应参数至{sqlparamsEntities}
      sqlparamsEntities.push({ sql: sql, params: params });
    }
    global.logger.debug("数据准备完成。开始写回操作......");
    return sqlparamsEntities;
  });
}

function checkGlobalPoint() {
  let len = global.everydayPoint.point.length;
  if (len === 0) {
    return false;
  }
  return true;
}

/**
 * 打乱每日背诵任务
 */
module.exports.shufflePoints = function () {
  syncUtil.checkResources(global.everydayPoint.semaphore);
  global.logger.debug("打乱每日任务......");
  shuffleUtil.shuffle(global.everydayPoint.point);
  global.logger.debug("每日任务已被打乱......");
  syncUtil.releaseResources(global.everydayPoint.semaphore);
};
