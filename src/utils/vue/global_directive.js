// vue 全局指令
import Vue from 'vue'
import store from '@/store'

// 权限控制-不根据角色根据uri
Vue.directive('permission', {
  inserted: (el, binding, vnode, oldVnode) => {
    const {value} = binding
    if (_myCommon.isEmpty(value)) {
      return
    }
    const {uris_3} = store.getters.tokenData
    let result = Object.values(_myCommon.php.array_intersect(value, uris_3)).length !== value.length
    if (process.env.NODE_ENV !== 'development' && result) {
      el.parentNode.removeChild(el)
    }
  },
})
