import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from 'components/goods/goods';
import ratings from 'components/ratings/ratings';
import seller from 'components/seller/seller';
Vue.use(VueRouter);
Vue.use(VueResource);
const router = new VueRouter({
  routes: [{
    path: '/goods',
    component: goods
  }, {
    path: '/ratings',
    component: ratings
  }, {
    path: '/seller',
    component: seller
  }],
  linkActiveClass: 'active'
});
new Vue({
  router,
  template: '<App>',
  components: {
    App
  },
  data: {
    eventHub: new Vue()
  }
}).$mount('#app');

router.push('goods');
