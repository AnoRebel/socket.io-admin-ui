<template>
  <div
    class="
      rounded-full
      border-1
      px-2
      mx-1.5
      text-sm
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
  name: "Transport",
  props: {
    transport: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const label = computed(() => {
      switch (props.transport) {
        case "polling":
          return "HTTP long-polling";
        case "websocket":
          return "WebSocket";
        default:
          return props.transport;
      }
    });

    const color = computed(() => {
      switch (props.transport) {
        case "polling":
          return "border-yellow-600 text-yellow-600";
        case "websocket":
          return "border-green-500 text-green-500";
        default:
          return "border-gray-400 text-gray-400";
      }
    });
    return { label, color };
  },
};
</script>
