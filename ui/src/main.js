import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import messages from "@intlify/vite-plugin-vue-i18n/messages";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "virtual:windi.css";

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
});

const app = createApp(App);
app.use(router);
app.use(store);
app.use(i18n);
router.isReady().then(() => app.mount("#app"));
