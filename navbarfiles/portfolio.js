// ===== GALLERY FILTERING =====
document.addEventListener("DOMContentLoaded", function () {
  // Sample art data (replace with your actual artwork)
  const artData = [
    {
      id: 1,
      title: "Digital Landscape",
      category: "digital",
      imageUrl:
        "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    },
    {
      id: 2,
      title: "Collaboration Project",
      category: "collab",
      imageUrl:
        "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1415&q=80",
    },
    {
      id: 3,
      title: "Personal Exploration",
      category: "personal",
      imageUrl:
        "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    },
    {
      id: 4,
      title: "Digital Portrait",
      category: "digital",
      imageUrl:
        "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1376&q=80",
    },
    {
      id: 5,
      title: "Brand Collaboration",
      category: "collab",
      imageUrl:
        "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80",
    },
    {
      id: 6,
      title: "Abstract Study",
      category: "personal",
      imageUrl:
        "https://images.unsplash.com/photo-1490750967868-88aa4486c946?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
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
  renderGallery(artData);

  // Filter functionality
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Filter items
      const filter = button.dataset.filter;
      if (filter === "all") {
        renderGallery(artData);
      } else {
        const filteredItems = artData.filter(
          (item) => item.category === filter
        );
        renderGallery(filteredItems);
      }
    });
  });

  // ===== TESTIMONIAL SLIDER =====
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

  // ===== SCROLL ANIMATIONS =====
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

  // ===== FORM SUBMISSION =====
  const contactForm = document.querySelector(".contact-form");
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    alert("Thank you for your message! I will get back to you soon.");
    this.reset();
  });
});
