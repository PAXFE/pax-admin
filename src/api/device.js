import request from '@/utils/request'

// 列表查询设备
export function fetchDevice(query) {
  return request({
    url: '/mqttClient',
    method: 'get',
    params: query
  })
}
