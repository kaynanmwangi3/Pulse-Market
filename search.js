// Mobile Filter Toggle - Add to DOMContentLoaded event
document.querySelector('.mobile-filter-toggle')?.addEventListener('click', () => {
  document.querySelector('.filters').classList.toggle('active');
});

// Close filters when clicking outside (add this too)
document.addEventListener('click', (e) => {
  const filters = document.querySelector('.filters');
  if (!filters.contains(e.target) && 
      !e.target.closest('.mobile-filter-toggle')) {
    filters.classList.remove('active');
  }
});