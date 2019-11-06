import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/dict',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/dict/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: '/dict',
    method: 'put',
    data
  })
}

export function downloadDict(params) {
  return request({
    url: '/dict/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
