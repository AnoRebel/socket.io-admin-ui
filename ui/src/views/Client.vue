<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
    <breadcrumbs :items="breadcrumbItems" />
  </div>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
    <!-- Replace with your content -->
    <div v-if="client" class="flex flex-row">
      <div class="w-full md:w-1/6 lg:w-1/4">
        <ClientDetails :client="client" :socket="socket" />
      </div>
      <div class="w-full md:w-1/6 lg:w-1/4">
        <InitialRequest :socket="socket" v-if="socket" />
      </div>
      <div class="w-full md:w-1/6 lg:w-1/4">
        <ClientSockets :sockets="client.sockets" />
      </div>
    </div>
    <!-- /End replace -->
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

import Breadcrumbs from "@/components/Breadcrumbs.vue";
import ClientDetails from "@/components/Client/ClientDetails.vue";
import ClientSockets from "@/components/Client/ClientSockets.vue";
import InitialRequest from "@/components/Socket/InitialRequest.vue";

export default {
  name: "Client",
  components: { ClientSockets, InitialRequest, ClientDetails, Breadcrumbs, },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const route = useRoute();

    const socket = ref(null);
    const client = ref(null);

    onMounted(() => {
      const findClientById = computed(() => store.getters["main/findClientById"](route.params.id));
      client.value = findClientById.value;
      if (client.value) {
        socket.value = client.value.sockets[0];
      }
    });

    const breadcrumbItems = computed(() => [
        {
          text: t("clients.title"),
          to: { name: "clients" },
          // exact: true, // Unnecessary in Vue 3
        },
        {
          text: t("clients.details"),
          disabled: true,
        },
      ]);

    return {
      socket,
      client,
      breadcrumbItems,
    };
  },
};
</script>

<style scoped></style>
