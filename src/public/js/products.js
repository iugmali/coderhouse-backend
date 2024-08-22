const searchForm = document.getElementById('search-form');
const cartButtons = document.getElementsByClassName('cart-button');

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const params = new URLSearchParams(window.location.search);
  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value.trim();
  if (searchValue) {
    params.set('query', searchValue);
    window.location.href = `/products?${params.toString()}`;
  }
});

Array.from(cartButtons).forEach(function(cartButton) {
  cartButton.addEventListener('click', async (event) => {
    event.preventDefault();
    cartButton.disabled = true;
    const cartId = cartButton.dataset.cart;
    const productId = cartButton.dataset.product;
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {method: 'POST'});
    if (response.ok) {
      window.location.href = '/cart';
    }
  });
});
