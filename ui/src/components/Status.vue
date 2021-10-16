<template>
  <div
    class="
      rounded-full
      border-1
      px-3
      mx-1.5
      text-sm
      uppercase
      cursor-default
      hover:(bg-gray-400/10)
    "
    :class="color"
  >
    {{ label }}
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  name: "Status",
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    koLabel: {
      type: String,
      required: true,
    },
    okLabel: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const label = computed(() => 
      props.value ? props.okLabel : props.koLabel
    );
    const color = computed(() => 
      props.value ? `border-green-500 text-green-500` : `border-red-500 text-red-500`
    );

    return { label, color };
  },
};
</script>
