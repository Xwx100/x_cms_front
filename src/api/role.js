import request from '@/utils/request'

export function index(data) {
  return request({
    url: '/admin/role/index',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/admin/role/create',
    method: 'post',
    data
  })
}


export function update(data) {
  return request({
    url: '/admin/role/update',
    method: 'post',
    data
  })
}


export function del(data) {
  return request({
    url: '/admin/role/del',
    method: 'post',
    data
  })
}
