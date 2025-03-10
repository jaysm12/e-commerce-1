import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router'
const url = 'http://35.198.252.94/api/'
// 35.198.252.94
const ax = axios.create({
  baseURL: url
})
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    isLoading: false,
    isLogin: !!localStorage.getItem('token'),
    loggedUser: {},
    products: [],
    cart: {},
    dialogCheckout: false,
    shipping: [],
    delivered: [],
    ordered: [],
    allTransactions: []
  },
  mutations: {
    INSERTPRODUCTS (state, payload) {
      state.products = payload
    },
    INSERTLOGGEDUSER (state, payload) {
      state.products = payload
    },
    LOGIN (state, { token, payload }) {
      state.isLogin = true
      state.loggedUser = payload

      localStorage.setItem('user', JSON.stringify(payload))
    },
    LOGOUT (state, payload) {
      localStorage.clear()
      state.isLogin = false
      state.loggedUser = {}
      state.cart = {}
      router.push('/')
      console.log('All Cleared !')
    },
    CREATED (state, payload) {
      if (state.isLogin) {
        state.loggedUser = JSON.parse(localStorage.getItem('user'))
      }
    },
    INSERTCART (state, payload) {
      state.cart = payload
    },
    OPENCHECKOUT (state, payload) {
      state.dialogCheckout = true
    },
    CLOSECHECKOUT (state, payload) {
      state.dialogCheckout = false
    },
    INSERTSHIPPING (state, payload) {
      state.shipping = payload
    },
    INSERTDELIVERED (state, payload) {
      state.delivered = payload
    },
    INSERTALLTRANSACTIONS (state, payload) {
      state.allTransactions = payload
    }
  },
  actions: {
    fetchProducts ({ state, commit }, payload) {
      state.isLoading = true
      ax.get('/products')
        .then(({ data }) => {
          commit('INSERTPRODUCTS', data)
          router.push('/')
          state.isLoading = false
        })
        .catch(err => { console.log(err) })
    },
    login ({ state, commit }, payload) {
      return ax({
        url: '/users/login',
        data: payload,
        method: 'POST'
      })
    },
    registerLogin ({ state, commit }, { type, data }) {
      state.isLoading = true
      return ax({
        url: `/users/${type}`,
        method: 'POST',
        data
      })
    },
    addToCart ({ state, commit }, { data }) {
      return ax({
        url: '/carts',
        method: 'POST',
        data,
        headers: {
          token: localStorage.getItem('token')
        }
      })
    },
    fetchCart ({ state, commit }, payload) {
      if (payload) {
        localStorage.setItem('token', payload)
      }
      if (state.isLogin) {
        ax.get('/carts', { headers: { token: localStorage.getItem('token') } })
          .then(({ data }) => {
            if (data) {
              commit('INSERTCART', data)
            } else {
              state.cart = {}
            }
            if (router.currentRoute.name === 'checkout') {
              router.push('/')
            }
          })
          .catch(err => { console.log(err.response) })
      } else {
        console.log('halo')
      }
    },
    deleteItemInCart ({ state, commit }, payload) {
      return ax({
        method: 'PATCH',
        url: `/carts/deleteProduct/${state.cart._id}`,
        data: {
          product: payload
        },
        headers: {
          token: localStorage.getItem('token')
        }
      })
    },
    checkout ({ state, commit }, { address, courier }) {
      return ax({
        url: '/transactions',
        method: 'POST',
        headers: {
          token: localStorage.getItem('token')
        },
        data: {
          cart: state.cart._id,
          address,
          courier
        }
      })
    },
    fetchTransactions ({ state, commit }, payload) {
      ax.get('/transactions', { headers: { token: localStorage.getItem('token') } })
        .then(({ data }) => {
          let shipping = []
          let delivered = []
          data.forEach(transaction => {
  
            if(transaction.statusTransaction == 'delivered') delivered.push(transaction)
            else shipping.push(transaction)
          });
          
          commit('INSERTSHIPPING', shipping)
          commit('INSERTDELIVERED', delivered)
        })
        .catch(err => { console.log(err.response.data) })
    },
    deliver ({ state, commit, dispatch }, payload) {
      return ax({
        url: `/transactions/delivered/${payload}`,
        method: 'PATCH',
        headers: {
          token: localStorage.getItem('token')
        }
      })
    },
    create ({ state, commit, dispatch }, { data }) {
      let formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('stock', data.stock)
      formData.append('price', data.price)
      formData.append('image', data.image)
      return ax({
        method: 'POST',
        url: '/products',
        data: formData,
        headers: {
          token: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      })
    },
    fetchAllTransactions ({ state, commit }, payload) {
      ax.get('/transactions/admin', { headers: { token: localStorage.getItem('token') } })
        .then(({ data }) => {
          commit('INSERTALLTRANSACTIONS', data)
        })
        .catch(err => {
          console.log(err.response.data.errors)
        })
    },
    deleteProduct ({ state, commit }, payload) {
      return ax({
        method: 'DELETE',
        url: '/products/delete/' + payload,
        headers: {
          token: localStorage.getItem('token')
        }
      })
    },
    updateProduct ({ state, commit }, { data }) {
      let formData = new FormData()
      formData.append('name', data.name)
      formData.append('description', data.description)
      formData.append('stock', data.stock)
      formData.append('price', data.price)
      formData.append('image', data.image)
      return ax({
        url: '/products/' + data._id,
        method: 'PUT',
        headers: {
          token: localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        },
        data: formData
      })
    },
    acceptTransaction ({ state, commit }, payload) {
      return ax({
        method: 'PATCH',
        url: '/transactions/accept/' + payload,
        headers : {
          token : localStorage.getItem('token')
        }
      })
    }
  }
})
