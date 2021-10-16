<template>
  <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
    <breadcrumbs :items="breadcrumbItems" />
  </div>
  <div class="p-4 bg-white shadow-lg rounded-lg my-20 mx-6">
    <div class="p-4">
      <NamespaceSelector />
      <SwitchGroup as="div" class="flex items-center">
        <Switch v-model="showPrivateRooms" :class="[showPrivateRooms ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none']">
          <span aria-hidden="true" :class="[showPrivateRooms ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200']" />
        </Switch>
        <SwitchLabel as="span" class="ml-3">
          <span class="text-sm font-medium text-gray-900">{{ t('rooms.show-private') }}</span>
        </SwitchLabel>
      </SwitchGroup>
    </div>
    <Datatable
        :headers="headers"
        :items="filteredRooms"
      >
        <template #sockets="{ item }">
          {{ item.sockets.length }}
        </template>

        <template #isPrivate="{ item }">
          <RoomType :is-private="item.isPrivate" />
        </template>

        <template #actions="{ item }">
          <tooltip v-if="isMultiLeaveSupported && !item.isPrivate">
            <template #activator>
              <button
                class="btn ml-3"
                :disabled="isReadonly"
                @click="clear(item)"
              >
                <MinusCircleIcon />
              </button>
            </template>
            <span>{{ t("rooms.clear") }}</span>
          </tooltip>

          <tooltip v-if="isMultiDisconnectSupported">
            <template #activator>
              <button
                class="btn ml-3"
                :disabled="isReadonly"
                @click="disconnect(item)"
              >
                <LogoutIcon />
              </button>
            </template>
            <span>{{ t("rooms.disconnect") }}</span>
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
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { sortBy } from "lodash-es";
import { useRoute, useRouter } from "vue-router";
import { DotsHorizontalIcon } from "@heroicons/vue/solid";
import { Switch, SwitchGroup, SwitchLabel } from '@headlessui/vue'
import { MinusCircleIcon, LogoutIcon } from "@heroicons/vue/outline";

import SocketHolder from "@/SocketHolder";
import Tooltip from "@/components/Tooltip.vue";
import Datatable from "@/components/Datatable.vue";
import RoomType from "@/components/Room/RoomType.vue";
import Breadcrumbs from "@/components/Breadcrumbs.vue";
import NamespaceSelector from "@/components/NamespaceSelector.vue";

export default {
  name: "Rooms",
  components: { RoomType, NamespaceSelector, Datatable, Tooltip, Breadcrumbs, DotsHorizontalIcon, MinusCircleIcon, LogoutIcon, Switch, SwitchGroup, SwitchLabel, },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const showPrivateRooms = ref(false);

    onMounted(() => {
      showPrivateRooms.value = route.query.p === "1";
    });

    const footerProps = ref({
        "items-per-page-options": [20, 100, -1],
      });
    const breadcrumbItems = computed(() => [
        {
          text: t("rooms.title"),
          disabled: true,
        },
      ]);
    const headers = computed(() => [
        {
          text: t("id"),
          value: "name",
          align: "start",
        },
        {
          text: t("type"),
          value: "isPrivate",
        },
        {
          text: t("rooms.sockets-count"),
          value: "sockets",
        },
        {
          value: "actions",
          align: "end",
          sortable: false,
        },
      ]);
    const rooms = computed(() => store.getters["main/rooms"]);
    const selectedNamespace = computed(() => store.state.main.selectedNamespace);
    const isReadonly = computed(() => store.state.config.readonly);
    const isMultiLeaveSupported = computed(() => store.state.config.supportedFeatures.includes("MLEAVE"));
    const isMultiDisconnectSupported = computed(() => store.state.config.supportedFeatures.includes("MDISCONNECT"));
    const filteredRooms = computed(() => {
      const filteredRooms = showPrivateRooms.value
        ? rooms.value
        : rooms.value.filter((room) => !room.isPrivate);
      return sortBy(filteredRooms, "name");
    });

    const clear = (room) => {
      SocketHolder.socket.emit("leave", selectedNamespace.value.name, room.name);
    };
    const disconnect = (room) => SocketHolder.socket.emit(
        "_disconnect",
        selectedNamespace.value.name,
        false,
        room.name
      );
    const displayDetails = (room) => router.push({
        name: "room",
        params: { nsp: selectedNamespace.value.name, name: room.name },
      });
    // const onPrivateRoomsUpdate = (value) => {
    //   const query = value ? { p: 1 } : {};
    //   router.replace({
    //     name: "rooms",
    //     query,
    //   });
    // };
    watch(showPrivateRooms, val => {
      const query = val ? { p: 1 } : {};
      router.replace({
        name: "rooms",
        query,
      });
    });

    return {
      t,
      showPrivateRooms,
      footerProps,
      breadcrumbItems,
      headers,
      isReadonly,
      isMultiLeaveSupported,
      isMultiDisconnectSupported,
      filteredRooms,
      clear,
      disconnect,
      displayDetails,
      // onPrivateRoomsUpdate,
    };
  },
};
</script>
