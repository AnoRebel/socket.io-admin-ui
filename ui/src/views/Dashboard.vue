<template>
  <div class="px-4 mb-6"> <!-- mx-auto max-w-7xl  -->
    <breadcrumbs :items="breadcrumbItems" />
  </div>
  <div class="mx-4">
    <!-- Replace with your content -->
    <div class="w-full grid gap-6 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1">
      <div >
        <ClientsOverview />
      </div>
      <div >
        <ServersOverview />
      </div>
      <div>
        <NamespacesOverview />
      </div>
    </div>
    <!-- /End replace -->
  </div>
</template>

<script>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import Breadcrumbs from "@/components/Breadcrumbs.vue";
import ClientsOverview from "@/components/Dashboard/ClientsOverview.vue";
import ServersOverview from "@/components/Dashboard/ServersOverview.vue";
import NamespacesOverview from "@/components/Dashboard/NamespacesOverview.vue";

export default {
  name: "Dashboard",
  components: { NamespacesOverview, ServersOverview, ClientsOverview, Breadcrumbs, },
  setup() {
    const { t } = useI18n();

    const breadcrumbItems = computed(() => [
      {
        text: t("dashboard.title"),
        disabled: true,
      },
    ]);

    return { breadcrumbItems };
  },
};
</script>
