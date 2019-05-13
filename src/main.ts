import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
// import Vuex from "vuex"
import router from "./router/index";

import store from "./store/index";

Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.filter("clipImage", (imgUrl: string, width: number, height: number) => {
  if (!imgUrl || imgUrl.length < 1) return;
  return `${imgUrl}?param=${width}y${height}`;
});
Vue.filter("convert2Https", (imgUrl: string) => {
  if (!imgUrl || imgUrl.length < 1) return;
  return imgUrl.replace(/http:\/\//g, "https://");
});
console.log("instance store");
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
