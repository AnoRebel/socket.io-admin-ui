import mitt from "mitt";
import { findIndex } from "lodash-es";

export const emitter = mitt();

const testLocalStorage = () => {
  const test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

export const isLocalStorageAvailable = testLocalStorage();

export function formatDuration(duration) {
  const d = Math.ceil(Math.max(duration, 0));
  const days = Math.floor(d / 86400);
  const hours = Math.floor((d - days * 86400) / 3600);
  const minutes = Math.floor((d - days * 86400 - hours * 3600) / 60);
  const seconds = Math.ceil(d) - days * 86400 - hours * 3600 - minutes * 60;

  const output = [];
  if (days > 0) {
    output.push(days + "d");
  }
  if (days > 0 || hours > 0) {
    output.push(hours + "h");
  }
  if (days > 0 || hours > 0 || minutes > 0) {
    output.push(minutes + "m");
  }
  output.push(seconds + "s");
  return output.join(" ");
}

/**
 * lodash remove() does not play well with Vue.js
 */
export function remove(array, predicate) {
  const index =
    typeof predicate === "object"
      ? findIndex(array, predicate)
      : array.indexOf(predicate);
  return index === -1 ? [] : array.splice(index, 1);
}

export function pushUniq(array, elem) {
  if (!array.includes(elem)) {
    array.push(elem);
  }
}

export function percentage(value, total) {
  return total === 0 ? 0 : ((value / total) * 100).toFixed(1);
}

const getRange = (start, end) =>
  Array(end - start + 1)
    .fill()
    .map((v, i) => i + start);

const pagination = (currentPage, pageCount) => {
  let delta;
  if (pageCount <= 7) {
    // delta === 7: [1 2 3 4 5 6 7]
    delta = 7;
  } else {
    // delta === 2: [1 ... 4 5 6 ... 10]
    // delta === 4: [1 2 3 4 5 ... 10]
    delta = currentPage > 4 && currentPage < pageCount - 3 ? 2 : 4;
  }

  const range = {
    start: Math.round(currentPage - delta / 2),
    end: Math.round(currentPage + delta / 2),
  };

  if (range.start - 1 === 1 || range.end + 1 === pageCount) {
    range.start += 1;
    range.end += 1;
  }

  let pages =
    currentPage > delta
      ? getRange(
          Math.min(range.start, pageCount - delta),
          Math.min(range.end, pageCount)
        )
      : getRange(1, Math.min(pageCount, delta + 1));

  const withDots = (value, pair) =>
    pages.length + 1 !== pageCount ? pair : [value];

  if (pages[0] !== 1) pages = withDots(1, [1, "..."]).concat(pages);

  if (pages[pages.length - 1] < pageCount)
    pages = pages.concat(withDots(pageCount, ["...", pageCount]));

  return pages;
};

export const paginate = (
  totalItems,
  currentPage = 1,
  pageSize = 20,
  maxPages = 10
) => {
  // To return all if needed
  if (pageSize == 0) pageSize = totalItems;
  // calculate total pages
  let totalPages = Math.ceil(totalItems / pageSize);

  // ensure current page isn't out of range
  if (currentPage < 1) {
    currentPage = 1;
  } else if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  let startPage, endPage;
  if (totalPages <= maxPages) {
    // total pages less than max so show all pages
    startPage = 1;
    endPage = totalPages;
  } else {
    // total pages more than max so calculate start and end pages
    let maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
    let maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
    if (currentPage <= maxPagesBeforeCurrentPage) {
      // current page near the start
      startPage = 1;
      endPage = maxPages;
    } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
      // current page near the end
      startPage = totalPages - maxPages + 1;
      endPage = totalPages;
    } else {
      // current page somewhere in the middle
      startPage = currentPage - maxPagesBeforeCurrentPage;
      endPage = currentPage + maxPagesAfterCurrentPage;
    }
  }

  // calculate start and end item indexes
  let startIndex = (currentPage - 1) * pageSize;
  let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

  // create an array of pages to loop in the pager control
  let pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
    (i) => startPage + i
  );

  // return object with all pager properties required by the view
  return {
    totalItems: totalItems,
    currentPage: currentPage,
    pageSize: pageSize,
    totalPages: totalPages,
    startPage: startPage,
    endPage: endPage,
    startIndex: startIndex,
    endIndex: endIndex,
    pages: pages,
    pagesWithDots: pagination(currentPage, totalPages),
  };
};