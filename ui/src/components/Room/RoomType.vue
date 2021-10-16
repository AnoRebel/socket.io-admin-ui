<template>
  <Status
    :value="!isPrivate"
    :ok-label="t('rooms.public')"
    :ko-label="t('rooms.private')"
  />
</template>

<script>
import { useI18n } from "vue-i18n";

import Status from "@/components/Status.vue";

export default {
  name: "RoomType",
  components: { Status, },
  props: {
    isPrivate: Boolean,
  },
  setup() {
    const { t } = useI18n();

    return { t };
  },
};
</script>
