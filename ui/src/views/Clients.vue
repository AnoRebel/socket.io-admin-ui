<template>
  <div class="px-4 mb-6">
    <breadcrumbs :items="breadcrumbItems" />
  </div>
  <div class="dark:bg-[#1E1E1E] bg-[#FFFFFF] shadow-lg rounded-md mx-6 overflow-hidden">
    <Datatable :headers="headers" :items="clients">
      <template #address="{ item }">
        <span v-if="item.sockets.length">
          {{ item.sockets[0].handshake.address }}
        </span>
      </template>

      <template #transport="{ item }">
        <Transport
          v-if="item.sockets.length"
          :transport="item.sockets[0].transport"
        />
      </template>

      <template #sockets="{ item }">
        {{ item.sockets.length }}
      </template>

      <template #actions="{ item }">
        <tooltip v-if="isSocketDisconnectSupported">
          <template #activator>
            <button
              class="
                btn
                ml-3
                py-1
                px-2.5
                rounded
                shadow
                dark:(bg-[#272727]
                text-white)
                bg-[#F5F5F5]
                text-gray-800
                hover:bg-gray-200
                dark:hover:bg-[#333333]
              "
              @click="disconnect(item)"
              :disabled="isReadonly"
            >
              <LogoutIcon class="h-5 w-5" />
            </button>
          </template>
          <span>{{ t("clients.disconnect") }}</span>
        </tooltip>

        <tooltip>
          <template #activator>
            <button
              class="
                btn
                ml-3
                py-1
                px-2.5
                rounded
                shadow
                dark:(bg-[#272727]
                text-white)
                bg-[#F5F5F5]
                text-gray-800
                hover:bg-gray-200
                dark:hover:bg-[#333333]
              "
              @click="displayDetails(item)"
            >
              <DotsHorizontalIcon class="h-5 w-5" />
            </button>
          </template>
          <span>{{ t("clients.displayDetails") }}</span>
        </tooltip>
      </template>
    </Datatable>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { LogoutIcon } from "@heroicons/vue/outline";
import { DotsHorizontalIcon } from "@heroicons/vue/solid";

import SocketHolder from "@/SocketHolder";
import Tooltip from "@/components/Tooltip.vue";
import Datatable from "@/components/Datatable.vue";
import Transport from "@/components/Transport.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";

export default {
  name: "Clients",
  components: {
    Transport,
    LogoutIcon,
    DotsHorizontalIcon,
    Tooltip,
    Datatable,
    Breadcrumbs,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const router = useRouter();

    const footerProps = ref({
      "items-per-page-options": [20, 100, -1],
    });

    const breadcrumbItems = computed(() => [
      {
        text: t("clients.title"),
        disabled: true,
      },
    ]);
    const headers = computed(() => [
      {
        text: "#",
        value: "id",
        align: "start",
      },
      {
        text: t("sockets.address"),
        value: "address",
      },
      {
        text: t("sockets.transport"),
        value: "transport",
      },
      {
        text: t("clients.sockets-count"),
        value: "sockets",
      },
      {
        value: "actions",
        align: "end",
        sortable: false,
      },
    ]);
    const clients = computed(() => store.state.main.clients);
    const isReadonly = computed(() => store.state.config.readonly);
    const isSocketDisconnectSupported = computed(() =>
      store.state.config.supportedFeatures.includes("DISCONNECT")
    );

    const disconnect = (client) => {
      const socket = client.sockets[0];
      if (socket) {
        SocketHolder.socket.emit("_disconnect", socket.nsp, true, socket.id);
      }
    };
    const displayDetails = (client) => {
      router.push({ name: "client", params: { id: client.id } });
    };

    return {
      t,
      footerProps,
      breadcrumbItems,
      headers,
      clients,
      isReadonly,
      isSocketDisconnectSupported,
      disconnect,
      displayDetails,
    };
  },
};
</script>
