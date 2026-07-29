
let productsHTML = '';
// loop through the array to get the product information
products.forEach((product) =>
{
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="images/ratings/rating-${product.rating.stars * 10}.png">

        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        $${(product.priceCents / 100).toFixed(2)}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      <div class="product-spacer"></div>

      <div class="added-to-cart">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="js-add-to-cart add-to-cart-button button-primary"
      data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>`;
});
document.querySelector('.js-products-grid').innerHTML = productsHTML;

// eventListener for the 'add to cart' buttons
document.querySelectorAll('.js-add-to-cart').forEach((button) =>
{
  button.addEventListener('click', () =>
  {
    // get the productID
    const productId = button.dataset.productId;

    // get the number of items to add to the cart
    const productQuantity = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);

    // check if the product already exists in the cart
    let matchingItem;
    cart.forEach((item) =>
    {
      // check 
      if (productId === item.productId)
        matchingItem = item;
    });

    // increment the quantity of the item that is already in the cart
    if (matchingItem)
      matchingItem.quantity += productQuantity;

    // add the new product to the cart
    else
    {
      cart.push
      (
        {
          productId: productId,
          quantity: productQuantity
        }
      );
    }

    // calculate the number of items in the cart
    let cartQuantity = 0;
    cart.forEach(item => cartQuantity += item.quantity);
    document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  })
});