import {constantRoutes} from '@/router'
import {getTokenData, getFrontItem} from "@/utils/localstorage";
import {filterAsyncRoutes} from '@/utils/permission'
import Vue from 'vue'

const state = {
  routes: [],
  addRoutes: [],
  frontItem: getFrontItem()
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
}

const actions = {
  generateRoutes({commit}) {
    return new Promise(resolve => {
      let routes = getTokenData().uris_front
      if (!_myCommon.isEmpty(routes)) {
        filterAsyncRoutes(routes)
      }
      commit('SET_ROUTES', routes)
      resolve(routes)
    })
  },
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}
