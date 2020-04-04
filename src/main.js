import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './lib/axios-init'
import 'lib-flexible';
import 'vant/lib/index.css';
import VueLocalStorage from 'vue-localstorage'

Vue.use(VueLocalStorage, {
  name: 'ls',//别名 使用时可通过  this.$ls 获得 VueLocalStorage 实例
  bind: true //created computed members from your variable declarations
})

import { 
  Col, Row, Popup, Tabbar, TabbarItem, Swipe, SwipeItem, 
  Toast, Slider,Search,Circle,Icon,Divider,Field,Button,
  NavBar,PullRefresh,Sticky,Tag,Collapse,CollapseItem
} from 'vant';

Vue.use(Col).use(Row).use(Popup).use(Tabbar).use(TabbarItem).use(Swipe).use(SwipeItem)
.use(Toast).use(Slider).use(Search).use(Circle).use(Icon).use(Divider).use(Field).use(Button)
.use(NavBar).use(PullRefresh).use(Sticky).use(Tag).use(Collapse).use(CollapseItem)

Vue.prototype.axios = axios;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
