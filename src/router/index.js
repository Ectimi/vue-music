import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Mine from '../views/Mine'
import Account from '../views/Account'
import SonglistDetail from '../views/SonglistDetail'
import Recommend from '../views/Recommend'
import Category from '../views/Category'
import DetailByTag from '../views/DetailByTag'
import Ranking from '../views/Ranking'

Vue.use(VueRouter)

/**
 * 报错：
 *  Navigating to current location ("/home") is not allowed"
 * 
 * 解决方法：
 * 解决两次访问相同路由地址报错
 */
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  { path: '/', redirect: '/home' },
  {
    name: 'Home', path: '/home', component: Home, children: [
      { name: 'recommend', path: '/home/recommend', component: Recommend },
      { name: 'category', path: '/home/category', component: Category },
      { name: 'ranking', path: '/home/ranking', component: Ranking },
      { name: 'DetailByTag', path: 'detailbytag/:tag', component: DetailByTag },
    ]
  },
  { name: 'Mine', path: '/mine', component: Mine },
  { name: 'Account', path: '/account', component: Account },
  { name: 'SonglistDetail', path: 'songlistdetail/:id', component: SonglistDetail },

]

const router = new VueRouter({
  routes,
  'active-class': 'router-link-active'
})

export default router
