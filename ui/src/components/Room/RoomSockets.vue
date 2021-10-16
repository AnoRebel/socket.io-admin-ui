<template>
  <div v-if="room" class="p-4 bg-white shadow-lg rounded-lg my-20 mx-6">
    <div class="font-bold text-left p-4">{{ t("sockets.title") }}</div>
    <Datatable :headers="headers" :items="room.sockets">
      <template #transport="{ item }">
        <Transport :transport="item.transport" />
      </template>
      <template #actions="{ item }">
        <tooltip v-if="isSocketLeaveSupported && !room.isPrivate">
          <template #activator>
            <button
              class="btn ml-3"
              :disabled="isReadonly"
              @click="leave(item)"
            >
              <MinusCircleIcon />
            </button>
          </template>
          <span>{{ t("rooms.leave") }}</span>
        </tooltip>

        <tooltip v-if="isSocketDisconnectSupported">
          <template #activator>
            <button
              class="btn ml-3"
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
            <button
              class="btn ml-3"
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
import { useRouter, useRoute } from "vue-router";
import { DotsHorizontalIcon } from "@heroicons/vue/solid";
import { LogoutIcon, MinusCircleIcon } from "@heroicons/vue/outline";

import SocketHolder from "@/SocketHolder";
import Tooltip from "@/components/Tooltip.vue";
import Datatable from "@/components/Datatable.vue";
import Transport from "@/components/Transport.vue";

export default {
  name: "RoomSockets",
  components: { Transport, Datatable, Tooltip, LogoutIcon, MinusCircleIcon, DotsHorizontalIcon, },
  props: {
    room: Object,
  },
  setup(props) {
    const { t } = useI18n();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const footerProps = ref({
        "items-per-page-options": [20, 100, -1],
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
    const headers = computed(() => [
        {
          text: t("id"),
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
    // const findRoomByName = (room) => store.getters["main/findRoomByName"](room);
    const findRoomByName = computed(() => store.getters["main/findRoomByName"]);
    const isReadonly = computed(() => store.state.config.readonly);
    const isSocketLeaveSupported = computed(() => store.state.config.supportedFeatures.includes("LEAVE"))
    const isSocketDisconnectSupported = computed(() => store.state.config.supportedFeatures.includes("DISCONNECT"))

    const leave = socket => SocketHolder.socket.emit("leave", socket.nsp, props.room.name, socket.id);
    const disconnect = socket => SocketHolder.socket.emit("_disconnect", socket.nsp, false, socket.id);
    const displayDetails = socket => router.push({
        name: "socket",
        params: { nsp: route.params.nsp, id: socket.id },
      });

    return { t, footerProps, breadcrumbItems, headers, findRoomByName, isReadonly, isSocketLeaveSupported, isSocketDisconnectSupported, leave, disconnect, displayDetails, };
  },
};
</script>
