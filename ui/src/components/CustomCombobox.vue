<!-- This example requires Tailwind CSS v2.0+ -->
<template>
  <div class="relative w-full">
    <div class="flex flex-col relative">
      <label
        for="combobox"
        class="block text-sm text-left text-white font-medium px-2"
      >
        {{ label }}
      </label>
      <input
        ref="inputRef"
        id="combobox"
        name="combobox"
        class="w-full border-0 border-b focus:(outline-none ring-0)"
        type="text"
        :value="modelValue"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <ChevronUpIcon
        v-if="isOpen"
        class="transition absolute right-2 bottom-2 h-6 p-1 cursor-pointer"
      />
      <ChevronDownIcon
        v-else
        class="transition absolute right-2 bottom-2 h-6 p-1 cursor-pointer"
      />
    </div>
    <transition
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ul
        :class="[
          'transition w-full max-h-40 overflow-auto divide-y divide-gray-400 bg-gray-600 absolute rounded-b-sm left-0 right-0 z-10',
          isBottom ? 'bottom-[75%]' : 'top-[105%]',
          isOpen ? '' : 'hidden',
        ]"
      >
        <li
          v-for="(option, index) in items"
          :key="index"
          class="cursor-pointer p-1"
          @click="select(option)"
        >
          {{ option.name }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/vue/solid";

export default {
  name: "CustomCombobox",
  components: { ChevronUpIcon, ChevronDownIcon },
  props: {
    label: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const inputRef = ref(null);
    const isOpen = ref(false);
    const isBottom = ref(false);

    onMounted(() => {
      inputRef.value.addEventListener("focus", (ev) => {
        let bounding = ev.target.getBoundingClientRect();
        if (
          bounding.bottom + 50 <=
          (window.innerHeight || document.documentElement.clientHeight)
        ) {
          isBottom.value = false;
        } else {
          isBottom.value = true;
        }
        isOpen.value = true;
      });
      document.addEventListener("click", (ev) => {
        if (ev.target != inputRef.value) {
          isOpen.value = false;
        }
      });
    });

    const select = (option) => {
      emit("update:modelValue", option.name);
      isOpen.value = false;
      console.log(option);
    };

    watch(
      () => props.modelValue,
      (val) => {
        console.log(props.items.filter((p) => p.name == val));
      }
    );

    onBeforeUnmount(() => {
      inputRef.value.removeEventListener("focus", (ev) => {
        let bounding = ev.target.getBoundingClientRect();
        if (
          bounding.bottom + 50 <=
          (window.innerHeight || document.documentElement.clientHeight)
        ) {
          isBottom.value = false;
        } else {
          isBottom.value = true;
        }
        isOpen.value = true;
      });
      document.removeEventListener("click", (ev) => {
        if (ev.target != inputRef.value) {
          isOpen.value = false;
        }
      });
    });

    return {
      isOpen,
      isBottom,
      inputRef,
      select,
    };
  },
};
</script>
