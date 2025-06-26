document.addEventListener("DOMContentLoaded", function () {
  const carouselInner = document.querySelector(".carousel-inner");
  const items = document.querySelectorAll(".carousel-item");
  const prevBtn = document.querySelector(".carousel-control.prev");
  const nextBtn = document.querySelector(".carousel-control.next");
  const indicators = document.querySelectorAll(".carousel-indicator");

  let currentIndex = 0;
  let intervalId;
  const slideInterval = 4000;

  // Initialize carousel
  function initCarousel() {
    updateCarousel();
    startAutoPlay();
  }

  // Update carousel position and active states
  function updateCarousel() {
    // Slide transition
    carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Update active class for items (for fade transition option)
    items.forEach((item, index) => {
      item.classList.toggle("active", index === currentIndex);
    });

    // Update active indicator
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentIndex);
    });
  }

  // Go to specific slide
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  // Next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarousel();
  }

  // Previous slide
  function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarousel();
  }

  // Start autoplay
  function startAutoPlay() {
    stopAutoPlay(); // Clear any existing interval
    intervalId = setInterval(nextSlide, slideInterval);
  }

  // Stop autoplay
  function stopAutoPlay() {
    if (intervalId) {
      clearInterval(intervalId);
    }
  }

  // Event listeners
  nextBtn.addEventListener("click", () => {
    stopAutoPlay();
    nextSlide();
    startAutoPlay();
  });

  prevBtn.addEventListener("click", () => {
    stopAutoPlay();
    prevSlide();
    startAutoPlay();
  });

  indicators.forEach((indicator) => {
    indicator.addEventListener("click", () => {
      stopAutoPlay();
      goToSlide(parseInt(indicator.getAttribute("data-index")));
      startAutoPlay();
    });
  });

  // Pause on hover
  const carousel = document.querySelector(".carousel");
  carousel.addEventListener("mouseenter", stopAutoPlay);
  carousel.addEventListener("mouseleave", startAutoPlay);

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      stopAutoPlay();
      nextSlide();
      startAutoPlay();
    } else if (e.key === "ArrowLeft") {
      stopAutoPlay();
      prevSlide();
      startAutoPlay();
    }
  });

  // Initialize
  initCarousel();

  // Responsive adjustment (optional)
  window.addEventListener("resize", updateCarousel);
});
