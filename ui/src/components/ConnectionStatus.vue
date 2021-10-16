<template>
  <Status
    :value="connected"
    :ok-label="t('connected')"
    :ko-label="t('disconnected')"
  />
</template>

<script>
import { useI18n } from "vue-i18n";

import Status from "@/components/Status.vue";

export default {
  name: "ConnectionStatus",
  components: { Status, },
  props: {
    connected: {
      type:Boolean, 
      required: true,
    },
  },
  setup() {
    const { t } = useI18n();

    return { t };
  },
};
</script>
