const searchForm = document.getElementById('search-form');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  console.log(window.location.search)
  const params = new URLSearchParams(window.location.search);
  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value.trim();
  if (searchValue) {
    params.set('query', searchValue);
    window.location.href = `/products?${params.toString()}`;
  }
});
