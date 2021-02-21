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
 * @Description: 洗牌算法 测试类
 */

const shuffle = require("../utils/shuffle");

// // 显示原来数据
// showArray(data);
// console.log();
// // 洗牌
// shuffle.shuffle(data);
// showArray(data);
// console.log();
// // 排序显示
// showArray(sort(data));
// console.log();

const data = [];
for (let i = 1; i < 1000; i++) {
  data.push(i);
}
for (let i = 0; i < 1000; i++) {
  let testData = data;
  shuffle.shuffle(testData);
  let sortedSourceData = sort(data);
  let sortedShuffledData = sort(testData);
  if (!equal(sortedSourceData, sortedShuffledData)) {
    console.log("have errors");
    // 显示原来数据
    showArray(sort(sortedSourceData));
    console.log();
    showArray(sortedShuffledData);
    console.log();
  } else {
    // process.stdout.write(i + "");
    // console.log(i + " ");
  }
}

function showArray(array) {
  for (let i = 0; i < array.length; i++) {
    process.stdout.write(array[i] + " ");
  }
}

function sort(data) {
  let testData = data;
  for (let i = 0; i < testData.length; i++) {
    for (let j = i; j < testData.length; j++) {
      if (testData[j] < testData[i]) {
        let tmp = testData[i];
        testData[i] = testData[j];
        testData[j] = tmp;
      }
    }
  }
  return testData;
}

function equal(a, b) {
  // 判断数组的长度
  if (a.length !== b.length) {
    return false;
  } else {
    // 循环遍历数组的值进行比较
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }
    return true;
  }
}
