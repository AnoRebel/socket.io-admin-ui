<template>
  <div class="flex h-screen bg-[#fffff] dark:bg-[#363636] overflow-hidden">
    <TransitionRoot as="template" :show="sidebarOpen">
      <Dialog
        as="div"
        static
        class="flex inset-0 z-40 fixed md:hidden"
        @close="closeSidebar"
      >
        <TransitionChild
          as="template"
          enter="transition-opacity ease-linear duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <DialogOverlay class="bg-gray-900 absolute inset-0 bg-opacity-75" />
        </TransitionChild>
        <TransitionChild
          as="template"
          enter="transition ease-in-out duration-300 transform"
          enter-from="-translate-x-full"
          enter-to="translate-x-0"
          leave="transition ease-in-out duration-300 transform"
          leave-from="translate-x-0"
          leave-to="-translate-x-full"
        >
          <div
            class="
              max-w-xs
              flex flex-col
              relative
              flex-1
              w-full
              pt-5
              pb-4
              dark:bg-[#363636]
              bg-[#ffffff]
            "
          >
            <TransitionChild
              as="template"
              enter="ease-in-out duration-300"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="ease-in-out duration-300"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="-mr-12 pt-2 absolute right-0 pt-2 -mr-12">
                <button
                  class="
                    rounded-full
                    flex
                    w-10
                    items-center
                    h-10
                    ml-1
                    justify-center
                    focus:(outline-none
                    ring-2 ring-inset ring-white)
                  "
                  @click="closeSidebar"
                >
                  <span class="sr-only">Close sidebar</span>
                  <XIcon
                    class="h-6 text-white w-6"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </TransitionChild>
            <div class="flex flex-shrink-0 items-center px-4">
              <img
                class="h-8 w-auto"
                :src="logoSrc"
                alt="logo"
                width="40"
                height="40"
              />
              <span class="ml-3 dark:text-white text-xl"
                >Socket.IO Admin UI</span
              >
            </div>
            <div class="flex flex-col flex-1 h-0 mt-5 overflow-y-auto">
              <nav class="space-y-1 flex-1 px-2">
                <router-link
                  v-for="(item, index) in items"
                  :key="index"
                  :to="item.to"
                  :class="[
                    item.exact
                      ? 'dark:bg-[#666666] bg-[#E5E5E5] dark:text-white'
                      : 'dark:text-gray-300 dark:hover:bg-[#565656] hover:bg-[#D1D1D1]',
                    'group flex items-center px-2 py-2 font-medium rounded',
                  ]"
                >
                  <component
                    :is="item.icon"
                    :class="[
                      item.exact
                        ? 'dark:text-gray-200'
                        : 'dark:text-gray-400 dark:group-hover:text-gray-300',
                      'mr-4 flex-shrink-0 h-6 w-6',
                    ]"
                    aria-hidden="true"
                  />
                  {{ item.title }}
                </router-link>
              </nav>
              <div
                class="space-y-6 bg-[#fffff] dark:bg-[#363636] dark:text-white px-2.5 pb-8"
              >
                <div class="bg-gray-500 h-1px" />
                <LangSelector />
                <ThemeSelector />
                <ReadonlyToggle />
              </div>
            </div>
          </div>
        </TransitionChild>
        <div class="flex-shrink-0 w-14" aria-hidden="true">
          <!-- Dummy element to force sidebar to shrink to fit close icon -->
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Static sidebar for desktop -->
    <div class="hidden md:(flex flex-shrink-0)">
      <div class="flex flex-col w-64">
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div class="flex flex-col flex-1 h-0">
          <div
            class="
              flex
              dark:bg-[#272727]
              bg-[#F5F5F5]
              flex-shrink-0
              h-16
              px-4
              items-center
            "
          >
            <img
              class="h-8 w-auto"
              :src="logoSrc"
              alt="logo"
              width="40"
              height="40"
            />
            <span class="ml-3 dark:text-white text-xl">Socket.IO Admin UI</span>
          </div>
          <div class="bg-[#F5F5F5] dark:bg-[#272727] h-1px shadow" />
          <div class="flex flex-col flex-1 overflow-y-auto border-r border-[#ffffff] dark:border-[#363636]">
            <nav class="space-y-1 flex-1 dark:bg-[#363636] bg-[#ffffff] p-2">
              <router-link
                v-for="(item, index) in items"
                :key="index"
                :to="item.to"
                :class="[
                  item.exact
                    ? 'dark:bg-[#666666] bg-[#E5E5E5] dark:text-white'
                    : 'dark:text-gray-300 dark:hover:bg-[#565656] hover:bg-[#D1D1D1]',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded',
                ]"
              >
                <component
                  :is="item.icon"
                  :class="[
                    item.exact
                      ? 'dark:text-gray-300'
                      : 'dark:text-gray-400 dark:group-hover:text-gray-300',
                    'mr-3 flex-shrink-0 h-6 w-6',
                  ]"
                  aria-hidden="true"
                />
                {{ item.title }}
              </router-link>
            </nav>
            <div class="space-y-6 bg-[#fffff] dark:bg-[#363636] dark:text-white px-2.5 pb-8">
              <div class="bg-[#E0E0E0] h-1px" />
              <LangSelector />
              <ThemeSelector />
              <ReadonlyToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";
import {
  Dialog,
  DialogOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon, HomeIcon, UsersIcon } from "@heroicons/vue/outline";
import { ChipIcon, ServerIcon, CollectionIcon } from "@heroicons/vue/solid";

import { emitter } from "@/util";
import AppBar from "@/components/AppBar.vue";
import LangSelector from "@/components/LangSelector.vue";
import ThemeSelector from "@/components/ThemeSelector.vue";
import ReadonlyToggle from "@/components/ReadonlyToggle.vue";
import logoWhite from "@/assets/logo-light.svg";
import logoDark from "@/assets/logo-dark.svg";

export default {
  name: "Sidebar",
  components: {
    AppBar,
    LangSelector,
    ThemeSelector,
    ReadonlyToggle,
    Dialog,
    DialogOverlay,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
    XIcon,
  },
  setup() {
    const { t } = useI18n();
    const store = useStore();
    const sidebarOpen = ref(false);
    const language = ref();
    const readOnlyToggle = ref(false);
    const darkModeToggle = ref(false);
    const logoSrc = computed(() =>
      store.state.config.darkTheme ? logoDark : logoWhite
    );

    onMounted(() => {
      emitter.on("toggle-sidebar", (open) => {
        sidebarOpen.value = open;
      });
    });

    // const navigation = computed(() => [
    //   { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
    //   { name: "Sockets", href: "#", icon: ChipIcon, current: false },
    //   { name: "Rooms", href: "#", icon: CollectionIcon, current: false },
    //   { name: "Clients", href: "#", icon: UsersIcon, current: false },
    //   { name: "Servers", href: "#", icon: ServerIcon, current: false },
    // ]);

    const items = computed(() => [
      {
        title: t("dashboard.title"),
        icon: HomeIcon,
        to: { name: "dashboard" },
        exact: true,
      },
      { title: t("sockets.title"), icon: ChipIcon, to: { name: "sockets" } },
      { title: t("rooms.title"), icon: CollectionIcon, to: { name: "rooms" } },
      { title: t("clients.title"), icon: UsersIcon, to: { name: "clients" } },
      { title: t("servers.title"), icon: ServerIcon, to: { name: "servers" } },
    ]);

    const closeSidebar = () => {
      sidebarOpen.value = false;
      emitter.emit("toggle-sidebar", sidebarOpen.value);
    };

    onBeforeUnmount(() => {
      emitter.off("toggle-sidebar");
    });

    return {
      logoSrc,
      language,
      readOnlyToggle,
      darkModeToggle,
      items,
      sidebarOpen,
      closeSidebar,
    };
  },
};
</script>

<style scoped>
.shadow-r {
  /* box-shadow: 10px 0 5px -2px #888; */

  box-shadow: 0 0 15px rgba(0, 0, 0, 0.75);
  clip-path: inset(0px -15px 0px 0px);
}
</style>
