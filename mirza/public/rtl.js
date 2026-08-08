/* Chainlit creates some dialogs and popovers later inside portals. */
(() => {
  const selectors = [
    "#root",
    "#app",
    "[role='dialog']",
    "[role='menu']",
    "[role='listbox']",
    "[role='tooltip']",
    "[data-radix-popper-content-wrapper]",
    "[data-sonner-toaster]",
  ].join(",");

  const applyRtl = () => {
    document.documentElement.lang = "fa";
    document.documentElement.dir = "rtl";
    if (document.body) document.body.dir = "rtl";
    document.querySelectorAll(selectors).forEach((element) => {
      element.setAttribute("dir", "rtl");
      element.setAttribute("lang", "fa");
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyRtl, { once: true });
  } else {
    applyRtl();
  }

  new MutationObserver(applyRtl).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
