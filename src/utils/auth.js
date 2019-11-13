// import Vue from 'vue'
import Cookies from 'js-cookie'
import defaultSettings from '@/settings'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, { expires: defaultSettings.tokenCookieExpires })
  } else return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

// export function getToken() {
//   return Vue.ls.get(TokenKey)
// }
//
// export function setToken(token, time) {
//   return Vue.ls.set(TokenKey, token, time || 7 * 24 * 60 * 60 * 1000)
// }
//
// export function removeToken() {
//   return Vue.ls.remove(TokenKey)
// }
