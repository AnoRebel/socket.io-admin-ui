<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div">
      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="min-h-screen px-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <DialogOverlay class="fixed inset-0 bg-[#1E1E1E] opacity-25" />
          </TransitionChild>

          <span class="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>

          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <div
              class="
                inline-block
                w-full
                max-w-md
                p-6
                my-8
                overflow-hidden
                text-left
                align-middle
                transition-all
                transform
                dark:bg-[#1E1E1E] bg-[#FFFFFF]
                shadow-xl
                rounded-md
              "
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 dark:text-white text-gray-800"
              >
                {{ t("connection.title") }}
              </DialogTitle>
              <form @submit.prevent="onSubmit">
                <div class="my-6">
                  <label class="block my-3">
                    <span class="text-sm dark:text-white text-gray-800">{{ t('connection.serverUrl') }}</span>
                    <input
                      v-model="serverUrl"
                      type="text"
                      class="
                        mt-0
                        block
                        w-full
                        px-0.5
                        dark:bg-[#1E1E1E] bg-[#FFFFFF]
                        dark:text-white text-gray-700
                        border-0 border-b-1 border-gray-400
                        hover:border-gray-600
                        dark:hover:border-gray-200
                        focus:(ring-0 outline-none)
                      "
                      placeholder="https://example.com/admin"
                    />
                  </label>
                  <label class="block my-3">
                    <span class="text-sm dark:text-white text-gray-800">{{ t('connection.username') }}</span>
                    <input
                      v-model="username"
                      type="text"
                      class="
                        mt-0
                        block
                        w-full
                        px-0.5
                        dark:bg-[#1E1E1E] bg-[#FFFFFF]
                        dark:text-white text-gray-700
                        border-0 border-b-1 border-gray-400
                        hover:border-gray-600
                        dark:hover:border-gray-200
                        focus:(ring-0 outline-none)
                      "
                      placeholder="Username"
                    />
                  </label>
                  <label class="block my-3">
                    <span class="text-sm dark:text-white text-gray-800">{{ t('connection.password') }}</span>
                    <input
                      v-model="password"
                      type="password"
                      class="
                        mt-0
                        block
                        w-full
                        px-0.5
                        dark:bg-[#1E1E1E] bg-[#FFFFFF]
                        dark:text-white text-gray-700
                        border-0 border-b-1 border-gray-400
                        hover:border-gray-600
                        dark:hover:border-gray-200
                        focus:(ring-0 outline-none)
                      "
                      placeholder="Password"
                    />
                  </label>
                  <SwitchGroup as="div" class="flex items-center">
                    <Switch
                      v-model="wsOnly"
                      :value="wsOnly"
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
                        focus:outline-none focus:border-0
                      "
                    >
                      <span class="sr-only">{{ t('connection.websocket-only') }} Setting</span>
                      <span
                        aria-hidden="true"
                        class="
                          pointer-events-none
                          absolute
                          dark:bg-[#1E1E1E] bg-[#FFFFFF]
                          w-full
                          h-full
                          rounded-md
                        "
                      />
                      <span
                        aria-hidden="true"
                        :class="[
                          wsOnly ? 'bg-gray-200' : 'bg-gray-600',
                          'pointer-events-none absolute h-4 w-9 mx-auto rounded-full transition-colors ease-in-out duration-200',
                        ]"
                      />
                      <span
                        aria-hidden="true"
                        :class="[
                          wsOnly ? 'translate-x-5' : 'translate-x-0',
                          'pointer-events-none absolute left-0 inline-block h-5 w-5 border border-gray-200 rounded-full bg-white shadow transform ring-0 transition-transform ease-in-out duration-200',
                        ]"
                      />
                    </Switch>
                    <SwitchLabel as="span" class="ml-3 cursor-pointer">
                      <span
                        class="font-light text-sm dark:text-white text-gray-700"
                      >
                        {{ t('connection.websocket-only') }}
                      </span>
                    </SwitchLabel>
                  </SwitchGroup>
                  <label class="block my-3">
                    <span class="text-sm dark:text-white text-gray-800">{{ t('connection.path') }}</span>
                    <input
                      v-model="path"
                      type="text"
                      class="
                        mt-0
                        block
                        w-full
                        px-0.5
                        dark:bg-[#1E1E1E] bg-[#FFFFFF]
                        dark:text-white text-gray-700
                        border-0 border-b-1 border-gray-400
                        hover:border-gray-600
                        dark:hover:border-gray-200
                        focus:(ring-0 outline-none)
                      "
                      placeholder="Password"
                    />
                  </label>
                </div>

                <div class="mt-4">
                  <button
                    type="submit"
                    :class="[
                      'inline-flex justify-center px-4 py-2 text-sm font-medium uppercase text-white border border-transparent rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500',
                      isConnecting
                        ? 'bg-gray-300'
                        : 'bg-blue-500 shadow-md hover:bg-blue-400',
                    ]"
                    :disabled="isConnecting || !isValid"
                  >
                    <svg
                      v-if="isConnecting"
                      class="animate-spin h-5 w-5 text-gray-700 mx-8"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span v-else class="tracking-widest">{{ t("connection.connect") }}</span>
                  </button>
                </div>
              </form>
              <div v-if="error" class="text-red-500 mt-3 px-1">
                {{ errorMessage }}
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

</template>

<script>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogOverlay,
  DialogTitle,
  Switch,
  SwitchLabel,
  SwitchGroup,
} from "@headlessui/vue";

export default {
  name: "ConnectionModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    isConnecting: {
      type: Boolean,
      required: true,
    },
    initialServerUrl: {
      type: String,
      required: true,
    },
    initialWsOnly: {
      type: Boolean,
      required: true,
    },
    initialPath: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      required: true,
    },
  },
  components: {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogOverlay,
    DialogTitle,
    Switch,
    SwitchLabel,
    SwitchGroup,
  },
  setup(props, { emit }) {
    const { t } = useI18n();
    const serverUrl = ref(props.initialServerUrl);
    const wsOnly = ref(props.initialWsOnly);
    const path = ref(props.initialPath);
    const username = ref("");
    const password = ref("");

    const isValid = computed(() => serverUrl.value && serverUrl.value.length);
    const errorMessage = computed(() => props.error === "invalid credentials" ? t("connection.invalid-credentials") : t("connection.error") + t("separator") + props.error);

    const onSubmit = () => {
      emit("submit", {
        serverUrl: serverUrl.value,
        wsOnly: wsOnly.value,
        path: path.value,
        username: username.value,
        password: password.value,
      });
    };

    return {
      t, serverUrl,
      wsOnly,
      path,
      username,
      password,
      isValid,
      errorMessage,
      onSubmit,
    };
  },
};
</script>
