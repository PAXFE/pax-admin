import request from '@/utils/request'

// 获取所有的Role
export function getAll() {
  return request({
    url: '/roles/all',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

export function get(id) {
  return request({
    url: '/roles/' + id,
    method: 'get'
  })
}

export function getLevel() {
  return request({
    url: '/roles/level',
    method: 'get'
  })
}

export function del(id) {
  return request({
    url: '/roles/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: '/roles',
    method: 'put',
    data
  })
}

export function editPermission(data) {
  return request({
    url: '/roles/permission',
    method: 'put',
    data
  })
}

export function editMenu(data) {
  return request({
    url: '/roles/menu',
    method: 'put',
    data
  })
}

export function downloadRole(params) {
  return request({
    url: '/roles/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
