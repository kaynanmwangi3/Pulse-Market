document.addEventListener("DOMContentLoaded", function () {
  // Sample milestone data for PulseMarket
  const milestoneData = [
    {
      id: 1,
      title: "Founding PulseMarket",
      category: "founding",
      imageUrl: "https://plus.unsplash.com/premium_photo-1681487769650-a0c3fbaed85a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmluYW5jZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 2,
      title: "First Major Partnership",
      category: "growth",
      imageUrl: "https://plus.unsplash.com/premium_photo-1683141160659-4e14f3b2afa8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGJ1c2luZXNzJTIwcGFydG5lcnNoaXBzfGVufDB8fDB8fHww",
    },
    {
      id: 3,
      title: "Global Expansion",
      category: "growth",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: 4,
      title: "Community Impact",
      category: "impact",
      imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: 5,
      title: "Tech Innovation",
      category: "impact",
      imageUrl: "https://plus.unsplash.com/premium_photo-1661421687248-7bb863c60723?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVjaCUyMGlubm92YXRpb258ZW58MHx8MHx8fDA%3D",
    },
  ];

  const galleryGrid = document.querySelector(".gallery-grid");
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Function to render gallery items
  function renderGallery(items) {
    galleryGrid.innerHTML = "";
    items.forEach((item) => {
      const artItem = document.createElement("div");
      artItem.className = `art-item ${item.category}`;
      artItem.innerHTML = `
        <img src="${item.imageUrl}" alt="${item.title}">
        <div class="art-info">
          <h3>${item.title}</h3>
        </div>
      `;
      galleryGrid.appendChild(artItem);
    });
  }

  // Initial render
  renderGallery(milestoneData);

  // Filter functionality
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;
      if (filter === "all") {
        renderGallery(milestoneData);
      } else {
        const filteredItems = milestoneData.filter(
          (item) => item.category === filter
        );
        renderGallery(filteredItems);
      }
    });
  });

  // Testimonial Slider
  const testimonialSlides = document.querySelectorAll(".testimonial-slide");
  const sliderDots = document.querySelectorAll(".slider-dot");
  let currentSlide = 0;

  function showSlide(index) {
    testimonialSlides.forEach((slide) => slide.classList.remove("active"));
    sliderDots.forEach((dot) => dot.classList.remove("active"));

    testimonialSlides[index].classList.add("active");
    sliderDots[index].classList.add("active");
    currentSlide = index;
  }

  sliderDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      showSlide(parseInt(dot.dataset.slide));
    });
  });

  // Auto slide change
  setInterval(() => {
    currentSlide = (currentSlide + 1) % testimonialSlides.length;
    showSlide(currentSlide);
  }, 5000);

  // Scroll Animations
  const animateElements = document.querySelectorAll(
    ".section-title, .about-content, .testimonial-slider, .contact-form"
  );

  function checkScroll() {
    animateElements.forEach((element) => {
      const elementTop = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (elementTop < windowHeight - 100) {
        element.classList.add("animate");
      }
    });
  }

  // Initial check
  checkScroll();

  // Check on scroll
  window.addEventListener("scroll", checkScroll);

  // Contact Form Submission
  const contactForm = document.querySelector(".contact-form");
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you for your message! The PulseMarket team will get back to you soon.");
    this.reset();
  });
});