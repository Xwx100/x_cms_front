import request from '@/utils/request'

export function index(data) {
  return request({
    url: '/admin/uri/index',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/admin/uri/create',
    method: 'post',
    data
  })
}


export function update(data) {
  return request({
    url: '/admin/uri/update',
    method: 'post',
    data
  })
}


export function del(data) {
  return request({
    url: '/admin/uri/del',
    method: 'post',
    data
  })
}
