// 全局函数
import Vue from 'vue'

const install = function (Vue, options) {
  Vue.prototype._myCommon = {}
  Object.assign(Vue.prototype._myCommon, window._myCommon)
}

Vue.use(install)
