<template>
  <div class="p-4 bg-white shadow-lg rounded-lg my-20 mx-6">
    <div class="font-bold text-left p-4">{{ t("sockets.title") }}</div>
      <Datatable :headers="headers" :items="sockets" :dense="true">
        <template #nsp="{ item }">
        <code>{{ item.nsp }}</code>
      </template>

      <template #actions="{ item }">
        <tooltip v-if="isSocketDisconnectSupported">
          <template #activator>
            <button class="btn ml-3"
              :disabled="isReadonly"
              @click="disconnect(item)"
            >
              <LogoutIcon />
            </button>
          </template>
          <span>{{ t("sockets.disconnect") }}</span>
        </tooltip>

        <tooltip>
          <template #activator>
            <button class="btn ml-3"
              @click="displayDetails(item)"
            >
              <DotsHorizontalIcon />
            </button>
          </template>
          <span>{{ t("sockets.displayDetails") }}</span>
        </tooltip>
      </template>
      </Datatable>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { LogoutIcon } from "@heroicons/vue/outline";
import { DotsHorizontalIcon } from "@heroicons/vue/solid";

import SocketHolder from "@/SocketHolder";
import Tooltip from "@/components/Tooltip.vue";
import Datatable from "@/components/Datatable.vue";

export default {
  name: "ClientSockets",
  components: {
    Tooltip,
    Datatable,
    LogoutIcon,
    DotsHorizontalIcon,
  },
  props: {
    sockets: Array,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const router = useRouter();

    const headers = computed(() => [
        {
          text: "#",
          value: "id",
          align: "start",
        },
        {
          text: t("namespace"),
          value: "nsp",
        },
        {
          value: "actions",
          align: "end",
          sortable: false,
        },
      ]);

      const isReadonly = computed(() => store.state.config.readonly);
      const isSocketDisconnectSupported = computed(() => store.state.config.supportedFeatures.includes("DISCONNECT"));

      const disconnect = (socket) => {
      SocketHolder.socket.emit("_disconnect", socket.nsp, false, socket.id);
    };
    const displayDetails = (socket) => {
      router.push({
        name: "socket",
        params: { nsp: socket.nsp, id: socket.id },
      });
    };

    return { t, headers, isReadonly, isSocketDisconnectSupported, disconnect, displayDetails, }
  },
};
</script>
