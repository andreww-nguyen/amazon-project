import {cart, removeFromCart, calculateCartQuantity, 
  updateItemQuantity, updateDeliveryOption} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import {deliveryOptions} from '../data/deliveryOptions.js'
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

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

  // get the
  const deliveryOptionId = cartItem.deliveryOptionId;
  let deliveryOption;
  deliveryOptions.forEach((option) =>
  {
    if (option.id === deliveryOptionId)
    {
      deliveryOption = option;
    }
  });

  const today = dayjs();
  const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
  const dateString = deliveryDate.format('dddd, MMMM D');


  // generate the HTML for the cart summary
  cartSummaryHTML += 
  `
    <div class="js-cart-item-container-${matchingProduct.id} 
    cart-item-container">
      <div class="delivery-date">
        Delivery date: ${dateString}
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

            <input class="js-quantity-input js-quantity-input-${matchingProduct.id} quantity-input"
            data-product-id="${matchingProduct.id}" 
            type="number" value="${Number(cartItem.quantity)}">

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
          ${deliveryOptionsHTML(cartItem, matchingProduct)}
        </div>
      </div>
    </div>
  `;
});

function deliveryOptionsHTML(cartItem, matchingProduct)
{
  let html = '';
  deliveryOptions.forEach((deliveryOption) =>
  {
    // get today's date and apply the specified number of days and format
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOption.priceCents === 0 ? 'FREE' 
      : `${formatCurrency(deliveryOption.priceCents)} - `;

    // determine what delivery option the user selected
    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += 
     `
      <div class="js-delivery-option delivery-option"
      data-product-id="${matchingProduct.id}"
      data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `;
  })
  return html;
}

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

// event listener for radio buttons (delivery dates)
document.querySelectorAll('.js-delivery-option').forEach((element) =>
{
  element.addEventListener('click', () =>
  {
    // get the productId and deliveryOptionId from the data attributes
    const { productId, deliveryOptionId } = element.dataset;

    // update the delivery option of the item
    updateDeliveryOption(productId, deliveryOptionId);

    console.log(`${productId}, ${deliveryOptionId}`);
  });
});

// event listener for the 'delete' button for each item
document.querySelectorAll('.js-delete-link').forEach((link) =>
{
  link.addEventListener('click', () =>
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
    // get the quantity the user specified from the input element
    const newQuantity = document.querySelector(`.js-quantity-input-${productId}`).value;
    // handle the input
    const isValid = handleInput(productId, newQuantity);

    // only remove the 'is-editing-quantity' class if the user entered a valid quantity
    if (isValid)
      document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');
  });
});

// eventListener for the 'keydown'
document.querySelectorAll('.js-quantity-input').forEach((input) =>
{
  input.addEventListener('keydown', (event) =>
  {
    if (event.key === 'Enter')
    {
      const productId = input.dataset.productId;

      // get the quantity of the item
      const newQuantity = input.value;
  
      // handle the input
      const isValid = handleInput(productId, newQuantity);
      
      // only remove the 'is-editing-quantity' class if the user entered a valid quantity
      if (isValid)
        document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');
    }
  })
});

/**
 * 
 * @param {string} productId the ID associated with the item
 * @param {string} userInput the value that was inside the input element
 * @returns true or false depending on the user's input. True for a 
 * valid input and false for invalid input
 * 
 */
function handleInput(productId, userInput)
{
  // validate invalid keys
  if (isNaN(Number(userInput)))
  {
    // return false if the user entered an invalid number
    alert(`ERROR: '${userInput}' is not a valid number`);
    return false;
  }
  else
  {
    // convert userInput into a number
    const newQuantity = Math.floor(Number(userInput));

    // validate invalid numbers
    if (newQuantity < 0 || newQuantity > 30)
    {
      alert(`ERROR: Cannot update quantity to: '${newQuantity}'`);
      return false;
    }
    else
    {
      // handle where no input or '0'
      if (newQuantity === 0)
      {
        // remove the item from the cart
        removeFromCart(productId);
        document.querySelector(`.js-cart-item-container-${productId}`).remove();
      }
      else
      {
        // update the quantity of the item
        updateItemQuantity(productId, newQuantity);
        document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity; // label in the container 
      }
      updateCartQuantityLabel(); // label in the header 
      return true;
    }
  }
}

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
