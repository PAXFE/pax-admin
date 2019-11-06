import { constantRoutes } from '@/router'
import Layout from '@/layout'

// /**
//  * Use meta.role to determine if the current user has permission
//  * @param roles
//  * @param route
//  */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const accessedRoutes = routes.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRoutes(router.children)
    }
    return true
  })
  return accessedRoutes
  // const res = []
  //
  // routes.forEach(route => {
  //   const tmp = { ...route }
  //   if (hasPermission(roles, tmp)) {
  //     if (tmp.children) {
  //       tmp.children = filterAsyncRoutes(tmp.children, roles)
  //     }
  //     res.push(tmp)
  //   }
  // })
  //
  // return res
}

export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}`)
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, routes, roles) {
    return new Promise(resolve => {
      // let accessedRoutes
      // buildMenus().then(response => {
      //   const { result } = response
      //   const accessedRoutes = filterAsyncRoutes(result)
      //   commit('SET_ROUTES', accessedRoutes)
      //   resolve(accessedRoutes)
      // })
      // if (roles.includes('admin')) {
      //   accessedRoutes = asyncRoutes || []
      // } else {
      //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      // }
      const asyncRoutes = filterAsyncRoutes(routes, roles)
      asyncRoutes.push({ path: '*', redirect: '/404', hidden: true })
      commit('SET_ROUTES', asyncRoutes)
      resolve(asyncRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
