import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueGoodTablePlugin from 'vue-good-table';
import 'vue-good-table/dist/vue-good-table.css';
import axios from "axios";
import VModal from 'vue-js-modal';


axios.defaults.baseURL =
  process.env.NODE_ENV === "development" ? "http://localhost:3000" : "/";

Vue.use(VueGoodTablePlugin);
Vue.use(VModal, { dynamic: true, injectModalsContainer: true })

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
