import Vue from 'vue'
import VueRouter from 'vue-router'
import SellerPage from 'views/SellerPage'
import TrendPage from 'views/TrendPage'
import MapPage from 'views/MapPage'
import RankPage from 'views/RankPage'
import HotPage from 'views/HotPage'
import StockPage from 'views/StockPage'
import Home from 'views/Home'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/sellerPage',
    component: SellerPage
  },
  {
    path: '/trendPage',
    component: TrendPage
  },
  {
    path: '/mapPage',
    component: MapPage
  },
  {
    path: '/rankPage',
    component: RankPage
  },
  {
    path: '/hotPage',
    component: HotPage
  },
  {
    path: '/stockPage',
    component: StockPage
  },
]

const router = new VueRouter({
  routes
})

export default router
