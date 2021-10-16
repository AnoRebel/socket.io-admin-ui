<template>
  <div class="relative sm:max-w-xl sm:mx-auto">
    <div class="group relative inline-block w-auto">
      <slot name="activator"> Component </slot>
      <div
        :class="[
          'transition-opacity duration-300 opacity-0 w-auto min-w-[10rem] h-[min-content] bg-black text-white text-center text-xs rounded py-2 absolute z-10 group-hover:opacity-[85] -right-full ml-14 px-2 pointer-events-none',
          direction == 'top' ? 'bottom-full' : 'top-full',
        ]"
      >
        <slot>
          Tooltip {{ direction }}
          <!-- <svg
          class="absolute text-black h-2 w-full left-0 top-full"
          x="0px"
          y="0px"
          viewBox="0 0 255 255"
          xml:space="preserve"
        >
          <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg> -->
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tooltip",
  props: {
    direction: {
      type: String,
      default: "bottom",
    },
  },
};
</script>
