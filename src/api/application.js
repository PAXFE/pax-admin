import request from '@/utils/request'

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

// 分页查询应用列表
export function fetchApp(query) {
  return request({
    url: '/app',
    method: 'get',
    params: query
  })
}

// 查看应用详情
export function fetchAppDetail(appId) {
  return request({
    url: `/app/${appId}`,
    method: 'get'
  })
}

// 添加应用
export function addApp(data) {
  return request({
    url: '/app',
    method: 'post',
    data: data
  })
}

// 添加应用
export function updateApp(data) {
  return request({
    url: '/app',
    method: 'put',
    data: data
  })
}

// 删除应用
export function deleteApp(appId) {
  return request({
    url: `/app/${appId}`,
    method: 'delete'
  })
}
