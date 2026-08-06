import {cart, removeFromCart, calculateCartQuantity, 
  updateItemQuantity, updateDeliveryOption} from '../../data/cart.js';
import {getProduct} from '../../data/products.js';
import {formatCurrency} from '../utils/money.js';
import {deliveryOptions, getDeliveryOption, getDeliveryDay} from '../../data/deliveryOptions.js'
import {renderPaymentSummary} from './paymentSummary.js';
import {renderCheckoutHeader} from './checkoutHeader.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

/**
 * renders the checkout page. Displays all the items in the cart and 
 * their information
 */
export function renderOrderSummary()
{
  let cartSummaryHTML = '';
  // loop through the cart and display the items on the checkout page
  cart.forEach((cartItem) =>
  {
    // search for a matching item using the productId
    const productId = cartItem.productId;
    
    // find the matching item
    const matchingProduct = getProduct(productId);

    // get the delivery optionId
    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    // get the delivery date
    const dateString = getDeliveryDay(deliveryOption);

    // generate the HTML for the cart summary
    cartSummaryHTML += 
    `
      <div class="js-cart-item-container js-cart-item-container-${matchingProduct.id} 
      cart-item-container">
        <div class="js-delivery-date-${matchingProduct.id} delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="js-product-name-${matchingProduct.id} product-name">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              ${matchingProduct.getPrice()}
            </div>
            <div class="js-product-quantity-${matchingProduct.id} product-quantity">
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

              <span class="js-delete-link js-delete-link-${matchingProduct.id} 
              delete-quantity-link link-primary"
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
      removeFromCart(productId);
      document.querySelector(`.js-cart-item-container-${productId}`).remove();

      // update the page to reflect changes
      // avoid rendering checkout summary again to ensure that other items that are 
      // being updated do not get reset
      renderCheckoutHeader();
      renderPaymentSummary();
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
 * @param {*} matchingProduct the item that is in the cart that we are changing
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
        removeFromCart(productId); // remove from the cart if '0'
        document.querySelector(`.js-cart-item-container-${productId}`).remove();
      }
      else
      {
        updateItemQuantity(productId, newQuantity); // update the quantity of the item
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
