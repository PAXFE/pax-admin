import request from '@/utils/request'
// import qs from 'qs'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}

export function getUserInfo() {
  return request({
    url: `/user/getUserInfo`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 修改密码
export function updatePassword(data) {
  return request({
    url: `/user`,
    method: 'patch',
    data: data
  })
}

export function add(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  })
}

export function downloadUser(params) {
  return request({
    url: '/users/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

export function del(id) {
  return request({
    url: '/users/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: '/users',
    method: 'put',
    data
  })
}

export function updatePass(user) {
  const data = {
    oldPass: user.oldPass,
    newPass: user.newPass
  }
  return request({
    url: '/users/updatePass/',
    method: 'post',
    data
  })
}

export function updateEmail(code, data) {
  return request({
    url: '/users/updateEmail/' + code,
    method: 'post',
    data
  })
}
