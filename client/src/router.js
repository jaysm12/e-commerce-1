import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Register from './views/Register.vue'
import Login from './views/Login.vue'
import Cart from './views/Cart.vue'
import Admin from './views/Admin.vue'
import Checkout from './views/Checkout.vue'
import Transaction from "./views/Transaction.vue";
import Delivered from './views/Transactions/Delivered.vue'
import Shipping from './views/Transactions/Shipping.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/cart',
      name: 'cart',
      component: Cart
    },
    {
      path : '/admin',
      name: 'admin',
      component: Admin 
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: Checkout
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: Transaction,
      children: [{
        path: 'shipping',
        name: 'shipping',
        component: Shipping
      },{
        path: 'delivered',
        name: 'delivered',
        component: Delivered
      }]
    }
  ]
})
