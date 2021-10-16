<template>
  <v-navigation-drawer app clipped permanent class="elevation-3">
    <v-list dense nav>
      <v-list-item
        v-for="item in items"
        :key="item.title"
        :to="item.to"
        :exact="item.exact"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <v-divider />
      <div class="pa-3 pt-10">
        <LangSelector />
        <ThemeSelector />
        <ReadonlyToggle />
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

import LangSelector from "@/components/LangSelector.vue";
import ThemeSelector from "@/components/ThemeSelector.vue";
import ReadonlyToggle from "@/components/ReadonlyToggle.vue";

export default {
  name: "NavigationDrawer",
  components: { ReadonlyToggle, ThemeSelector, LangSelector, },
  setup() {
    const { t } = useI18n();
    const items = computed(() => [
        {
          title: t("dashboard.title"),
          icon: "mdi-home-outline",
          to: { name: "dashboard" },
          exact: true,
        },
        {
          title: t("sockets.title"),
          icon: "mdi-ray-start-arrow",
          to: { name: "sockets" },
        },
        {
          title: t("rooms.title"),
          icon: "mdi-tag-outline",
          to: { name: "rooms" },
        },
        {
          title: t("clients.title"),
          icon: "mdi-account-circle-outline",
          to: { name: "clients" },
        },
        {
          title: t("servers.title"),
          icon: "mdi-server",
          to: { name: "servers" },
        },
      ]);

    return { items };
  },
};
</script>
