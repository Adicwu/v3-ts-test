import { createStore } from 'vuex'

export default createStore({
  state: {
    job: 'adic'
  },
  getters: {
    realJob () {
      return 'xss'
    }
  },
  mutations: {
    addPoint (state, param) {
      console.log('add', state, param)
    },
    removePoint () {
      console.log('remove')
    }
  },
  actions: {
    getList () {
      console.log('start')
      return new Promise(resolve => {
        setTimeout(() => {
          resolve([
            {
              name: '藤和艾莉欧'
            },
            {
              name: '珈百璃'
            }
          ])
        })
      })
    }
  },
  modules: {
  }
})
