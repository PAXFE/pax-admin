import request from '@/utils/request'

export function resetEmail(data) {
  return request({
    url: '/code/resetEmail',
    method: 'post',
    data
  })
}

export function updatePass(pass) {
  return request({
    url: '/users/updatePass/' + pass,
    method: 'get'
  })
}
