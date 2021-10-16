<template>
  <div class="dark:bg-[#1E1E1E] bg-[#FFFFFF] shadow-lg rounded-md w-full table">
    <div
      class="font-bold text-left p-4 flex flex-row justify-between items-center"
    >
      <div class="dark:text-white text-gray-800">{{ t("namespaces") }}</div>
      <router-link
        :to="{ name: 'sockets' }"
        class="
          dark:(bg-[#272727]
          text-white)
          bg-[#F5F5F5]
          text-gray-800
          hover:bg-gray-200
          dark:hover:bg-[#333333]
          py-1
          px-2.5
          rounded
          shadow
        "
      >
        <DotsHorizontalIcon class="h-5 w-5" />
      </router-link>
    </div>
    <div class="p-2">
      <table class="w-full divide-y dark:divide-[#393939] divide-[#E0E0E0]">
        <thead>
          <tr>
            <th
              class="
                px-4
                py-3
                text-left text-xs
                font-medium
                dark:text-white
                text-gray-800
                tracking-wider
              "
            >
              {{ t("name") }}
            </th>
            <th
              class="
                px-4
                py-3
                text-left text-xs
                font-medium
                dark:text-white
                text-gray-800
                tracking-wider
              "
            >
              {{ t("rooms.sockets-count") }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y dark:divide-[#393939] divide-[#E0E0E0]">
          <tr
            v-for="namespace of namespaces"
            :key="namespace.name"
            class="hover:bg-[#E0E0E0] dark:hover:bg-[#393939]"
          >
            <td
              class="
                key-column
                px-4
                whitespace-nowrap
                text-sm
                dark:text-white
                text-gray-800
                py-2
              "
            >
              <code
                class="
                  mx-1
                  text-sm
                  p-1
                  rounded-sm
                  dark:bg-gray-500
                  bg-gray-300
                  dark:text-gray-100
                "
              >
                {{ namespace.name }}
              </code>
            </td>
            <td
              class="
                px-4
                whitespace-nowrap
                text-sm
                dark:text-white
                text-gray-800
                py-2
              "
            >
              {{ namespace.sockets.length }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { sortBy } from "lodash-es";
import { DotsHorizontalIcon } from "@heroicons/vue/solid";

export default {
  name: "NamespacesOverview",
  components: { DotsHorizontalIcon },
  setup() {
    const { t } = useI18n();
    const store = useStore();

    const namespaces = computed(() =>
      sortBy(store.state.main.namespaces, "name")
    );

    return { t, namespaces };
  },
};
</script>

<style scoped></style>
