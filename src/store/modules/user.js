import { getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { getTokenData, setTokenData, removeTokenData } from '@/utils/localstorage'
import { resetRouter } from '@/router'
import { get, logout } from '@/api/c_user'
import Cookies from 'js-cookie'

const tokenData = getTokenData()

const getDefaultState = () => {
  return {
    token: getToken(),
    name: tokenData && tokenData.user.name,
    avatar: '',
    tokenData: tokenData
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      get({ name: username.trim(), pwd: password }).then(response => {
        const {data} = response
        const {user} = data

        let token = Cookies.get('token')
        if (!token) {
          token = data.token
        }
        setToken(token)
        setTokenData(data)

        commit('SET_TOKEN', token)
        commit('SET_NAME', user.name)
        commit('SET_AVATAR', user.avatar)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({token: state.token}).then(() => {
        removeToken()
        removeTokenData()
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit}) {
    return new Promise(resolve => {
      removeToken()
      removeTokenData()
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

