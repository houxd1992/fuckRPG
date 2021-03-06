/**
 *  描述：用户模块
 */
import request from '../utils/request';

/**
 * 用户登录
 * @params
 *  用户名 userName*: string
 *  密码 password*: string, MD5
 */
export function login(params) {
  return request('/api/user/login', {
    body: params
  })
}

/**
 * 获取邀请
 * @params
 *  被邀请人备注 remark: string
 */
export function invitation(params) {
  return request('/api/user/link', {
    body: params
  });
}

/**
 * 查询登录状态
 * 
 */
export function checkToken() {
  return request('/api/user/checkToken')
}

/**
 * 退出登录
 * 
 */
export function logout() {
  return request('/api/user/logout')
}

export function fetchList() {
  return request('/api/users');
}