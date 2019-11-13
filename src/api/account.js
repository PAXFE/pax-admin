import request from '@/utils/request'

// 首页账户总览
export function getGroup(params) {
  return request({
    url: '/account/group',
    method: 'get',
    params
  })
}

// 首页账户变动
export function getChange(params) {
  return request({
    url: '/account/change',
    method: 'get',
    params
  })
}

// 首页账户异常
export function getAbnormal(params) {
  return request({
    url: '/account/abnormal',
    method: 'get',
    params
  })
}

// 账户查询列表
export function getList(params) {
  return request({
    url: '/account/list',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: '/account',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/account/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: '/account',
    method: 'put',
    data
  })
}

export function downloadAccount(params) {
  return request({
    url: '/account/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
