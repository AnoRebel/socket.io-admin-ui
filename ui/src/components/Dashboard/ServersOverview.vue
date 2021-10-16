<template>
  <div class="dark:bg-[#1E1E1E] bg-[#FFFFFF] shadow-lg rounded-md w-full table">
    <div
      class="font-bold text-left p-4 flex flex-row justify-between items-center"
    >
      <div class="dark:text-white text-gray-800">{{ t("servers.title") }}</div>
      <router-link
        :to="{ name: 'servers' }"
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
      <div class="flex xl:flex-col lg:flex-col sm:flex-row flex-col">
        <Doughnut :chart-data="data" class="chart" />
        <table class="flex-grow self-center w-full">
          <tbody class="divide-y dark:divide-[#393939] divide-[#E0E0E0]">
            <tr class="hover:bg-[#E0E0E0] dark:hover:bg-[#393939]">
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
                {{ t("status") }}
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
                #
              </th>
            </tr>
            <tr class="hover:bg-[#E0E0E0] dark:hover:bg-[#393939]">
              <td class="flex px-4 whitespace-nowrap py-6">
                <ServerStatus healthy />
              </td>
              <td
                class="
                  px-4
                  whitespace-nowrap
                  dark:text-white
                  text-gray-800
                  py-3
                "
              >
                <div class="text-lg font-semibold">
                  <h2>{{ healthyServers }}</h2>
                </div>
                <div class="text-sm">
                  {{ percentage(healthyServers, totalServers) }} %
                </div>
              </td>
            </tr>
            <tr class="hover:bg-[#E0E0E0] dark:hover:bg-[#393939]">
              <td class="flex px-4 whitespace-nowrap py-6">
                <ServerStatus />
              </td>
              <td
                class="
                  px-4
                  whitespace-nowrap
                  dark:text-white
                  text-gray-800
                  py-3
                "
              >
                <div class="text-lg font-semibold">
                  <h2>{{ totalServers - healthyServers }}</h2>
                </div>
                <div class="text-sm">
                  {{ percentage(totalServers - healthyServers, totalServers) }}
                  %
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { DotsHorizontalIcon } from "@heroicons/vue/solid";

import { percentage } from "@/util";
import ServerStatus from "@/components/ServerStatus.vue";
import Doughnut from "@/components/Dashboard/Doughnut.vue";
import colors from "windicss/colors";

export default {
  name: "ServersOverview",
  components: {
    ServerStatus,
    Doughnut,
    DotsHorizontalIcon,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();

    const healthyServers = computed(
      () =>
        store.state.servers.servers.filter((server) => server.healthy).length
    );
    const totalServers = computed(() => store.state.servers.servers.length);
    const darkTheme = computed(() => store.state.config.darkTheme);
    const data = computed(() => {
      return {
        labels: [t("servers.healthy"), t("servers.unhealthy")],
        datasets: [
          {
            backgroundColor: [colors.green[500], colors.red[500]],
            borderColor: darkTheme.value ? "black" : "white",
            data: [
              healthyServers.value,
              totalServers.value - healthyServers.value,
            ],
          },
        ],
      };
    });

    return { t, healthyServers, totalServers, darkTheme, data, percentage };
  },
};
</script>

<style scoped>
.chart {
  max-width: 160px;
  margin: 20px;
}
</style>
