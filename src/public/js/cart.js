const removeButtons = document.getElementsByClassName('remove-button');

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
