<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div class="overflow-hidden">
          <table class="w-full dark:divide-[#393939] divide-[#E0E0E0]">
            <thead>
              <tr>
                <th
                  v-if="numbers"
                  :class="[
                    'px-4 py-3 text-sm font-semibold dark:text-white text-gray-800',
                    dense == true ? 'py-2' : 'py-3',
                  ]"
                >
                  <span>#</span>
                </th>
                <th
                  v-for="(item, index) in headers"
                  :key="index"
                  scope="col"
                  :class="[
                    'px-6 text-left text-xs font-medium dark:text-white text-gray-800 uppercase tracking-wider',
                    dense == true ? 'py-2' : 'py-3',
                  ]"
                  @click="item.text && sort(item.value)"
                >
                  <div class="inline-flex space-x-2">
                    <span>{{ item.text ?? "" }}</span>
                    <span v-if="item.text">
                      <svg
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          v-if="
                            currentSortDir === 'asc' &&
                            currentSort === item.value
                          "
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        ></path>
                        <path
                          v-else
                          fill-rule="evenodd"
                          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                    </span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody
              v-if="sortedData.length"
              class="divide-y dark:divide-[#393939] divide-[#E0E0E0]"
            >
              <tr
                v-for="(item, index) in sortedData"
                :key="stats.currentPage"
                :class="
                  index % 2 === 0
                    ? 'bg-white hover:bg-[#E0E0E0] dark:hover:bg-[#393939]'
                    : 'bg-gray-50 hover:bg-[#E0E0E0] dark:hover:bg-[#393939]'
                "
              >
                <td
                  v-if="numbers"
                  :class="[
                    'px-4 whitespace-nowrap text-sm text-gray-600',
                    dense == true ? 'py-2' : 'py-4',
                  ]"
                >
                  {{ index }}
                </td>
                <td
                  v-for="(name, ix) in headers"
                  :key="ix"
                  :class="[
                    'px-6 whitespace-nowrap text-sm text-gray-500',
                    dense == true ? 'py-2' : 'py-4',
                  ]"
                >
                  <slot :name="name.value" :item="item">
                    {{ item[name.value] }}
                  </slot>
                </td>
              </tr>
            </tbody>
            <tbody
              v-else
              class="divide-y dark:divide-[#393939] divide-[#E0E0E0]"
            >
              <tr>
                <th
                  :colspan="headers.length"
                  rowspan="3"
                  class="
                    dark:bg-[#1E1E1E]
                    bg-[#FFFFFF]
                    dark:text-white
                    text-gray-800
                    py-4
                    text-center
                  "
                >
                  No Data Available
                </th>
              </tr>
            </tbody>
          </table>
          <div
            v-if="footer"
            class="flex flex-row items-center justify-end space-x-8 my-2.5 px-4"
          >
            <div class="flex flex-row space-x-4">
              <span class="mx-1 dark:text-white text-gray-800"
                >Rows per page:</span
              >
              <select
                v-model.number="pageSize"
                class="
                  bg-[#fffff]
                  dark:bg-[#1E1E1E] dark:text-white
                  text-gray-800
                  cursor-pointer
                  focus:(outline-none
                  border-0) border-0 border-b-1
                  mx-1
                  pl-2
                  focus:ring-0
                "
              >
                <option
                  value="0"
                  class="
                    bg-[#fffff]
                    dark:bg-[#1E1E1E] dark:text-white
                    text-gray-900
                  "
                >
                  All
                </option>
                <option
                  value="10"
                  class="
                    bg-[#fffff]
                    dark:bg-[#1E1E1E] dark:text-white
                    text-gray-900
                  "
                >
                  10
                </option>
                <option
                  value="20"
                  class="
                    bg-[#fffff]
                    dark:bg-[#1E1E1E] dark:text-white
                    text-gray-900
                  "
                >
                  20
                </option>
                <option
                  value="100"
                  class="
                    bg-[#fffff]
                    dark:bg-[#1E1E1E] dark:text-white
                    text-gray-900
                  "
                >
                  100
                </option>
              </select>
            </div>
            <span class="mx-1 dark:text-white text-gray-800">
              {{
                `${stats.startIndex + 1}-${stats.endIndex + 1} of ${
                  stats.totalItems
                }`
              }}
            </span>
            <div class="flex flex-row items-center shadow-lg">
              <button
                :class="[
                  'btn p-1 focus:outline-none dark:text-white text-gray-800 rounded-l border-0 border-r border-gray-400',
                  stats.startPage == stats.currentPage
                    ? 'dark:bg-[#3D3D3D] bg-[#E5E5E5] cursor-default'
                    : 'dark:bg-[#363636] bg-[#F5F5F5] dark:hover:bg-[#3D3D3D] hover:bg-[#E5E5E5]',
                ]"
                :disabled="stats.startPage == stats.currentPage"
                @click="prevPage"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  role="img"
                  fill="currentColor"
                  class="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
                  ></path>
                </svg>
              </button>
              <li class="flex">
                <ul
                  v-for="page in stats.pagesWithDots"
                  :class="[
                    'py-1 px-2 dark:text-white text-gray-800 border-0 border-l border-gray-400 first:border-l-0',
                    stats.currentPage == page
                      ? 'dark:bg-[#3D3D3D] bg-[#E5E5E5] cursor-default'
                      : 'dark:bg-[#363636] bg-[#F5F5F5] dark:hover:bg-[#3D3D3D] hover:bg-[#E5E5E5] cursor-pointer',
                  ]"
                  @click="goTo(page)"
                >
                  <span class="h-2 w-2">{{ page }}</span>
                </ul>
              </li>
              <button
                :class="[
                  'btn p-1 focus:outline-none dark:text-white text-gray-800 rounded-r border-0 border-l border-gray-400',
                  stats.endPage == stats.currentPage
                    ? 'dark:bg-[#3D3D3D] bg-[#E5E5E5] cursor-default'
                    : 'dark:bg-[#363636] bg-[#F5F5F5] dark:hover:bg-[#3D3D3D] hover:bg-[#E5E5E5]',
                ]"
                :disabled="stats.endPage == stats.currentPage"
                @click="nextPage"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  role="img"
                  fill="currentColor"
                  class="h-6 w-6"
                  aria-hidden="true"
                >
                  <path
                    d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";

import { paginate } from "@/util";

export default {
  name: "DataTable",
  props: {
    headers: {
      type: Array,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    footer: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: String,
      default: "asc",
    },
    dense: {
      type: Boolean,
      default: false,
    },
    numbers: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const data = ref(props.items);
    const currentSort = ref(props.headers[0].value);
    const currentSortDir = ref(props.sortOrder);
    const pageSize = ref(10);
    const currentPage = ref(1);
    const stats = computed(() =>
      paginate(data.value.length, currentPage.value, pageSize.value)
    );

    const sortedData = computed(() =>
      pageSize.value == 0
        ? data.value.sort((a, b) => {
            let modifier = 1;
            if (currentSortDir.value === "desc") modifier = -1;
            if (a[currentSort.value] < b[currentSort.value])
              return -1 * modifier;
            if (a[currentSort.value] > b[currentSort.value])
              return 1 * modifier;
            return 0;
          })
        : data.value
            .sort((a, b) => {
              let modifier = 1;
              if (currentSortDir.value === "desc") modifier = -1;
              if (a[currentSort.value] < b[currentSort.value])
                return -1 * modifier;
              if (a[currentSort.value] > b[currentSort.value])
                return 1 * modifier;
              return 0;
            })
            .filter((row, index) => {
              let start = (currentPage.value - 1) * pageSize.value;
              let end = currentPage.value * pageSize.value;
              if (index >= start && index < end) return true;
            })
    );

    const sort = (s) => {
      if (s === currentSort.value) {
        currentSortDir.value = currentSortDir.value === "asc" ? "desc" : "asc";
      }
      currentSort.value = s;
    };
    const nextPage = () => {
      if (currentPage.value * pageSize.value < data.value.length)
        currentPage.value++;
    };
    const prevPage = () => {
      if (currentPage.value > 1) currentPage.value--;
    };
    const goTo = (page) => {
      if (page == "...") return;
      if (Number(page) === currentPage.value) return;
      currentPage.value = Number(page);
    };
    return {
      sort,
      stats,
      currentSort,
      currentSortDir,
      sortedData: props.footer === true ? sortedData : data,
      pageSize,
      nextPage,
      prevPage,
      goTo,
    };
  },
};
</script>
