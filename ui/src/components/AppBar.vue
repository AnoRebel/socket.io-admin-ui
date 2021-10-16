<template>
  <div
    class="
      flex
      bg-[#F5F5F5]
      dark:bg-[#272727]
      h-16
      flex-shrink-0
      relative
      z-10
      shadow
    "
  >
    <button
      class="
        border-r border-gray-400
        px-4
        focus:(ring-gray-500
        outline-none
        ring-inset ring-2)
        md:hidden
      "
      @click="openSidebar"
    >
      <span class="sr-only">Open sidebar</span>
      <img
        class="h-8 w-auto"
        :src="logoSrc"
        alt="logo"
        width="40"
        height="40"
        aria-hidden="true"
      />
    </button>
    <div class="flex flex-1 px-4 justify-between">
      <div class="flex flex-1 items-center">
        <a
          :href="linkToReleaseNotes"
          class="
            rounded
            px-2.5
            dark:text-white
            bg-[#F5F5F5]
            dark:bg-[#272727]
            py-1
            text-sm
            hover:(shadow-md
            bg-[#E5E5E5])
            dark:hover:(shadow-md
            bg-[#3D3D3D])
          "
        >
          {{ version }}
        </a>
      </div>
      <div class="flex ml-4 items-center md:ml-6">
        <div
          class="
            flex flex-row
            mx-4
            dark:text-white
            sm:flex-col
            items-center
            justify-center
          "
        >
          <div class="flex flex-row">
            {{ t("connection.serverUrl") }}:
            <code
              v-if="serverURL"
              class="
                mx-1
                text-sm
                pt-1
                px-1
                rounded-sm
                dark:bg-gray-500
                bg-gray-300
                dark:text-gray-100
              "
            >
              {{ serverURL }}
            </code>
          </div>
          <div class="flex flex-row pt-1">
            {{ t("status") }}:
            <ConnectionStatus :connected="connected" />
          </div>
        </div>
        <button
          class="
            rounded-sm
            shadow
            uppercase
            font-medium
            dark:text-white
            bg-[#F5F5F5]
            dark:bg-[#272727]
            py-1.5
            px-3
            hover:(text-gray-800
            bg-[#E5E5E5])
            dark:hover:(text-gray-200
            bg-[#3D3D3D])
            focus:outline-none
          "
          @click="$emit('update')"
        >
          <span class="sr-only">{{ t("update") }}</span>
          {{ t("update") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { MenuAlt2Icon } from "@heroicons/vue/outline";

import { emitter } from "@/util";
import logoWhite from "@/assets/logo-light.svg";
import logoDark from "@/assets/logo-dark.svg";
import ConnectionStatus from "@/components/ConnectionStatus.vue";
const version = import.meta.env.VITE_APP_VERSION;

export default {
  name: "AppBar",
  components: {
    MenuAlt2Icon,
    ConnectionStatus,
  },
  emits: ["update"],
  setup() {
    const store = useStore();
    const { t } = useI18n();
    const logoSrc = computed(() =>
      store.state.config.darkTheme ? logoDark : logoWhite
    );

    const serverURL = computed(() => store.state.connection.serverURL);
    const connected = computed(() => store.state.connection.connected);
    const linkToReleaseNotes = computed(
      () =>
        `https://github.com/socketio/socket.io-admin-ui/releases/tag/${version}`
    );

    const openSidebar = () => {
      emitter.emit("toggle-sidebar", true);
    };

    return {
      t,
      openSidebar,
      serverURL,
      connected,
      linkToReleaseNotes,
      logoSrc,
    };
  },
};
</script>
