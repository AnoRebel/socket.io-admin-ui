<template>
  <div class="dark:bg-[#1E1E1E] bg-[#FFFFFF] shadow-lg rounded-md w-full table">
    <div
      class="font-bold text-left p-4 flex flex-row justify-between items-center"
    >
      <div class="dark:text-white text-gray-800">{{ t("clients.title") }}</div>
      <router-link
        :to="{ name: 'clients' }"
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
                  dark:text-white
                  text-gray-800 text-left text-xs
                  font-medium
                  tracking-wider
                "
              >
                {{ t("sockets.transport") }}
              </th>
              <th
                class="
                  px-4
                  py-3
                  dark:text-white
                  text-gray-800 text-left text-xs
                  font-medium
                  tracking-wider
                "
              >
                #
              </th>
            </tr>
            <tr
              v-for="transport in transports"
              :key="transport"
              class="hover:bg-[#E0E0E0] dark:hover:bg-[#393939]"
            >
              <td class="flex px-4 whitespace-nowrap py-6">
                <Transport :transport="transport" />
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
                  <h2>{{ transportRepartition[transport] || 0 }}</h2>
                </div>
                <div class="text-sm">
                  {{
                    percentage(
                      transportRepartition[transport] || 0,
                      clients.length
                    )
                  }}
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
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { DotsHorizontalIcon } from "@heroicons/vue/solid";

import { percentage } from "@/util";
import Transport from "@/components/Transport.vue";
import Doughnut from "@/components/Dashboard/Doughnut.vue";
import colors from "windicss/colors";

export default {
  name: "ClientsOverview",
  components: {
    Transport,
    Doughnut,
    DotsHorizontalIcon,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();

    const transports = ref(["websocket", "polling"]);
    const clients = computed(() => store.state.main.clients);
    const darkTheme = computed(() => store.state.config.darkTheme);
    const transportRepartition = computed(() =>
      clients.value
        .map((client) => {
          return client.sockets[0];
        })
        .filter((socket) => !!socket)
        .reduce((acc, socket) => {
          acc[socket.transport] = acc[socket.transport] || 0;
          acc[socket.transport]++;
          return acc;
        }, {})
    );
    const data = computed(() => {
      return {
        labels: ["WebSocket", "HTTP long-polling"],
        datasets: [
          {
            backgroundColor: [colors.green[500], colors.orange[500]],
            borderColor: darkTheme.value ? "black" : "white",
            data: [
              transportRepartition.value["websocket"],
              transportRepartition.value["polling"],
            ],
          },
        ],
      };
    });

    return {
      t,
      transports,
      clients,
      darkTheme,
      transportRepartition,
      data,
      percentage,
    };
  },
};
</script>

<style scoped>
.chart {
  max-width: 160px;
  margin: 20px;
}
</style>
