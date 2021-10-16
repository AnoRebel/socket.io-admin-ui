<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
    <breadcrumbs :items="breadcrumbItems" />
  </div>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
    <!-- Replace with your content -->
    <div v-if="socket" class="flex flex-row">
      <div class="w-full md:w-1/4">
        <RoomDetails :room="room" :nsp="$route.params.nsp" />
      </div>
      <div class="w-full md:w-1/8">
        <RoomSockets :room="room" />
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
import RoomSockets from "@/components/Room/RoomSockets.vue";
import RoomDetails from "@/components/Room/RoomDetails.vue";

export default {
  name: "Sockets",
  components: { RoomDetails, RoomSockets, Breadcrumbs, },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const route = useRoute();
    const room = ref(null);

    onMounted(() => {
      const findRoomByName = computed(() => store.getters["main/findRoomByName"](
        route.params.nsp,
        route.params.name
      ));
      room.value = findRoomByName.value;
    });

    const breadcrumbItems = computed(() => [
        {
          text: t("rooms.title"),
          to: { name: "rooms" },
        },
        {
          text: t("rooms.details"),
          disabled: true,
        },
      ]);

    return {
      t,
      room,
      breadcrumbItems,
    };
  },
};
</script>
