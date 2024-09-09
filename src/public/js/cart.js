const removeButtons = document.getElementsByClassName('remove-button');
const purchaseButton = document.getElementById('checkout');

Array.from(removeButtons).forEach(function(removeButton) {
  removeButton.addEventListener('click', async (event) => {
    event.preventDefault();
    removeButton.disabled = true;
    const cartId = removeButton.dataset.cart;
    const productId = removeButton.dataset.product;
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {method: 'DELETE'});
    if (response.ok) {
      window.location.href = '/cart';
    }
  });
});

purchaseButton.addEventListener('click', async (event) => {
  event.preventDefault();
  purchaseButton.disabled = true;
  const cartId = purchaseButton.dataset.cart;
  const response = await fetch(`/api/carts/${cartId}/purchase`, {method: 'POST'});
  const data = await response.json();
  if (response.ok) {
    alert(JSON.stringify(data.payload.ticket));
    window.location.href = '/cart';
  }
});
