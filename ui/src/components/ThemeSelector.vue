<template>
  <SwitchGroup as="div" class="flex items-center">
    <Switch
      v-model="darkTheme"
      :value="darkTheme"
      class="
        flex-shrink-0
        group
        relative
        rounded-full
        inline-flex
        items-center
        justify-center
        h-5
        w-10
        cursor-pointer
        focus:(outline-none
        ring-0)
      "
    >
      <span class="sr-only">{{ t('config.dark-theme') }} Setting</span>
      <span
        aria-hidden="true"
        class="
          pointer-events-none
          absolute
          bg-[#fffff] dark:bg-[#363636]
          w-full
          h-full
          rounded-md
        "
      />
      <span
        aria-hidden="true"
        :class="[
          darkTheme ? 'bg-gray-200' : 'bg-gray-600',
          'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200',
        ]"
      />
      <span
        aria-hidden="true"
        :class="[
          darkTheme ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200',
        ]"
      />
    </Switch>
    <SwitchLabel as="span" class="ml-3 cursor-pointer">
      <span class="font-medium text-sm dark:text-white text-gray-700">
        {{ t('config.dark-theme') }}
      </span>
    </SwitchLabel>
  </SwitchGroup>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { SwitchGroup, SwitchLabel, Switch } from "@headlessui/vue";

export default {
  name: "ThemeSelector",
  components: {
    Switch,
    SwitchLabel,
    SwitchGroup,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    // const darkTheme = computed(() => store.state.config.darkTheme);
    const darkTheme = ref(store.state.config.darkTheme);

    watch(darkTheme, val => {
      store.commit("config/selectTheme", val);
    });

    return { t, darkTheme, };
  },
};
</script>
