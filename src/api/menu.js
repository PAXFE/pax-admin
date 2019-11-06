import request from '@/utils/request'

// 获取所有的菜单树
export function getMenusTree() {
  return request({
    url: '/menus/tree',
    method: 'get'
  })
}

export function buildMenus() {
  return request({
    url: '/menus/build',
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: '/menus',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: '/menus/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: '/menus',
    method: 'put',
    data
  })
}

export function downloadMenu(params) {
  return request({
    url: '/menus/download',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
