// require('./bootstrap');

// window.animate = require('animate.css');


import { createApp } from "vue";
import  { createPinia } from "pinia";
import Page from './components/layouts/Main.vue';
import router from './router/index.js';
const pinia = createPinia();
const app = createApp(Page);

app.use(router);
app.use(pinia);
app.mount("#app");
