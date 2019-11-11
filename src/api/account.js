import request from '@/utils/request'

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
