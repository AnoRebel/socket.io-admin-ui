<template>
  <div class="p-4 bg-white shadow-lg rounded-lg my-20 mx-6">
    <div class="font-bold text-left p-4">{{ t("details") }}</div>
    <table class="min-w-full">
      <tbody class="divide-y divide-gray-200">
          <tr class="bg-gray-50 hover:bg-gray-200">
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("id") }}</td>
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
              {{ client.id }}
            </td>
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2"></td>
          </tr>
          <tr class="bg-gray-50 hover:bg-gray-200">
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("status") }}</td>
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
              <ConnectionStatus :connected="client.connected" />
            </td>
            <td align="right" class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
              <tooltip
                v-if="isSocketDisconnectSupported && client.connected"
              >
                <template #activator>
                  <button class="btn"
                    :disabled="isReadonly"
                    @click="disconnectClient()"
                  >
                    <LogoutIcon />
                  </button>
                </template>
                <span>{{ t("clients.disconnect") }}</span>
              </tooltip>
            </td>
          </tr>
          <tr class="bg-gray-50 hover:bg-gray-200">
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("sockets.transport") }}</td>
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2"><Transport :transport="socket.transport" /></td>
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2"></td>
          </tr>
          <tr class="bg-gray-50 hover:bg-gray-200">
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("sockets.address") }}</td>
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ socket.handshake.address }}</td>
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2"></td>
          </tr>
        </tbody>
    </table>
  </div>
</template>

<script>
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import { LogoutIcon } from "@heroicons/vue/outline";

import SocketHolder from "@/SocketHolder";
import Tooltip from "@/components/Tooltip.vue";
import Transport from "@/components/Transport.vue";
import ConnectionStatus from "@/components/ConnectionStatus.vue";

export default {
  name: "ClientDetails",
  components: { ConnectionStatus, Transport, Tooltip, LogoutIcon, },
  props: {
    client: Object,
    socket: Object,
  },
  setup(props) {
    const { t } = useI18n();
    const store = useStore();
    const isReadonly = computed(() => store.state.config.readonly);
    const isSocketDisconnectSupported = computed(() => store.state.config.supportedFeatures.includes("DISCONNECT"));

    const disconnectClient = () => {
      const socket = props.client.sockets[0];
      if (socket) {
        SocketHolder.socket.emit("_disconnect", socket.nsp, true, socket.id);
      }
    };

    return { t, isReadonly, isSocketDisconnectSupported, disconnectClient, };
  },
};
</script>

<style scoped>
.key-column {
  width: 30%;
}
</style>
