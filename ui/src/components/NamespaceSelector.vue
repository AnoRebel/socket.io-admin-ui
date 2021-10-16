<template>
  <Listbox as="div" v-model="selectedNamespace" class="selector">
    <ListboxLabel
      class="block text-sm text-left font-medium text-gray-700 px-2"
    >
      {{ t("select-namespace") }}
    </ListboxLabel>
    <div class="mt-1 relative">
      <ListboxButton
        class="
          bg-white
          relative
          w-full
          border-0 border-b
          pl-3
          pr-10
          py-2
          text-left
          cursor-default
          focus:outline-none
          sm:text-sm
        "
      >
        <span class="block truncate">{{ selectedNamespace.name }}</span>
        <span
          class="
            absolute
            inset-y-0
            right-0
            flex
            items-center
            pr-2
            pointer-events-none
          "
        >
          <SelectorIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="
            absolute
            z-10
            mt-1
            w-full
            bg-white
            shadow-lg
            max-h-60
            py-1
            text-base
            ring-1 ring-black ring-opacity-5
            overflow-auto
            focus:outline-none
            sm:text-sm
          "
        >
          <ListboxOption
            as="template"
            v-for="(namespace, index) in namespaces"
            :key="index"
            :value="selectedNamespace.name"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                active ? 'text-white bg-indigo-600' : 'text-gray-900',
                'cursor-default select-none relative py-2 pl-3 pr-9',
              ]"
            >
              <span
                :class="[
                  selected ? 'font-semibold' : 'font-normal',
                  'block truncate',
                ]"
              >
                {{ namespace.name }}
              </span>

              <span
                v-if="selected"
                :class="[
                  active ? 'text-white' : 'text-indigo-600',
                  'absolute inset-y-0 right-0 flex items-center pr-4',
                ]"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { useI18n } from "vue-i18n";
import { sortBy } from "lodash-es";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, SelectorIcon } from "@heroicons/vue/solid";

export default {
  name: "NamespaceSelector",
  components: {
    Listbox,
    ListboxButton,
    ListboxLabel,
    ListboxOption,
    ListboxOptions,
    CheckIcon,
    SelectorIcon,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const selectedNamespace = ref(store.state.main.selectedNamespace);
    const namespaces = computed(() =>
      sortBy(store.state.main.namespaces, "name")
    );

    watch(selectedNamespace, (val) => {
      store.commit("main/selectNamespace", val);
    });

    return { t, selectedNamespace, namespaces };
  },
};
</script>

<style scoped>
.selector {
  max-width: 200px;
}
</style>
