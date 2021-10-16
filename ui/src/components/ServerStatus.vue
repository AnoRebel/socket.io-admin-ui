<template>
  <Status
    :value="healthy"
    :ok-label="t('servers.healthy')"
    :ko-label="t('servers.unhealthy')"
  />
</template>

<script>
import { useI18n } from "vue-i18n";

import Status from "@/components/Status.vue";

export default {
  name: "ServerStatus",
  components: { Status, },
  props: {
    healthy: Boolean,
  },
  setup() {
    const { t } = useI18n();

    return { t };
  },
};
</script>
