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
 * @Description: 实现洗牌算法，将一个数组打乱顺序
 */

module.exports.shuffle = function (array) {
  for (let i = 0; i < array.length; i++) {
    swap(array, i, getRandIndex(array, i));
  }
};

/**
 * 用于交换指定数组的指定两个下标元素
 * @param {array} array 需要交换位置的数组
 * @param {int} indexA 需要交换的元素下标A
 * @param {int} indexB 需要交换的元素下标B
 */
function swap(array, indexA, indexB) {
  let tmp = array[indexA];
  array[indexA] = array[indexB];
  array[indexB] = tmp;
}

/**
 * 返回从数组{startIndex}下标至尾部范围中的随机数
 * @param {array} array 需要获取元素下标的数组
 * @param {number} startIndex 从{startIndex}到数组尾部
 */
function getRandIndex(array, startIndex) {
  let range = array.length - startIndex;
  let rand = Math.random();
  return startIndex + Math.floor(rand * range);
}
