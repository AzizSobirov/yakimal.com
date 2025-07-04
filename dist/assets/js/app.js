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

    window.addEventListener("scroll", () => {
      header.classList.toggle("sticky", window.scrollY > 0);
    });

    const tabsEl = header.querySelector(".mobile__menu-tabs");
    const tabs = tabsEl.querySelectorAll("[data-toggle]");
    const tabsBody = header.querySelector(".mobile__menu-content");
    const tabsContent = header.querySelector("#menu-content");
    const tabsContentClose = header.querySelector(".mobile__menu-close");
    const tabsContacts = tabsEl.querySelector(".mobile__menu-contacts");

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const isActive = tab.classList.contains("active");
        tabs.forEach((tab) => tab.classList.remove("active"));
        tabsContacts.style.maxHeight = 0;

        if (isActive) {
          tabsBody.classList.remove("show");

          // Wait for the animation to finish before setting display to 'none'
          tabsBody.addEventListener("transitionend", function handler(event) {
            if (
              event.propertyName === "transform" &&
              !tabsBody.classList.contains("show")
            ) {
              tabsBody.style.display = "none";
              tabsBody.removeEventListener("transitionend", handler);
            }
          });
        }

        // If tab was not already active, show the content
        if (!isActive) {
          tab.classList.add("active");

          if (tab.dataset.toggle != "contacts") {
            tabsBody.style.display = "flex";

            requestAnimationFrame(() => {
              tabsBody.classList.add("show");
            });
          } else {
            tabsContacts.style.maxHeight = tabsContacts.scrollHeight + "px";
            tabsBody.classList.remove("show");

            // Wait for the animation to finish before setting display to 'none'
            tabsBody.addEventListener("transitionend", function handler(event) {
              if (
                event.propertyName === "transform" &&
                !tabsBody.classList.contains("show")
              ) {
                tabsBody.style.display = "none";
                tabsBody.removeEventListener("transitionend", handler);
              }
            });
          }
        }
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

  // Recipes
  const recipes = document.querySelector(".recipes");
  if (recipes) {
    const filterItems = recipes.querySelectorAll(".recipes__filter-item");
    const recipesList = recipes.querySelector(".recipes__list");

    // Helper function to animate recipe visibility
    function animateRecipe(recipe, show) {
      if (show) {
        recipe.style.display = "flex";
        recipe.style.opacity = "0";
        recipe.style.transform = "scale(0.8) translateY(20px)";

        requestAnimationFrame(() => {
          recipe.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
          recipe.style.opacity = "1";
          recipe.style.transform = "scale(1) translateY(0)";
        });
      } else {
        recipe.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
        recipe.style.opacity = "0";
        recipe.style.transform = "scale(0.8) translateY(20px)";

        setTimeout(() => {
          recipe.style.display = "none";
        }, 400); // Match transition duration
      }
    }

    filterItems.forEach((item) => {
      item.addEventListener("click", () => {
        filterItems.forEach((el) => el.classList.remove("active"));
        item.classList.add("active");

        const title = item.dataset.title;
        const recipes = recipesList.querySelectorAll(".recipe");

        // First hide all non-matching recipes
        recipes.forEach((recipe) => {
          if (recipe.dataset.title.toLowerCase() !== title.toLowerCase()) {
            animateRecipe(recipe, false);
          }
        });

        // Then show matching recipes with staggered delay
        setTimeout(() => {
          let delay = 0;
          recipes.forEach((recipe) => {
            if (recipe.dataset.title.toLowerCase() === title.toLowerCase()) {
              setTimeout(() => {
                animateRecipe(recipe, true);
              }, delay);
              delay += 50; // 50ms stagger between each recipe
            }
          });
        }, 200); // Wait for hide animations to start
      });
    });

    window.addEventListener("load", () => {
      const activeFilter = recipes.querySelector(
        ".recipes__filter-item.active"
      );
      if (activeFilter) {
        const title = activeFilter.dataset.title;
        const recipes = recipesList.querySelectorAll(".recipe");

        // Initialize all recipes as hidden
        recipes.forEach((recipe) => {
          recipe.style.opacity = "0";
          recipe.style.transform = "scale(0.8) translateY(20px)";
          recipe.style.display = "none";
        });

        // Show matching recipes with animation
        setTimeout(() => {
          let delay = 0;
          recipes.forEach((recipe) => {
            if (recipe.dataset.title.toLowerCase() === title.toLowerCase()) {
              setTimeout(() => {
                animateRecipe(recipe, true);
              }, delay);
              delay += 50;
            }
          });
        }, 100);
      }
    });
  }

  // Timeline
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    // Timeline progress animation based on middle of page
    function updateTimelineProgress() {
      const timelineProgress = document.querySelector(".timeline-progress");
      const timelineItems = document.querySelectorAll(".timeline-item");
      const windowHeight = window.innerHeight;
      const middleLine = windowHeight / 2 + 100;
      const timelineRect = timeline.getBoundingClientRect();

      let lastActiveItemIndex = -1;

      // Remove active class from all items first
      timelineItems.forEach((item) => {
        item.classList.remove("active");
      });

      // Find which items have passed the middle line and activate all of them
      timelineItems.forEach((item, index) => {
        const itemRect = item.getBoundingClientRect();
        const itemCenter = itemRect.top + itemRect.height / 2 - 100;

        if (itemCenter <= middleLine) {
          // Item has passed the middle line - activate it
          item.classList.add("active");
          lastActiveItemIndex = index;
        }
      });

      // Calculate progress line height
      let progressHeight = 0;

      // Check if section bottom is 15% visible
      const sectionBottomVisible = timelineRect.bottom <= windowHeight * 0.6;

      if (sectionBottomVisible) {
        // Section bottom is 15% visible, make progress 100%
        progressHeight = 100;
      } else if (lastActiveItemIndex >= 0) {
        const lastActiveItem = timelineItems[lastActiveItemIndex];
        const lastActiveRect = lastActiveItem.getBoundingClientRect();

        // If the last active item is completely above the middle line
        if (lastActiveRect.bottom <= middleLine) {
          // Progress should reach to the bottom of this item
          progressHeight =
            ((lastActiveRect.bottom - timelineRect.top) / timelineRect.height) *
            100;
        } else {
          // Progress should reach to the middle line
          progressHeight =
            ((middleLine - timelineRect.top) / timelineRect.height) * 100;
        }

        // Ensure progress doesn't exceed 100% or go below 0%
        progressHeight = Math.min(100, Math.max(0, progressHeight));
      }

      timelineProgress.style.height = `${progressHeight}%`;
    }

    // Initialize
    window.addEventListener("scroll", updateTimelineProgress);

    // Initial call
    updateTimelineProgress();
  }

  // Geography
  const geography = document.querySelector(".geography");
  if (geography) {
    const citiesList = document.querySelector(".geography__cities-list");
    if (!citiesList) return;
    
    let translateY = 0;
    const scrollSpeed = 0.3; // pixels per frame - slower for smoother effect
    
    function smoothScroll() {
      translateY += scrollSpeed;
      
      // Get the height of one city including gap
      const cityHeight = citiesList.children[0].offsetHeight + 5; // 5px gap from CSS
      const totalCities = citiesList.children.length;
      const halfCities = totalCities / 2;
      const halfHeight = cityHeight * halfCities;
      
      // When we reach the halfway point, reset to beginning
      if (translateY >= halfHeight) {
        translateY = 0;
      }
      
      citiesList.style.transform = `translateY(-${translateY}px)`;
      requestAnimationFrame(smoothScroll);
    }
    
    // Start the smooth scrolling
    requestAnimationFrame(smoothScroll);
  }

  // Horeca Club QR Code
  const horecaClub = document.querySelector(".horeca-club");
  if (horecaClub) {
    const closeButton = horecaClub.querySelector("button");

    // Проверяем, скрыт ли элемент (проверяем localStorage)
    const hiddenUntil = localStorage.getItem("horeca-club");
    if (hiddenUntil && new Date().getTime() < parseInt(hiddenUntil)) {
      horecaClub.style.display = "none";
    } else {
      // Показываем элемент, если время истекло
      horecaClub.style.display = "flex";
    }

    // Обработчик клика на кнопку закрытия
    closeButton.addEventListener("click", function () {
      // Скрываем элемент
      horecaClub.style.display = "none";

      // Сохраняем время скрытия на 24 часа
      const hideUntil = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 часа в миллисекундах
      localStorage.setItem("horeca-club", hideUntil.toString());
    });
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

  let stagesSwiper = new Swiper(".stages__list .swiper", {
    slidesPerView: "auto",
    spaceBetween: 15,
    breakpoints: {
      640: {
        spaceBetween: 20,
      },
      1280: {
        slidesPerView: 5,
        spaceBetween: 20,
      },
      1680: {
        slidesPerView: 5,
        spaceBetween: 25,
      },
    },
  });

  let recipeSwiper = new Swiper(".recipe__images .swiper", {
    slidesPerView: 1,
    spaceBetween: 10,
    pagination: {
      el: ".recipe__images .swiper-pagination",
      clickable: true,
    },
  });

  const yaMap = document.querySelector("#yamap");
  if (yaMap) {
    ymaps.ready(function () {
      const data = {
        center: [55.884339, 37.500708],
        marker: [55.884339, 37.500708],
        icon: "/assets/img/icons/marker.svg",
        city: "г. Санкт-Петербург",
        street:
          'ХЛАДОКОМБИНАТ №15 "ИКМА"\nГ. МОСКВА, УЛИЦА ИЖОРСКАЯ, Д. 3, СТР. 2',
      };

      var myMap = new ymaps.Map(
          "yamap",
          {
            center: data.center,
            zoom: 15,
            controls: [],
            behaviors: [
              "drag",
              "dblClickZoom",
              "rightMouseButtonMagnifier",
              "multiTouch",
            ],
          },
          {
            suppressMapOpenBlock: true,
          }
        ),
        MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
          '<div style="color: #000; font-weight: bold;">$[properties.iconContent]</div>'
        ),
        myPlacemark0 = new ymaps.Placemark(
          data.marker,
          {
            balloonContentHeader: `<b style='color:#000;'>${data.city}</b>`,
            balloonContentFooter: data.street,
          },
          {
            iconLayout: "default#image",
            iconImageHref: data.icon,
            iconImageSize: [40, 50],
            iconImageOffset: [-20 / 2, -20],
          }
        );
      myMap.geoObjects.add(myPlacemark0);
      var zoomControl = new ymaps.control.ZoomControl({
        options: {
          size: "small",
          position: {
            top: 15,
            left: "auto",
            right: 15,
          },
        },
      });
      myMap.controls.add(zoomControl);
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
