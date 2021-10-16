<template>
  <SwitchGroup as="div" class="flex items-center">
    <Switch
      v-model="readonly"
      :value="readonly"
      :disabled="disabled"
      :class="[
        readonly ? 'bg-gray-200' : 'bg-gray-600',
        'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:(outline-none ring-0)',
      ]"
    >
      <span class="sr-only">{{ t('config.readonly') }} Setting</span>
      <span
        :class="[
          readonly ? 'translate-x-5' : 'translate-x-0',
          'pointer-events-none relative inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
        ]"
      >
        <span
          :class="[
            readonly
              ? 'opacity-0 ease-out duration-100'
              : 'opacity-100 ease-in duration-200',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
          ]"
          aria-hidden="true"
        >
          <svg
            class="h-3 text-gray-400 w-3"
            fill="none"
            viewBox="0 0 12 12"
          >
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span
          :class="[
            readonly
              ? 'opacity-100 ease-in duration-200'
              : 'opacity-0 ease-out duration-100',
            'absolute inset-0 h-full w-full flex items-center justify-center transition-opacity',
          ]"
          aria-hidden="true"
        >
          <svg
            class="h-3 text-gray-800 w-3"
            fill="currentColor"
            viewBox="0 0 12 12"
          >
            <path
              d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
            />
          </svg>
        </span>
      </span>
    </Switch>
    <SwitchLabel as="span" class="ml-3 cursor-pointer">
      <span class="font-medium text-sm dark:text-white text-gray-700">
        {{ t('config.readonly') }}
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
  name: "ReadonlyToggle",
  components: {
    Switch,
    SwitchLabel,
    SwitchGroup,
  },
  setup() {
    const store = useStore();
    const { t } = useI18n();
    // const readonly = computed(() => store.state.config.readonly);
    const disabled = computed(() => store.state.supportedFeatures?.length === 0);
    const readonly = ref(store.state.config.readonly);

    watch(readonly, () => {
      store.commit("config/toggleReadonly");
    });

    return { t, readonly, disabled, };
  },
};
</script>
