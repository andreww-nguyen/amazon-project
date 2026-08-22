import { cart } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import {deliveryOptions, getDeliveryOption, getDeliveryDay} from '../../data/deliveryOptions.js'
import {renderPaymentSummary} from './paymentSummary.js';
import {renderCheckoutHeader} from './checkoutHeader.js';

/**
 * renders the checkout page. Displays all the items in the cart and 
 * their information
 */
export function renderCheckoutSummary()
{
  let cartSummaryHTML = '';

  // display the view products button if there are no items in the cart
  if (cart.getCartQuantity() === 0)
  {
    cartSummaryHTML = 
    `
      <div class="js-empty-cart-container empty-cart-container">
        <p>Your cart is empty.</p>
        <a href="index.html">
          <button class="view-products-button button-primary">
            View Products
          </button>
        </a>
      </div>
    `;
  }
  
  // loop through the cart and display the items on the checkout page
  cart.getCartItems().forEach((cartItem) =>
  {
    // search for a matching item using the productId
    const productId = cartItem.getProductId();
    
    // find the matching item
    const matchingProduct = getProduct(productId);

    // get the delivery optionId
    const deliveryOptionId = cartItem.getDeliveryOptionId();
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    // get the delivery date
    const dateString = getDeliveryDay(deliveryOption);

    // generate the HTML for the cart summary
    cartSummaryHTML += 
    `
      <div class="js-cart-item-container js-cart-item-container-${matchingProduct.getId()} 
      cart-item-container">
        <div class="js-delivery-date-${matchingProduct.getId()} delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.getImage()}">

          <div class="cart-item-details">
            <div class="js-product-name-${matchingProduct.getId()} product-name">
              ${matchingProduct.getName()}
            </div>
            <div class="product-price">
              ${matchingProduct.getPrice()}
            </div>
            <div class="js-product-quantity-${matchingProduct.getId()} product-quantity">
              <span>
                Quantity: 
                <span class="js-quantity-label-${matchingProduct.getId()} quantity-label">
                  ${cartItem.getQuantity()}
                </span>
              </span>

              <span class="js-update-quantity-link update-quantity-link link-primary"
              data-product-id="${matchingProduct.getId()}">
                Update
              </span>

              <input class="js-quantity-input js-quantity-input-${matchingProduct.getId()} quantity-input"
              data-product-id="${matchingProduct.getId()}" 
              type="number" value="${Number(cartItem.getQuantity())}">

              <span class="js-save-quantity-link save-quantity-link link-primary"
              data-product-id="${matchingProduct.getId()}">
                Save
              </span>

              <span class="js-delete-link js-delete-link-${matchingProduct.getId()} 
              delete-quantity-link link-primary"
              data-product-id="${matchingProduct.getId()}">
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

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  // event listener for radio buttons (delivery dates)
  document.querySelectorAll('.js-delivery-option').forEach((element) =>
  {
    element.addEventListener('click', () =>
    {
      // get the productId and deliveryOptionId from the data attributes
      const { productId, deliveryOptionId } = element.dataset;

      // update the delivery option of the item
      cart.updateDeliveryOption(productId, deliveryOptionId);
      renderPaymentSummary();

      // update the date label for the item
      // avoid rendering checkout summary again to ensure that other items that are 
      // being updated do not get reset
      const dateString = getDeliveryDay(getDeliveryOption(deliveryOptionId));
      document.querySelector(`.js-delivery-date-${productId}`).innerHTML = 
        `Delivery date: ${dateString}`;

    });
  });

  // event listener for the 'delete' button for each item
  document.querySelectorAll('.js-delete-link').forEach((link) =>
  {
    link.addEventListener('click', () =>
    {
      // use the productId to remove the item from the cart
      const productId = link.dataset.productId;
      cart.removeFromCart(productId);
      document.querySelector(`.js-cart-item-container-${productId}`).remove();

      // update the page to reflect changes
      // avoid rendering checkout summary again to ensure that other items that are 
      // being updated do not get reset
      renderCheckoutHeader();
      renderPaymentSummary();
      renderCheckoutSummary();
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
      // get the quantity of the item
      const productId = link.dataset.productId;
      const newQuantity = document.querySelector(`.js-quantity-input-${productId}`).value;

      // handle the input
      handleInput(productId, newQuantity);
    });
  });

  // eventListener for the 'keydown'
  document.querySelectorAll('.js-quantity-input').forEach((input) =>
  {
    input.addEventListener('keydown', (event) =>
    {
      if (event.key === 'Enter')
      {
        // get the quantity of the item
        const productId = input.dataset.productId;
        const newQuantity = input.value;
    
        // handle the input
        handleInput(productId, newQuantity);
      }
    });
  });
}

/**
 * generates the html of the delivery options
 * 
 * @param {cart} cartItem the item in the cart that we need to change
 * @param {Product} matchingProduct the item that is in the cart that we are changing
 * 
 * @returns the HTML for the radio buttons
 */
function deliveryOptionsHTML(cartItem, matchingProduct)
{
  let html = '';
  deliveryOptions.forEach((deliveryOption) =>
  {
    // get today's date and apply the specified number of days and format
    const dateString = getDeliveryDay(deliveryOption)
    const priceString = deliveryOption.priceCents === 0 ? 'FREE' 
      : `${formatCurrency(deliveryOption.priceCents)} - `;

    // determine what delivery option the user selected
    const isChecked = deliveryOption.id === cartItem.getDeliveryOptionId();

    html += 
     `
      <div class="js-delivery-option delivery-option"
      data-product-id="${matchingProduct.getId()}"
      data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProduct.getId()}">
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
  });
  return html;
}

/**
 * handles the input that the user types into the input element
 * 
 * @param {string} productId the ID associated with the item
 * @param {string} userInput the value that was inside the input element
 */
function handleInput(productId, userInput)
{
  const QUANTITY_LOW = 0;
  const QUANTITY_HIGH = 30;

  // validate invalid keys
  if (isNaN(Number(userInput)))
    alert(`ERROR: '${userInput}' is not a valid number`);
  else
  {
    // convert userInput into a number
    const newQuantity = Math.floor(Number(userInput)); // find the floor of the number to handle decimals

    // validate invalid numbers
    if (newQuantity < QUANTITY_LOW || newQuantity > QUANTITY_HIGH)
      alert(`ERROR: Cannot update quantity to: '${newQuantity}.' Enter in a range from ${QUANTITY_LOW} - ${QUANTITY_HIGH}`);
    else
    {
      /* remove the is-editing-quantity class from the page
       remove from page first because we still need the item in the cart (need the ID).
       removing item from cart first will make productId return null. */
      document.querySelector(`.js-cart-item-container-${productId}`).classList.remove('is-editing-quantity');
      
      // update the cart internally
      if (newQuantity === 0)
      {
        cart.removeFromCart(productId); // remove from the cart if '0'
        document.querySelector(`.js-cart-item-container-${productId}`).remove();
      }
      else
      {
        cart.updateItemQuantity(productId, newQuantity); // update the quantity of the item
        document.querySelector(`.js-quantity-label-${productId}`).innerHTML = newQuantity;
      }

      // update the page to reflect changes
      // avoid rendering checkout summary again to ensure that other items that are 
      // being updated do not get reset
      renderCheckoutHeader();
      renderPaymentSummary();
    }
  }
}
