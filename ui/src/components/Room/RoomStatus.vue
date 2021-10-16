<template>
  <Status
    :value="active"
    :ok-label="t('rooms.active')"
    :ko-label="t('rooms.deleted')"
  />
</template>

<script>
import { useI18n } from "vue-i18n";

import Status from "@/components/Status.vue";

export default {
  name: "RoomStatus",
  components: { Status, },
  props: {
    active: Boolean,
  },
  setup() {
    const { t } = useI18n();

    return { t };
  },
};
</script>
