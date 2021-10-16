<template>
  <div>
    <label
      for="language"
      class="font-light text-xs dark:text-white text-gray-800"
    >
      {{ t('config.language') }}
    </label>
    <select
      id="language"
      v-model="lang"
      name="language"
      class="
        bg-[#fffff] dark:bg-[#363636]
        mt-1
        w-full
        border-0 border-b-1
        text-base
        block
        py-2
        pr-10
        pl-3
        ring-0
        focus:(border-0
        outline-none
        border-b-1)
        sm:text-sm
        focus:ring-0
      "
      @change="onSelectLang"
    >
      <option
        v-for="(language, index) in languages"
        :key="index"
        :value="language.value"
        class="bg-[#fffff] dark:bg-[#363636] dark:text-white text-gray-900"
        :selected="language.value == lang"
      >
        {{ language.text }}
      </option>
    </select>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useStore } from "vuex";

export default {
  name: "LangSelector",
  setup() {
    const { t, locale } = useI18n();
    const store = useStore();
    const languages = ref([
        {
          text: "বাংলা",
          value: "bn",
        },
        {
          text: "English",
          value: "en",
        },
        {
          text: "Français",
          value: "fr",
        },
        {
          text: "Português (Brazil)",
          value: "pt-BR",
        },
        {
          text: "한국어",
          value: "ko",
        },
        {
          text: "简体中文",
          value: "zh-CN",
        },
      ]);

    const lang = ref(store.state.config.lang);
    // const lang = computed(() => store.state.config.lang);
    // const selectLang = () => store.commit("config/selectLang");
    const onSelectLang = () => {
      locale.value = lang.value;
      store.commit("config/selectLang", lang.value)
    };

    return { t, languages, lang, onSelectLang, };
  },
};
</script>
