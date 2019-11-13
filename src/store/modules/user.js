import { login, logout, getUserInfo } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: {},
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
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
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
    // const { username, password, code, uuid } = userInfo
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        const { token } = response
        commit('SET_TOKEN', token)
        // Vue.ls.set('TOKEN', token, 7 * 24 * 60 * 60 * 1000)
        setToken(token)
        // setUserInfo(result.userInfo, commit)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  GetUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(response => {
        // const { result } = response

        setUserInfo(response, commit)

        // if (!result) {
        //   reject('Verification failed, please Login again.')
        // }
        //
        // const { roleId, name, userId } = result
        // // roles must be a non-empty array
        // if (roleId === null) {
        //   reject('getUserInfo: roles must be a non-null array!')
        // }
        // const roles = [roleId]
        //
        // commit('SET_ROLES', roles)
        // commit('SET_NAME', name)
        // commit('SET_USERID', userId)
        // commit('SET_AVATAR', avatar)
        // commit('SET_INTRODUCTION', introduction)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  Logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_USERINFO', {})
        commit('SET_ROLES', [])
        // Vue.ls.remove('TOKEN')
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        console.log(state.roles)
        resolve()
      }).catch(error => {
        commit('SET_TOKEN', '')
        commit('SET_USERINFO', {})
        commit('SET_ROLES', [])
        // Vue.ls.remove('TOKEN')
        removeToken()
        resetRouter()
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      commit('SET_USERINFO', {})
      // Vue.ls.remove('TOKEN')
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)
      // Vue.ls.set('TOKEN', token, 7 * 24 * 60 * 60 * 1000)

      const { roles } = await dispatch('GetUserInfo')

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

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  if (res.roles.length === 0) {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', res.roles)
  }
  commit('SET_USERINFO', res)
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
