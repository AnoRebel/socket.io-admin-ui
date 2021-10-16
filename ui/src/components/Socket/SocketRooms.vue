<template>
  <div class="p-4 bg-white shadow-lg rounded-lg my-20 mx-6">
    <div class="font-bold text-left p-4">{{ t("rooms.title") }}</div>
    <Datatable :headers="headers" :items="roomsAsObjects" :dense="true">
      <template #actions="{ item }">
        <tooltip v-if="isSocketLeaveSupported">
          <template #activator>
            <button
              class="btn ml-3"
              :disabled="isReadonly"
              @click="leave(item)"
            >
              <LogoutIcon />
            </button>
          </template>
          <span>{{ t("sockets.leave") }}</span>
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
          <span>{{ t("rooms.displayDetails") }}</span>
        </tooltip>
      </template>
    </Datatable>
    <div class="p-4">
      <form @submit.prevent="onSubmit">
        <CustomCombobox
          v-model="newRoom"
          class="select-room"
          :label="t('sockets.join-a-room')"
          :items="availableRooms"
          :disabled="isReadonly"
        />

        <tooltip>
          <template #activator>
            <button
              class="btn"
              type="submit"
              :disabled="isReadonly"
            >
              <PlusCircleIcon />
            </button>
          </template>
          <span>{{ t("sockets.join") }}</span>
        </tooltip>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import { differenceBy } from "lodash-es";
import { DotsHorizontalIcon } from "@heroicons/vue/solid";
import { LogoutIcon, PlusCircleIcon } from "@heroicons/vue/outline";

import SocketHolder from "@/SocketHolder";
import Tooltip from "@/components/Tooltip.vue";
import Datatable from "@/components/Datatable.vue";
import CustomCombobox from "@/components/CustomCombobox.vue";

export default {
  name: "SocketRooms",
  components: {
    Tooltip,
    Datatable,
    CustomCombobox,
    PlusCircleIcon,
    LogoutIcon,
    DotsHorizontalIcon,
  },
  props: {
    socket: Object,
  },
  setup(props) {
    const { t } = useI18n();
    const store = useStore();
    const router = useRouter();
    const newRoom = ref("");
    const headers = computed(() => [
        {
          text: t("id"),
          value: "name",
          align: "start",
        },
        {
          value: "actions",
          align: "end",
          sortable: false,
        },
      ]);
    const roomsAsObjects = computed(() => props.socket.rooms
        .slice(0)
        .sort()
        .map((room) => ({
          name: room,
        })));
    const availableRooms = computed(() => differenceBy(
        store.getters['main/findRoomsByNamespace'](props.socket.nsp),
        roomsAsObjects.value,
        "name"
      ));
    const selectedNamespace = computed(() => store.state.main.selectedNamespace);
    const isReadonly = computed(() => store.state.config.readonly);
    const isSocketLeaveSupported = computed(() => store.state.config.supportedFeatures.includes("LEAVE"));
    const isSocketDisconnectSupported = computed(() => store.state.config.supportedFeatures.includes("DISCONNECT"));
    // const findRoomsByNamespace = computed(() => store.getters['main/findRoomsByNamespace']);

    const emit = () => {
      // TODO
    };
    const onSubmit = () => {
      SocketHolder.socket.emit(
        "join",
        props.socket.nsp,
        newRoom.value,
        props.socket.id
      );
      newRoom.value = "";
    };
    const leave = (room) => SocketHolder.socket.emit(
        "leave",
        props.socket.nsp,
        room.name,
        props.socket.id
      );
    const disconnect = () => SocketHolder.socket.emit(
        "_disconnect",
        props.socket.nsp,
        false,
        props.socket.id
      );
    const displayDetails = (room) => router.push({
        name: "room",
        params: { nsp: props.socket.nsp, name: room.name },
      });

    return {
      t,
      newRoom,
      headers,
      roomsAsObjects,
      availableRooms,
      selectedNamespace,
      isReadonly,
      isSocketLeaveSupported,
      isSocketDisconnectSupported,
      emit,
      onSubmit,
      leave,
      disconnect,
      displayDetails,
    };
  },
};
</script>

<style scoped>
.select-room {
  max-width: 200px;
}
</style>
