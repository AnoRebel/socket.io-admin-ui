<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
    <breadcrumbs :items="breadcrumbItems" />
  </div>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
    <!-- Replace with your content -->
    <div v-if="socket" class="flex flex-row">
      <div class="w-full md:w-1/6 lg:w-1/4">
        <SocketDetails :socket="socket" :client="client" />
      </div>
      <div class="w-full md:w-1/6 lg:w-1/4">
        <InitialRequest :socket="socket" />
      </div>
      <div class="w-full md:w-1/6 lg:w-1/4">
        <SocketRooms :socket="socket" />
      </div>
    </div>
    <!-- /End replace -->
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

import Breadcrumbs from "@/components/Breadcrumbs.vue";
import SocketRooms from "@/components/Socket/SocketRooms.vue";
import SocketDetails from "@/components/Socket/SocketDetails.vue";
import InitialRequest from "@/components/Socket/InitialRequest.vue";

export default {
  name: "Socket",
  components: { InitialRequest, SocketDetails, SocketRooms, Breadcrumbs, },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const route = useRoute();

    const socket = ref(null);
    const client = ref(null);

    onMounted(() => {
      const findSocketById = computed(() => store.getters["main/findSocketById"](
        route.params.nsp,
        route.params.id
      ));
      const findClientById = computed(() => store.getters["main/findClientById"](socket.value.clientId));
      socket.value = findSocketById.value;
      if (socket.value) {
        client.value = findClientById.value;
      }
    });

    const breadcrumbItems = computed(() => [
        {
          text: t("sockets.title"),
          to: { name: "sockets" },
        },
        {
          text: t("sockets.details"),
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
