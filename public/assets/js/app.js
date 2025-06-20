document.addEventListener("DOMContentLoaded", () => {
  // modal
  const modal = {
    el: document.querySelector(".modal-overlay"),
    activeModal: null,

    init() {
      this.setupTriggers();
      this.setupOutsideClick();
    },

    setupTriggers() {
      const triggers = document.querySelectorAll("[data-modal]");
      triggers.forEach((trigger) => {
        trigger.addEventListener("click", () => {
          const modalName = trigger.dataset.modal;
          if (modalName === "close") {
            this.close();
          } else {
            this.open(modalName);
          }
        });
      });
    },

    setupOutsideClick() {
      this.el.addEventListener("click", (event) => {
        if (event.target === this.el) {
          this.close();
        }
      });
    },

    open(name) {
      const targetModal = this.el.querySelector(`[data-template="${name}"]`);

      if (targetModal) {
        this.close(true); // Close any currently active modal
        this.activeModal = targetModal;

        this.el.style.display = "flex"; // Show the overlay
        requestAnimationFrame(() => {
          this.el.classList.add("show"); // Animate overlay
          this.activeModal.style.display = "flex"; // Show modal content

          // Add animation class to modal content
          requestAnimationFrame(() => {
            this.activeModal.classList.add("show");
          });
        });
      } else {
        console.error(`Modal with name "${name}" not found.`);
      }
    },

    close(onlyModal = false) {
      if (onlyModal) {
        if (this.activeModal) {
          this.activeModal.style.display = "none"; // Fully hide modal content
          this.activeModal.classList.remove("show"); // Hide modal content
        }
      } else {
        if (this.activeModal) {
          this.activeModal.classList.remove("show"); // Hide modal content
          const modalToHide = this.activeModal; // Preserve reference for timeout
          this.activeModal = null;

          setTimeout(() => {
            modalToHide.style.display = "none"; // Fully hide after animation
          }, 250); // Match the CSS animation duration
        }

        this.el.classList.remove("show"); // Animate overlay
        this.el.addEventListener(
          "transitionend",
          () => {
            if (!this.el.classList.contains("show")) {
              this.el.style.display = "none"; // Fully hide overlay
            }
          },
          { once: true }
        );
      }
    },
  };
  modal.init();

  // header
  const header = document.querySelector(".header");
  if (header) {
    const menu = header.querySelector(".header__menu");
    const services = header.querySelectorAll(".menu-item-has-children");
    const contacts = header.querySelector(".header__contacts");
    let lastScrollY = window.scrollY;

    window.addEventListener("scroll", () => {
      header.classList.toggle("sticky", window.scrollY > 0);
    });

    const tabs = header.querySelectorAll("#tab");
    const tabLinks = header.querySelectorAll("#tab-link");
    const tabsBody = header.querySelector(".mobile__menu-content");
    const tabsContent = tabsBody.querySelector("#content");
    const tabsContentClose = tabsBody.querySelector("#close");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const isActive = tab.classList.contains("active");
        tabs.forEach((tab) => tab.classList.remove("active"));

        if (isActive) {
          tabsBody.classList.remove("show");

          // Wait for the animation to finish before setting display to 'none'
          tabsBody.addEventListener("transitionend", function handler(event) {
            if (
              event.propertyName === "transform" &&
              !tabsBody.classList.contains("show")
            ) {
              tabsBody.style.display = "none";
              tabsContent.innerHTML = "";
              tabsBody.removeEventListener("transitionend", handler);
            }
          });
        }

        // If tab was not already active, show the content
        if (!isActive) {
          tab.classList.add("active");
          tabsBody.style.display = "flex";

          requestAnimationFrame(() => {
            tabsBody.classList.add("show");
          });

          if (tab.dataset.toggle == "menu") {
            tabsContent.innerHTML = menu.innerHTML + contacts.outerHTML;
          } else {
            tabsContent.innerHTML = servicesSubMenu.outerHTML;
          }
        }
      });
    });

    tabLinks.forEach((link) => {
      link.addEventListener("click", () => {
        tabs.forEach((tab) => {
          tab.classList.remove("active");
        });

        // Add animation for hiding
        tabsBody.classList.remove("show");
        tabsBody.addEventListener("transitionend", function handler(event) {
          if (
            event.propertyName === "transform" &&
            !tabsBody.classList.contains("show")
          ) {
            tabsBody.style.display = "none";
            tabsContent.innerHTML = "";
            tabsBody.removeEventListener("transitionend", handler);
          }
        });
      });
    });

    tabsContentClose.addEventListener("click", () => {
      // Add animation for hiding
      tabsBody.classList.remove("show");
      tabsBody.addEventListener("transitionend", function handler(event) {
        if (
          event.propertyName === "transform" &&
          !tabsBody.classList.contains("show")
        ) {
          tabsBody.style.display = "none";
          tabsContent.innerHTML = "";
          tabsBody.removeEventListener("transitionend", handler);
        }
      });

      tabs.forEach((tab) => {
        tab.classList.remove("active");
      });
    });
  }

  // Marquee
  const marquee = document.querySelector(".marquee");
  if (marquee) {
    const track = marquee.querySelector(".marquee-track");

    marquee.addEventListener("mouseenter", () => {
      track.style.animationPlayState = "paused";
    });

    marquee.addEventListener("mouseleave", () => {
      track.style.animationPlayState = "running";
    });

    // Optional: Adjust speed based on screen size
    const updateSpeed = () => {
      if (track) {
        const width = window.innerWidth;
        let duration = 30; // Default duration in seconds

        if (width < 768) {
          duration = 20; // Faster on mobile
        } else if (width > 1440) {
          duration = 40; // Slower on large screens
        }

        track.style.animationDuration = `${duration}s`;
      }
    };

    updateSpeed();
    window.addEventListener("resize", updateSpeed);
  }

  // Footer
  const currentYear = document.getElementById("current-year");
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Initialize the fancybox
  const fancyboxTriggers = Array.from(
    document.querySelectorAll("[data-fancybox]")
  ).filter((trigger) => trigger.dataset.fancybox);
  if (fancyboxTriggers) {
    const fancyboxInstances = [];
    fancyboxTriggers.forEach((trigger) => {
      const name = trigger.dataset.fancybox;
      if (fancyboxInstances.includes(name)) {
        return; // Skip if already bound
      }
      // Add the name to the `fancyboxInstances` list
      fancyboxInstances.push(name);
    });
    fancyboxInstances.forEach((name) => {
      Fancybox.bind(`[data-fancybox="${name}"]`, {
        Images: { Panzoom: { maxScale: 3 } },
      });
    });
  }

  let ourProductsContentSwiper = new Swiper(".our-products__content-swiper", {
    slidesPerView: "auto",
    spaceBetween: 15,
    breakpoints: {
      640: {
        spaceBetween: 24,
      },
    },
  });

  let ourProductsSwiper = new Swiper(".our-products__swiper .swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    effect: "fade",
    navigation: {
      nextEl: ".our-products__swiper .btn-next",
      prevEl: ".our-products__swiper .btn-prev",
    },
    thumbs: {
      swiper: ourProductsContentSwiper,
    },
  });

  let productCardSwiper = new Swiper(".product-card__swiper .swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    effect: "fade",
    navigation: {
      nextEl: ".product-card__swiper .btn-next",
      prevEl: ".product-card__swiper .btn-prev",
    },
  });

  let newsSwiper = new Swiper(".news__swiper .swiper", {
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
      nextEl: ".news__swiper .swiper-button-next",
      prevEl: ".news__swiper .swiper-button-prev",
    },
    pagination: {
      el: ".news__swiper .swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      640: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      980: {
        slidesPerView: 3,
        spaceBetween: 25,
      },
      1280: {
        slidesPerView: 3,
        spaceBetween: 32,
      },
    },
  });

  let recipesSwiper = new Swiper(".product-recipes__list .swiper", {
    slidesPerView: 2,
    spaceBetween: 12,
    navigation: {
      nextEl: ".product-recipes__list .swiper-button-next",
      prevEl: ".product-recipes__list .swiper-button-prev",
    },
    breakpoints: {
      1025: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
    },
  });

  let postSwiper = new Swiper(".post__img .swiper", {
    slidesPerView: 1,
    spaceBetween: 15,
    navigation: {
      nextEl: ".post__img .swiper-button-next",
      prevEl: ".post__img .swiper-button-prev",
    },
  });

  let products = document.querySelectorAll(".products");
  if (products) {
    const swipers = document.querySelectorAll(".products__swiper");

    swipers.forEach((item, index) => {
      let swiper = item.querySelector(".swiper");
      let prevBtn = item.querySelector(".swiper-button-prev");
      let nextBtn = item.querySelector(".swiper-button-next");
      let scrollbar = item.querySelector(".swiper-scrollbar");

      new Swiper(swiper, {
        slidesPerView: 2,
        spaceBetween: 12,
        navigation: {
          nextEl: nextBtn,
          prevEl: prevBtn,
        },
        scrollbar: {
          el: scrollbar,
          draggable: true,
          hide: false,
        },
        breakpoints: {
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          980: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
          1680: {
            slidesPerView: 6,
            spaceBetween: 20,
          },
        },
      });
    });
  }

  // init phone mask
  const phoneMasks = document.querySelectorAll("input[name='phone']");
  phoneMasks.forEach((input) => {
    let keyCode;
    function mask(event) {
      event.keyCode && (keyCode = event.keyCode);
      let pos = this.selectionStart;
      if (pos < 3) event.preventDefault();
      let matrix = "+7 (___) ___-__-__",
        i = 0,
        def = matrix.replace(/\D/g, ""),
        val = this.value.replace(/\D/g, ""),
        newValue = matrix.replace(/[_\d]/g, function (a) {
          return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
        });
      i = newValue.indexOf("_");
      if (i != -1) {
        i < 5 && (i = 3);
        newValue = newValue.slice(0, i);
      }
      let reg = matrix
        .substr(0, this.value.length)
        .replace(/_+/g, function (a) {
          return "\\d{1," + a.length + "}";
        })
        .replace(/[+()]/g, "\\$&");
      reg = new RegExp("^" + reg + "$");
      if (
        !reg.test(this.value) ||
        this.value.length < 5 ||
        (keyCode > 47 && keyCode < 58)
      )
        this.value = newValue;
      if (event.type == "blur" && this.value.length < 5) this.value = "";

      if (this.value.length == 18 || this.value.length == 0) {
        input.dataset.numbervalid = "true";
      } else {
        input.dataset.numbervalid = "false";
      }
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false);
  });

  // form
  function successSend() {
    modal.open("success");

    setTimeout(() => {
      modal.close();
    }, 3000);
  }

  const forms = document.querySelectorAll(".the-form");
  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      successSend();
    });
  });
});
