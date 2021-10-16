<template>
  <div class="p-4 bg-white shadow-lg rounded-lg my-20 mx-6">
    <div class="font-bold text-left p-4">{{ t("details") }}</div>
    <table class="min-w-full">
      <tbody class="divide-y divide-gray-200">
        <tr class="bg-gray-50 hover:bg-gray-200">
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("namespace") }}</td>
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
              <code>{{ nsp }}</code>
            </td>
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2"></td>
          </tr>

          <tr class="bg-gray-50 hover:bg-gray-200">
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("id") }}</td>
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
              {{ room.name }}
            </td>
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2"></td>
          </tr>

          <tr class="bg-gray-50 hover:bg-gray-200">
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("status") }}</td>
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
              <RoomStatus :active="room.active" />
            </td>
            <td align="right" class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
              <tooltip v-if="isMultiLeaveSupported && !room.isPrivate">
                <template #activator>
                  <button
                    class="btn ml-3"
                    :disabled="isReadonly"
                    @click="clear()"
                  >
                    <MinusCircleIcon />
                  </button>
                </template>
                <span>{{ t("rooms.clear") }}</span>
              </tooltip>
            </td>
          </tr>

          <tr class="bg-gray-50 hover:bg-gray-200">
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ t("type") }}</td>
            <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">
              <RoomType :is-private="room.isPrivate" />
            </td>
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
import { MinusCircleIcon } from "@heroicons/vue/outline";

import SocketHolder from "@/SocketHolder";
import Tooltip from "@/components/Tooltip.vue";
import RoomType from "@/components/Room/RoomType.vue";
import RoomStatus from "@/components/Room/RoomStatus.vue";

export default {
  name: "RoomDetails",
  components: { RoomType, RoomStatus, Tooltip, MinusCircleIcon },
  props: {
    room: Object,
    nsp: String,
  },
  setup(props) {
    const { t } = useI18n();
    const store = useStore();

    const isReadonly = computed(() => store.state.config.readonly);
    const isMultiLeaveSupported = computed(() => store.state.config.supportedFeatures.includes("MLEAVE"));

    const clear = () => SocketHolder.socket.emit("leave", props.nsp, props.room.name);

    return { t, isReadonly, isMultiLeaveSupported, clear };
  },
};
</script>
