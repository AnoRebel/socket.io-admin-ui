<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
    <breadcrumbs :items="breadcrumbItems" />
  </div>
  <div class="p-4 bg-white shadow-lg rounded-lg my-20 mx-6">
    <div class="p-4">
      <NamespaceSelector />
    </div>
    <Datatable :headers="headers" :items="sockets">
      <template #transport="{ item }">
          <Transport :transport="item.transport" />
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
import NamespaceSelector from "@/components/NamespaceSelector.vue";

export default {
  name: "Sockets",
  components: { Transport, NamespaceSelector, Breadcrumbs, Datatable, Tooltip, LogoutIcon, DotsHorizontalIcon },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const router = useRouter();
    const footerProps = ref({
        "items-per-page-options": [20, 100, -1],
      });

    const headers = computed(() => [
        {
          text: "#",
          value: "id",
          align: "start",
        },
        {
          text: t("sockets.address"),
          value: "handshake.address",
        },
        {
          text: t("sockets.transport"),
          value: "transport",
        },
        {
          value: "actions",
          align: "end",
          sortable: false,
        },
      ]);
    const breadcrumbItems = computed(() => [
        {
          text: t("sockets.title"),
          disabled: true,
        },
      ]);
    const sockets = computed(() => store.getters["main/sockets"]);
    const selectedNamespace = (() => store.state.main.selectedNamespace);
    const isReadonly = computed(() => store.state.config.readonly);
    const isSocketDisconnectSupported = computed(() => store.state.config.supportedFeatures.includes("DISCONNECT"));

    const disconnect = (socket) => {
      SocketHolder.socket.emit("_disconnect", socket.nsp, false, socket.id);
    };
    const displayDetails = (socket) => {
      router.push({
        name: "socket",
        params: { nsp: selectedNamespace.value.name, id: socket.id },
      });
    };

    return {
      t,
      footerProps,
      breadcrumbItems,
      headers,
      sockets,
      selectedNamespace,
      isReadonly,
      isSocketDisconnectSupported,
      disconnect,
      displayDetails,
    };
  },
};
</script>
