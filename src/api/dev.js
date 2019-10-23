import request from '@/utils/request'

// 发送消息
export function push(data) {
  return request({
    url: '/push',
    method: 'post',
    data: data
  })
}
