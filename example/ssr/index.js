"use strict";
(() => {
  // example/ssr/index.ts
  var progress = 0;
  var indicator = document.querySelector("progress-indicator");
  setInterval(() => {
    progress += 10;
    indicator.setAttribute("progress", "" + progress);
    if (progress === 100) {
      setTimeout(() => progress = 0, 3e3);
    }
  }, 1e3);
})();
