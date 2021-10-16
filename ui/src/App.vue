<template>
  <div class="flex h-screen bg-[#fafafa] dark:bg-[#121212] overflow-hidden">
    <Sidebar />
    <div class="flex flex-col flex-1 w-0 overflow-hidden">
      <AppBar @update="showConnectionModal = true" />
      <main class="flex-1 relative overflow-y-auto focus:outline-none">
        <div class="py-6">
          <router-view v-slot="{ Component, route }">
            <transition :name="transitionName">
              <component :is="Component" :key="route.path" />
            </transition>
          </router-view>
        </div>
      </main>
      <ConnectionModal
        :is-open="showConnectionModal"
        :initial-server-url="serverUrl"
        :initial-ws-only="wsOnly"
        :initial-path="path"
        :is-connecting="isConnecting"
        :error="connectionError"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import { io } from "socket.io-client";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SocketHolder from "@/SocketHolder";
import AppBar from "@/components/AppBar.vue";
import Sidebar from "@/components/Sidebar.vue";
import ConnectionModal from "@/components/ConnectionModal.vue";

export default {
  name: "App",
  components: {
    AppBar,
    Sidebar,
    ConnectionModal,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const showConnectionModal = ref(false);
    const isConnecting = ref(false);
    const connectionError = ref("");
    const transitionName = ref("moveRight");

    const serverUrl = computed(() => store.state.connection.serverUrl);
    const wsOnly = computed(() => store.state.connection.wsOnly);
    const path = computed(() => store.state.connection.path);
    // const backgroundColor = computed(() => store.state.config.darkTheme ? "" : "grey lighten-5");
    
    // No need, cal in setup()
  onMounted(() => {
    // this.$vuetify.theme.dark = store.state.config.darkTheme;

    if (serverUrl.value) {
      const sessionId = store.state.connection.sessionId;
      tryConnect(
        serverUrl.value,
        {
          sessionId,
        },
        wsOnly.value,
        path.value
      );
    } else {
      showConnectionModal.value = true;
    }
  });

  watch(() => route, (to, from) => {
    if (to.meta.topLevel && from.meta.topLevel) {
        transitionName.value =
          to.meta.index > from.meta.index
            ? "moveUp"
            : "moveDown";
      } else {
        transitionName.value = to.meta.topLevel
          ? "moveLeft"
          : "moveRight";
      }
  }, { deep: true, },);

    const tryConnect = (serverUrl, auth, wsOnly, path) => {
      isConnecting.value = true;
      if (SocketHolder.socket) {
        SocketHolder.socket.disconnect();
        SocketHolder.socket.off("connect");
        SocketHolder.socket.off("connect_error");
        SocketHolder.socket.off("disconnect");
      }
      const socket = io(serverUrl, {
        forceNew: true,
        reconnection: false,
        withCredentials: true, // needed for cookie-based sticky-sessions
        transports: wsOnly ? ["websocket"] : ["polling", "websocket"],
        path,
        auth,
      });
      socket.once("connect", () => {
        showConnectionModal.value = false;
        connectionError.value = "";
        isConnecting.value = false;

        socket.io.reconnection(true);
        store.commit("connection/saveConfig", {
          serverUrl,
          wsOnly,
          path,
        });
        SocketHolder.socket = socket;
        registerEventListeners(socket);
      });
      socket.on("connect", () => {
        store.commit("connection/connect");
      });
      socket.on("connect_error", (err) => {
        if (isConnecting.value || err.message === "invalid credentials") {
          showConnectionModal.value = true;
          connectionError.value = err.message;
          isConnecting.value = false;
        }
      });
      socket.on("disconnect", () => {
        store.commit("connection/disconnect");
      });
    };

    const registerEventListeners = (socket) => {
      socket.on("session", (sessionId) => {
        store.commit("connection/saveSessionId", sessionId);
      });
      socket.on("config", (config) => {
        store.commit("config/updateConfig", config);
      });
      socket.on("server_stats", (serverStats) => {
        store.commit("servers/onServerStats", serverStats);
      });
      socket.on("all_sockets", (sockets) => {
        store.commit("main/onAllSockets", sockets);
      });
      socket.on("socket_connected", (socket) => {
        store.commit("main/onSocketConnected", socket);
      });
      socket.on("socket_updated", (socket) => {
        store.commit("main/onSocketUpdated", socket);
      });
      socket.on("socket_disconnected", (nsp, id, reason) => {
        store.commit("main/onSocketDisconnected", {
          nsp,
          id,
          reason,
        });
      });
      socket.on("room_joined", (nsp, room, id) => {
        store.commit("main/onRoomJoined", { nsp, room, id });
      });
      socket.on("room_left", (nsp, room, id) => {
        store.commit("main/onRoomLeft", { nsp, room, id });
      });
    };

    const onSubmit = (form) => {
      tryConnect(
        form.serverUrl,
        {
          username: form.username,
          password: form.password,
        },
        form.wsOnly,
        form.path
      );
    };

    return {
      serverUrl,
      wsOnly,
      path,
      onSubmit,
      // backgroundColor,
      showConnectionModal,
      isConnecting,
      connectionError,
      transitionName,
    };
  },
}
</script>

<style scoped>
@keyframes fadeIn {
  0% { opacity: 0; }
  50% { opacity: .5; }
  100% { opacity: 1; }
}

@keyframes fadeOut {
  0% { opacity: 1; }
  50% { opacity: .5; }
  100% { opacity: 0; }
}

@keyframes moveUp {
  0% { transform: translateY(0); }
  100% { transform: translateY(-20%); }
}
.moveUp-enter-active {
  animation: fadeIn .5s ease-in;
}
.moveUp-leave-active {
  animation: moveUp .3s ease-in;
}

@keyframes moveDown {
  0% { transform: translateY(0); }
  100% { transform: translateY(20%); }
}
.moveDown-enter-active {
  animation: fadeOut .5s ease-out;
}
.moveDown-leave-active {
  animation: moveDown .3s ease-out;
}

@keyframes moveLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-20%); }
}
.moveLeft-enter-active {
  animation: fadeIn .5s ease-in;
}
.moveLeft-leave-active {
  animation: moveLeft .3s ease-in;
}

@keyframes moveRight {
  0% { transform: translateX(0); }
  100% { transform: translateX(20%); }
}
.moveRight-enter-active {
  animation: fadeOut .5s ease-out;
}
.moveRight-leave-active {
  animation: moveRight .3s ease-out;
}
</style>