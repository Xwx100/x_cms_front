import request from '@/utils/request'

export function index(data) {
  return request({
    url: '/admin/user/index',
    method: 'post',
    data
  })
}

export function create(data) {
  return request({
    url: '/admin/user/create',
    method: 'post',
    data
  })
}


export function update(data) {
  return request({
    url: '/admin/user/update',
    method: 'post',
    data
  })
}


export function del(data) {
  return request({
    url: '/admin/user/del',
    method: 'post',
    data
  })
}


export function get(data) {
  return request({
    url: '/admin/user/get',
    method: 'post',
    data
  })
}

export function logout(data) {
  return request({
    url: '/admin/user/logout',
    method: 'get',
    data
  })
}

