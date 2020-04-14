import "@babel/polyfill";
import page from "page";
import hotkeys from "hotkeys-js";

import { getHiddenState, persistHiddenState } from "./lib/cookie";
import registerSW from "./lib/registerServiceWorker";
import { removeCanvas } from "./lib/util";

registerSW();

let currentPage;
let hidden = getHiddenState();
const inspirationElement = document.querySelector(".inspiration p");

async function fetchNextPage(pageName) {
  const { default: Page } = await import(
    `./pages/${pageName}.js`
    /* webpackPrefetch: true */
    /* webpackChunkName: "[request]" */
  );
  currentPage = new Page();
  const canvas = await currentPage.init();
  removeCanvas();
  setInspiration(currentPage.inspiration);
  document.body.appendChild(canvas);
  currentPage.start();
}

function stopPreviousPage(context, next) {
  if (
    currentPage &&
    currentPage.stop &&
    typeof currentPage.stop === "function"
  ) {
    currentPage.stop();
  }
  next();
}

function setActiveLinks(context, next) {
  const oldActive = document.querySelector(".navigation a.active");
  const newActive = document.querySelector(
    `.navigation a[href="${context.pathname}"]`
  );
  oldActive && oldActive.classList.remove("active");
  newActive && newActive.classList.add("active");
  next();
}

function setInspiration(inspiration) {
  let inspoHtml = "";
  if (inspiration) {
    const { url, title, source } = inspiration;
    inspoHtml = `inspired by: <a href="${url}" target="_blank">"${title}" &mdash; ${source}</a>`;
  }
  inspirationElement.innerHTML = inspoHtml;
}

function setTextHidden(_hidden) {
  const elements = document.querySelectorAll(".hideable");
  elements.forEach(function toggleClass(element) {
    if (_hidden) {
      element.classList.add("hide");
    } else {
      element.classList.remove("hide");
    }
  });
}

async function routeHandler(context, next) {
  const { route } = context.params;
  try {
    await fetchNextPage(route);
  } catch (e) {
    console.error(e);
    next();
  }
}

// middleware
page(setActiveLinks);
page(stopPreviousPage);

// routes
page("/", removeCanvas);
page("/:route", routeHandler);
// not found
page("/*", removeCanvas);

page.start();
setTextHidden(hidden);

hotkeys("h", function toggleText() {
  hidden = !hidden;
  persistHiddenState(hidden);
  setTextHidden(hidden);
});
