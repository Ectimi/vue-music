/**
 * 
 * @param {Array} arr 
 * @param {String} sign 
 * @param {String} key 
 * @returns {String}
 * @description 遍历对象数组，根据指定的 key和sign,拼接生成字符串
 * @example joinObjectArray([{name:'a',age:12},{name:'b',age:19},{name:'c',age:22}],'/','name') => 'a/b/c'
 */
function joinObjectArray(arr, sign, key) {
    let result = "";
    for (let i = 0, len = arr.length; i < len; i++) {
        if (i !== len - 1) {
            result += arr[i][key] + sign;
        } else {
            return (result += arr[i][key]);
        }
    }
    return result;
}

/**
 * 
 * @param {Any} v 
 * @returns {Boolean}
 * @description 根据传入的参数判断其是否为空
 */
function isEmpty(v) {
    switch (typeof v) {
        case 'undefined':
            return true;
        case 'string':
            if (v.replace(/(^[ \t\n\r]*)|([ \t\n\r]*$)/g, '').length == 0) return true;
            break;
        case 'boolean':
            if (!v) return true;
            break;
        case 'number':
            if (0 === v || isNaN(v)) return true;
            break;
        case 'object':
            if (null === v || v.length === 0) return true;
            for (var i in v) {
                return false;
            }
            return true;
    }
    return false;
}

/**
 * 
 * @param {String} phone 
 * @returns {Boolean}
 * @description 判断参数的格式是否为手机号
 */
function checkPhone(phone) {
    let reg = /^1[3456789]\d{9}$/;
    return reg.test(phone)
}

/**
 * 
 * @param {Function} func 函数
 * @param {Number} wait 毫秒数
 * @description 函数防抖
 */
function debounce(func, wait) {
    var timeout;
    return function () {
        clearTimeout(timeout)
        timeout = setTimeout(func, wait);
    }
}

/**
 *@description 把秒数格式化
 * @param {Number} s 秒数
 */
function s_to_hs(s) {
    //计算分钟
    //算法：将秒数除以60，然后下舍入，既得到分钟数
    var h;
    h = Math.floor(s / 60);
    //计算秒
    //算法：取得秒%60的余数，既得到秒数
    s = s % 60;

    //小于10补0
    h = h < 10 ? '0' + h : h;
    s = s < 10 ? '0' + s : s;
    return h + ':' + s;
}

/**
 * @description 生成 min ≤ r ≤ max 范围的随机数
 * @param {Number} Min 
 * @param {Number} Max 
 */
function RandomNumBoth(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range); //四舍五入
    return num;
}

function getStyle(selector, prop) {
    return parseFloat(
        getComputedStyle(document.querySelector(selector))[prop]
    );
}

export {
    joinObjectArray,
    isEmpty,
    checkPhone,
    debounce,
    s_to_hs,
    RandomNumBoth,
    getStyle
}