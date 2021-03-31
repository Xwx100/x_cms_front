import Vue from 'vue'
import {importMaps} from '@/router'


export function filterAsyncRoutes(child) {
  for (let k in child) {
    let v = child[k]
    if (_myCommon.isObject(v)) {
      child[k]['path'] = v.name
      if (v.hasOwnProperty('component')) {
        child[k]['component'] = importMaps[v.component]
      }
      if (v.hasOwnProperty('hidden') && v.hidden === '0') {
        child[k]['hidden'] = false
      }
      if (v.hasOwnProperty('children')) {
        filterAsyncRoutes(v.children)
      }
    }
  }
}
