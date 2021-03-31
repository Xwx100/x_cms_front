// 全局 函数

/**
 * php 函数
 */
const php = {
  array_intersect(arr1) { // eslint-disable-line camelcase
    //  discuss at: https://locutus.io/php/array_intersect/
    // original by: Brett Zamir (https://brett-zamir.me)
    //      note 1: These only output associative arrays (would need to be
    //      note 1: all numeric and counting from zero to be numeric)
    //   example 1: var $array1 = {'a' : 'green', 0:'red', 1: 'blue'}
    //   example 1: var $array2 = {'b' : 'green', 0:'yellow', 1:'red'}
    //   example 1: var $array3 = ['green', 'red']
    //   example 1: var $result = array_intersect($array1, $array2, $array3)
    //   returns 1: {0: 'red', a: 'green'}
    const retArr = {}
    const argl = arguments.length
    const arglm1 = argl - 1
    let k1 = ''
    let arr = {}
    let i = 0
    let k = ''
    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
      arrs: for (i = 1; i < argl; i++) { // eslint-disable-line no-labels
        arr = arguments[i]
        for (k in arr) {
          if (arr[k] === arr1[k1]) {
            if (i === arglm1) {
              retArr[k1] = arr1[k1]
            }
            // If the innermost loop always leads at least once to an equal value,
            // continue the loop until done
            continue arrs// eslint-disable-line no-labels
          }
        }
        // If it reaches here, it wasn't found in at least one array, so try next value
        continue arr1keys// eslint-disable-line no-labels
      }
    }
    return retArr
  },
  array_diff(arr1) { // eslint-disable-line camelcase
    //  discuss at: https://locutus.io/php/array_diff/
    // original by: Kevin van Zonneveld (https://kvz.io)
    // improved by: Sanjoy Roy
    //  revised by: Brett Zamir (https://brett-zamir.me)
    //   example 1: array_diff(['Kevin', 'van', 'Zonneveld'], ['van', 'Zonneveld'])
    //   returns 1: {0:'Kevin'}
    const retArr = {}
    const argl = arguments.length
    let k1 = ''
    let i = 1
    let k = ''
    let arr = {}
    arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
      for (i = 1; i < argl; i++) {
        arr = arguments[i]
        for (k in arr) {
          if (arr[k] === arr1[k1]) {
            // If it reaches here, it was found in at least one array, so try next value
            continue arr1keys // eslint-disable-line no-labels
          }
        }
        retArr[k1] = arr1[k1]
      }
    }
    return retArr
  }
}

/**
 * 后端 函数
 */
const back = {
  resIsOk(res) {
    return !(!res.hasOwnProperty('code') || (res.code !== 20000 && res.code !== 0))
  },
}

/**
 * 无业务函数
 */
let _myCommon = {
  log(...args) {
    console.log(...args)
  },
  logByEnv(...args) {
    if (process.env.NODE_ENV === 'development') {
      this.log(...args)
    }
  },
  // 判断变量 是否已经定义
  isNull(variable) {
    const type = this.getType(variable)
    return type === null || type === undefined || Number.isNaN(variable)
  },
  isArray(variable) {
    return this.getType(variable) === Array
  },
  isObject(variable) {
    return this.getType(variable) === Object
  },
  isFunc(variable) {
    return this.getType(variable) === Function
  },
  isNumeric(variable) {
    const type = this.getType(variable);
    return !Number.isNaN(variable) && ((type === String && /\d+/.test(variable)) || type === Number)
  },
  isEmpty(variable) {
    const type = this.getType(variable)
    if (type === Object || type === Array) {
      return Object.keys(variable).length === 0
    }
    return !variable
  },
  toArray(variable) {
    if (this.isArray(variable)) {
      return variable;
    } else {
      return [variable]
    }
  },
  // obj2.key必须存在于obj.key前提下 合并
  assignIn: function (obj, obj2) {
    return new Promise((resolve, reject) => {
      if (!_myCommon.isObject(obj2)) {
        return obj;
      }
      let doAssign = false; // 有更新值 才执行
      if (_myCommon.isObject(obj)) {
        for (let k in obj) {
          if (obj2.hasOwnProperty(k) && obj[k] !== obj2[k]) {
            doAssign = true;
            obj[k] = _myCommon.cloneObjByJson(obj2[k])
          }
        }
      }
      if (doAssign) {
        return resolve(doAssign)
      }
    })
  },
  cloneObjByJson(obj) {
    return JSON.parse(JSON.stringify(obj))
  },
  // 判断url锚点是否带有参数
  notInQuery() {
    return new Promise((resolve, reject) => {
      if (location.hash.indexOf('?') === -1) {
        return resolve()
      }
    })
  },
  // string number array obj
  getType(variable) {
    const type = {
      '[object Array]': Array,
      '[object Object]': Object,
      '[object Function]': Function,
      '[object Number]': Number,
      '[object String]': String,
      '[object Boolean]': Boolean,
      '[object Null]': null,
      '[object undefined]': undefined
    }
    return type[Object.prototype.toString.call(variable)]
  },
  // 获取 默认值
  getValue(obj, key, def) {
    return this.isNull(obj[key]) ? def : obj[key]
  },
  // 获取 多个值
  getValueMulti(obj, key, format = null) {
    if (this.isEmpty(key)) {
      return obj
    }

    let arrKey = this.toArray(key)
    let value = []
    for (let k in arrKey) {
      let v = arrKey[k]
      let vv = this.getValuePoint(obj, v, '')
      value.push(this.isFunc(format) ? format(vv) : vv)
    }
    return value
  },
  // 点式获取
  getValuePoint(obj, key, def = null) {
    if (this.isNull(obj)) {
      return def
    }
    if (-1 !== key.indexOf('.')) {
      const tmp = key.split('.')
      return this.getValuePoint(obj[tmp[0]], tmp[1], def)
    }
    return this.getValue(obj, key, def)
  },
  ...back,
  php: php
}

window._myCommon = _myCommon


