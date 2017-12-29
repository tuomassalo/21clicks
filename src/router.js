import Vue from 'vue'
import Router from 'vue-router'

import VFaq from './components/faq'
import VHello from './components/hello'
import VReplay from './components/replay'
import VRecord from './components/record'
import VStats from './components/stats'

Vue.use(Router)

export default new Router({
  base: '/',
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: VHello,
    },
    {
      path: '/faq',
      component: VFaq,
    },
    {
      path: '/replay',
      component: VReplay,
    },
    {
      path: '/record/:level',
      component: VRecord,
    },
    {
      path: '/stats',
      component: VStats,
    },
    {
      path: '/share/:recordingId',
      component: VStats,
    },
    {
      path: '/*',
      redirect: '/',
    },
  ],
})
