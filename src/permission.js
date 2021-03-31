/*
1. route 根据后端uri权限 进行渲染
2. 假如 要加缓存 前端需要根据后端返回的 进行删除 可api可cookie
3. 前端 根据参数传入该按钮涉及uris 判断 是否 全部出现在 后端uri权限，若是 则v-if渲染
 */

import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist
let asyncRouter = false

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()


  _myCommon.log('token....', hasToken)

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({path: '/'})
    } else {
      try {
        if (!asyncRouter) {
          _myCommon.log(to.path)
          const addRoutes = await store.dispatch('permission/generateRoutes')
          router.options.routes.push(...addRoutes)
          router.addRoutes(addRoutes)
          asyncRouter = !asyncRouter;
          next({...to, replace: true})
        } else {
          next()
        }
      } catch (error) {
        // remove token and go to login page to re-login
        _myCommon.log(error)
        await store.dispatch('user/resetToken')
        next(`/login?redirect=${to.path}`)
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
