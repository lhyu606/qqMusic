function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function getRandomSubArr (arr, length) {
  var nArr = [];
  var cpArr = copyArr(arr);
  var len = arr.length;
  for (var i=0; i<length; i++) {
    var idx = randomNum(0, cpArr.length);
    nArr.push(cpArr.slice(idx, idx+1)[0]);
  }
  return nArr;
}

function randomNum (min, max) {
  return parseInt(Math.random() * (max - min + 1)) + min;
}

function copyArr (arr) {
  var nArr = [];
  for (var i=0, length=arr.length; i<length; i++) {
    nArr.push(arr[i]);
  }
  return nArr;
}

export default {
  formatNumber,
  formatTime,
  getRandomSubArr,
  randomNum,
  copyArr
}
