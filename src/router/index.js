import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'
import Mine from '../views/Mine'
import Account from '../views/Account'
import SonglistDetail from '../views/SonglistDetail'

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
    name:'Home',path: '/home', component: Home, children: [
      { name:'SonglistDetail',path: 'songlistdetail/:id', component: SonglistDetail }
    ]
  },
  { name:'Mine',path: '/mine', component: Mine },
  { name:'Account',path: '/account', component: Account }
]

const router = new VueRouter({
  routes,
  'active-class':'router-link-active'
})

export default router
