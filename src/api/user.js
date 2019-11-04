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

// getUserPermission
export function getUserPermission(token) {
  return request({
    url: `/user/getUserPermission`,
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 列表查询用户
export function fetchUser(query) {
  return request({
    url: '/user',
    method: 'get',
    params: query
  })
}

// 创建用户
export function addUser(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: `/user`,
    method: 'put',
    data: data
  })
}

// 删除用户
export function deleteUser(userId) {
  return request({
    url: `/user/${userId}`,
    method: 'delete'
  })
}

// 重置用户accessKey
export function resetAccessKey() {
  return request({
    url: '/user/resetAccessKey',
    method: 'get'
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
