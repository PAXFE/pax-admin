import request from '@/utils/request'

// 统计所有
export function getTotal() {
  return request({
    url: '/analyse/getTotal',
    method: 'get'
  })
}

// 实时数据
export function getDaily() {
  return request({
    url: '/analyse/getDaily',
    method: 'get'
  })
}

// 月度数据分析
export function getMonth() {
  return request({
    url: '/analyse/getMonth',
    method: 'get'
  })
}
