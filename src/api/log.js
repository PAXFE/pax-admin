import request from '@/utils/request'

export function getErrDetail(id) {
  return request({
    url: '/logs/error/' + id,
    method: 'get'
  })
}

export function downloadLog(params) {
  return request({
    url: '/logs/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
