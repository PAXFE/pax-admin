import Vue from 'vue'
import { login, logout, getUserInfo, getUserPermission } from '@/api/user'
import { getToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  userId: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_USERID: (state, userId) => {
    state.userId = userId
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  Login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { result } = response
        commit('SET_TOKEN', result.token)
        Vue.ls.set('TOKEN', result.token, 7 * 24 * 60 * 60 * 1000)
        // setToken(result.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  GetUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo(state.token).then(response => {
        const { result } = response

        if (!result) {
          reject('Verification failed, please Login again.')
        }

        const { roleId, name, userId } = result
        // roles must be a non-empty array
        if (roleId === null) {
          reject('getUserInfo: roles must be a non-null array!')
        }
        const roles = [roleId]

        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_USERID', userId)
        // commit('SET_AVATAR', avatar)
        // commit('SET_INTRODUCTION', introduction)
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 获取用户权限
  GetUserPermission({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserPermission(state.token).then(response => {
        const { result } = response

        if (!result) {
          reject('Verification failed, please Login again.')
        }

        const { menu, auth } = result
        // roles must be a non-empty array
        if (menu === null) {
          reject('GetUserPermission: menu must be a non-null array!')
        }

        if (auth === null) {
          reject('GetUserPermission: auth must be a non-null array!')
        }

        commit('SET_ROLES', auth)
        commit('SET_NAME', name)
        // commit('SET_USERID', userId)
        // commit('SET_AVATAR', avatar)
        // commit('SET_INTRODUCTION', introduction)
        resolve(result)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      // setToken(token)
      Vue.ls.set('TOKEN', token, 7 * 24 * 60 * 60 * 1000)

      const { roles } = await dispatch('getUserInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

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
