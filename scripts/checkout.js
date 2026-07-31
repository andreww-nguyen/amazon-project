import {cart, removeFromCart, calculateCartQuantity, updateItemQuantity} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

// update the number cart items in the header
updateCartQuantityLabel();

let cartSummaryHTML = '';
// loop through the cart and display the items on the checkout page
cart.forEach((cartItem) =>
{
  // search for a matching item using the productId
  const productId = cartItem.productId;

  // loop through each product in the products array to find a matchingID
  let matchingProduct;
  products.forEach((product) =>
  {
    if (product.id === productId)
      matchingProduct = product;
  });

  // generate the HTML for the cart summary
  cartSummaryHTML += 
  `
    <div class="js-cart-item-container-${matchingProduct.id} 
    cart-item-container">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: 
              <span class="js-quantity-label-${matchingProduct.id} quantity-label">
                ${cartItem.quantity}
              </span>
            </span>

            <span class="js-update-quantity-link update-quantity-link link-primary"
            data-product-id="${matchingProduct.id}">
              Update
            </span>

            <input class="js-quantity-input-${matchingProduct.id} quantity-input">

            <span class="js-save-quantity-link save-quantity-link link-primary"
            data-product-id="${matchingProduct.id}">
              Save
            </span>

            <span class="js-delete-link delete-quantity-link link-primary"
            data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

// event listener for the 'delete' button for each item
document.querySelectorAll('.js-delete-link').forEach((link) =>
{
  link.addEventListener('click',() =>
  {
    const productId = link.dataset.productId;
    // use the productId to remove the item from the cart
    removeFromCart(productId);

    // update the checkout page to reflect the changes
    updateCartQuantityLabel();

    // remove the item from the webpage visually
    document.querySelector(`.js-cart-item-container-${productId}`).remove();
  })
});

// eventListener for the 'update' button for each item
document.querySelectorAll('.js-update-quantity-link').forEach((link) =>
{
  link.addEventListener('click', () =>
  {
    // get the ID of the button
    const productId = link.dataset.productId;

    // get the container class, and add the is-editing-quantity class. This shows the 
    // input box and the 'save' link. This also hides the quantity-label and the 'update' link
    document.querySelector(`.js-cart-item-container-${productId}`).classList.add('is-editing-quantity');
  });
});

// eventListener for the 'save' button for each item
document.querySelectorAll('.js-save-quantity-link').forEach((link) =>
{
  // eventListener for click
  link.addEventListener('click', () =>
  {
    const productId = link.dataset.productId;
    // remove the is-editing-quantity class from the container. This will revert any changes
    // than happened when clicking on the 'update' link
    document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');

    // get the quantity the user specified from the input element
    const newQuantity = Number(document.querySelector(`.js-quantity-input-${productId}`).value);

    // validate user input
    if (newQuantity < 0 || newQuantity > 30)
      alert(`ERROR: Cannot update quantity to: ${newQuantity}`);
    else
    {
      // update the quantity of the item
      updateItemQuantity(productId, newQuantity);

      // update the quantity labels on the page
      updateCartQuantityLabel(); // label on the header
      document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity; // label in the container
      
      // handle where no input or '0'
      if (newQuantity === 0)
      {
        // remove the item from the cart
        removeFromCart(productId);

        // remove the item from the page visually
        document.querySelector(`.js-cart-item-container-${productId}`).remove();
      }
    }
  });
});


// if (document.querySelector(`.js-cart-item-container-${productId}`).classList.contains('is-editing-quantity'))
// {
//   document.addEventListener('keydown', (event) =>
//   {

//   })
// }

/**
 * updates the quantity label of the cart page's header
 */
function updateCartQuantityLabel()
{
  // get the number of items in the cart
  const cartQuantity = calculateCartQuantity();

  // update the number of cart items in the header
  if (cartQuantity === 1) // grammar rules
    document.querySelector('.js-return-link').innerHTML = `${cartQuantity} item`;
  else
    document.querySelector('.js-return-link').innerHTML = `${cartQuantity} items`;
}
