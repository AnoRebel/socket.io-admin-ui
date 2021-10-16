import { createStore, createLogger } from "vuex";

import main from "@/store/modules/main";
import config from "@/store/modules/config";
import servers from "@/store/modules/servers";
import connection from "@/store/modules/connection";

const debug = process.env.NODE_ENV ? process.env.NODE_ENV !== "production" : import.meta.env.MODE !== "production";

export default createStore({
  modules: {
    config,
    connection,
    main,
    servers,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});
