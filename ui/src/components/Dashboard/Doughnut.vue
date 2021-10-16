<template>
  <div>
    <vue3-chart-js
      type="doughnut"
      :data="chartData"
      :options="options"
    ></vue3-chart-js>
  </div>
</template>

<script>
import Vue3ChartJs from "@j-t-mcc/vue3-chartjs";

export default {
  name: "Doughnut",
  components: {
    Vue3ChartJs,
  },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const options = {
      plugins: {
        legend: false,
      }
    };
    return { options };
  },
};
</script>
