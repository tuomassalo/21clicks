import Vue from 'vue'
import App from './app.vue'
import router from './router'

// This mixin lets a component listen to events from the parent component, but
// only react to them if that component is active - that is, it's the current
// route.
Vue.mixin({
  beforeRouteEnter(to, from, next) {
    next(vm => (vm.isActiveRoute = true))
  },
  beforeRouteLeave(to, from, next) {
    this.isActiveRoute = false
    next()
  },
  methods: {
    onWhenActive(eventName, callback) {
      this.$parent.$on(eventName, () => {
        if (this.isActiveRoute) {
          callback()
        }
      })
    },
  },
})

new Vue({
  el: '#app',
  router,
  ...App,
})
