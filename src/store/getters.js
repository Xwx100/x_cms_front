const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  tokenData: state => state.user.tokenData,
  avatar: state => state.user.avatar,
  name: state => state.user.name,

  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,

  routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  frontItem: state => state.permission.frontItem,
}
export default getters
