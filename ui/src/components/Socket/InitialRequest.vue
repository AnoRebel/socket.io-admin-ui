<template>
  <div class="p-4 bg-white shadow-lg rounded-lg my-20 mx-6">
    <div class="font-bold text-left p-4">{{ t("sockets.initial-request") }}</div>
    <div class="p-4">
      <h4>{{ t("sockets.headers") }}</h4>
    </div>
    <KeyValueTable :object="socket.handshake.headers" />
    <div class="p-4">
      <h4>{{ t("sockets.query-params") }}</h4>
    </div>
    <KeyValueTable :object="socket.handshake.query" />
  </div>
</template>

<script>
import { useI18n } from "vue-i18n";

import KeyValueTable from "@/components/KeyValueTable.vue";

export default {
  name: "InitialRequest",
  components: { KeyValueTable, },
  props: {
    socket: Object,
  },
  setup() {
    const { t } = useI18n();

    return { t };
  },
};
</script>
