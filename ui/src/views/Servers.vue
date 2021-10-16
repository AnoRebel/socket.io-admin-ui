<template>
  <div class="px-4 mb-6">
    <breadcrumbs :items="breadcrumbItems" />
  </div>
  <div class="dark:bg-[#1E1E1E] bg-[#FFFFFF] shadow-lg rounded-md mx-6 overflow-hidden">
    <Datatable :headers="headers" :items="servers">
      <template #uptime="{ item }">
        {{ formatDuration(item.uptime) }}
      </template>
      <template #lastPing="{ item }">
        {{ delaySinceLastPing(item.lastPing) }}
      </template>

      <template #healthy="{ item }">
        <ServerStatus :healthy="item.healthy" />
      </template>

      <template #actions="{ item }">
        <button
          v-if="!item.healthy"
          class="
            btn
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
          @click="removeServer(item)"
        >
          <TrashIcon class="h-5 w-5" />
        </button>
      </template>
    </Datatable>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { sortBy } from "lodash-es";
import { TrashIcon } from "@heroicons/vue/outline";

import { formatDuration } from "@/util";
import ServerStatus from "@/components/ServerStatus.vue";
import Datatable from "@/components/Datatable.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";

export default {
  name: "Servers",
  components: { ServerStatus, Datatable, Breadcrumbs, TrashIcon },
  setup() {
    let interval;
    const { t } = useI18n();
    const store = useStore();
    const footerProps = ref({
      "items-per-page-options": [20, 100, -1],
    });
    const now = ref(Date.now());

    onMounted(() => {
      interval = setInterval(() => {
        now.value = Date.now();
      }, 1000);
    });
    onBeforeUnmount(() => {
      if (interval) clearInterval(interval);
    });

    const breadcrumbItems = computed(() => [
      {
        text: t("servers.title"),
        disabled: true,
      },
    ]);
    const headers = computed(() => [
      {
        text: t("id"),
        value: "serverId",
      },
      {
        text: t("servers.hostname"),
        value: "hostname",
      },
      {
        text: t("servers.pid"),
        value: "pid",
      },
      {
        text: t("servers.uptime"),
        value: "uptime",
      },
      {
        text: t("servers.clients-count"),
        value: "clientsCount",
      },
      {
        text: t("servers.last-ping"),
        value: "lastPing",
      },
      {
        text: t("status"),
        value: "healthy",
      },
      {
        value: "actions",
        align: "end",
        sortable: false,
      },
    ]);
    const servers = computed(() =>
      sortBy(store.state.servers.servers, "serverId")
    );

    const delaySinceLastPing = (lastPing) => {
      const delay = now.value - lastPing;
      return `${formatDuration(delay / 1000)} ago`;
    };
    const removeServer = (item) => {
      store.commit("servers/removeServer", item.serverId);
    };

    return {
      footerProps,
      now,
      breadcrumbItems,
      headers,
      servers,
      formatDuration,
      delaySinceLastPing,
      removeServer,
    };
  },
};
</script>
