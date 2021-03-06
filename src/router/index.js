import Vue from 'vue'
import Router from 'vue-router'
import Pokemon from '@/components/Pokemon'
import Threejs from '@/components/Threejs'
import Jeu from '@/components/Jeu'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Pokemon',
      component: Pokemon
    },
    {
      path: '/three/',
      name: 'Threejs',
      component: Threejs
    },
    {
      path: '/jeu/',
      name: 'Jeu',
      component: Jeu
    }

  ]
})
