<template>
  <table class="min-w-full divide-y divide-gray-200">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">{{ t("name") }}</th>
        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 tracking-wider">{{ t("value") }}</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-200">
      <tr v-for="{ key, value } of items" :key="key" class="bg-gray-50 hover:bg-gray-200">
        <td class="key-column px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ key }}</td>
        <td class="px-4 whitespace-nowrap text-sm text-gray-500 py-2">{{ value }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

export default {
  name: "KeyValueTable",
  props: {
    object: Object,
  },
  setup(props) {
    const { t } = useI18n();
    const items = computed(() => {
      const keys = Object.keys(props.object);
      return keys.sort().map(key => ({
        key, value: props.object[key],
      }))
    });

    return { t, items };
  },
};
</script>

<style scoped>
.key-column {
  width: 30%;
}
</style>
