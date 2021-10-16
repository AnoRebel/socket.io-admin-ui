<template>
  <div class="p-4 bg-white shadow-lg rounded-lg my-20 mx-6">
    <div class="font-bold text-left p-4">{{ t("details") }}</div>
    <div class="p-4">
      <h4>{{ t("sockets.client") }}</h4>
    </div>
    <table class="min-w-full">
      <tbody class="divide-y divide-gray-200">
        <tr class="bg-gray-50 hover:bg-gray-200">
          <td class="key-column px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("id") }}</td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
            {{ client.id }}
          </td>
          <td align="right" class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
            <tooltip v-if="client.connected">
              <template #activator>
                <button
                  class=" btn ml-3"
                  @click="navigateToClient()"
                >
                  <DotsHorizontalIcon />
                </button>
              </template>
              <span>{{ t("clients.displayDetails") }}</span>
            </tooltip>
          </td>
        </tr>
        <tr class="bg-gray-50 hover:bg-gray-200">
          <td class="key-column px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("status") }}</td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
            <ConnectionStatus :connected="client.connected" />
          </td>
          <td align="right" class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
            <tooltip
              v-if="isSocketDisconnectSupported && client.connected"
            >
              <template #activator>
                <button
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
          <td class="key-column px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("sockets.transport") }}</td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2"><Transport :transport="socket.transport" /></td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2"></td>
        </tr>
        <tr class="bg-gray-50 hover:bg-gray-200">
          <td class="key-column px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("sockets.address") }}</td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ socket.handshake.address }}</td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2"></td>
        </tr>
      </tbody>
    </table>
    <div class="p-4">
      <h4>{{ t("sockets.socket") }}</h4>
    </div>
    <table class="min-w-full">
      <tbody class="divide-y divide-gray-200">
        <tr class="bg-gray-50 hover:bg-gray-200">
          <td class="key-column px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("namespace") }}</td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
            <code>{{ socket.nsp }}</code>
          </td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2"></td>
        </tr>

        <tr class="bg-gray-50 hover:bg-gray-200">
          <td class="key-column px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("id") }}</td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ socket.id }}</td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2"></td>
        </tr>

        <tr class="bg-gray-50 hover:bg-gray-200">
          <td class="key-column px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("status") }}</td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
            <ConnectionStatus :connected="socket.connected" />
          </td>
          <td align="right" class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
            <tooltip
              v-if="isSocketDisconnectSupported && socket.connected"
            >
              <template #activator>
                <button
                  class="btn ml-3"
                  :disabled="isReadonly"
                  @click="disconnectSocket()"
                >
                  <LogoutIcon />
                </button>
              </template>
              <span>{{ t("sockets.disconnect") }}</span>
            </tooltip>
          </td>
        </tr>

        <tr class="bg-gray-50 hover:bg-gray-200">
          <td class="key-column px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("sockets.creation-date") }}</td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ creationDate }}</td>
          <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2"></td>
        </tr>
      </tbody>
    </table>
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
import Transport from "@/components/Transport.vue";
import ConnectionStatus from "@/components/ConnectionStatus.vue";

export default {
  name: "SocketDetails",
  components: { ConnectionStatus, Transport, Tooltip, DotsHorizontalIcon, LogoutIcon, },
  props: {
    socket: Object,
    client: Object,
  },
  setup(props) {
    const { t } = useI18n();
    const store = useStore();
    const router = useRouter();

    const creationDate = computed(() => new Date(props.socket.handshake.issued).toISOString());
    const isReadonly = computed(() => store.state.config.readonly);
    const isSocketDisconnectSupported = computed(() => store.state.config.supportedFeatures.includes("DISCONNECT"));

    const navigateToClient = () => router.push({
        name: "client",
        params: {
          id: props.client.id,
        },
      });
    const disconnectClient = () => SocketHolder.socket.emit(
        "_disconnect",
        props.socket.nsp,
        true,
        props.socket.id
      );
    const disconnectSocket = () => SocketHolder.socket.emit(
        "_disconnect",
        props.socket.nsp,
        false,
        props.socket.id
      );

    return { t, creationDate, isReadonly, isSocketDisconnectSupported, navigateToClient, disconnectClient, disconnectSocket, };
  },
};
</script>

<style scoped>
.key-column {
  width: 30%;
}
</style>
