import {cart} from '../../data/cart.js';
import {getProduct} from '../../data/products.js';
import {getDeliveryOption} from '../..//data/deliveryOptions.js';
import {formatCurrency} from '../utils/money.js';
import { addOrder } from '../../data/orders.js';

/**
 * renders the payment summary on the checkout page
 */
export function renderPaymentSummary()
{
  let grossCostCents = 0;
  let shippingCostCents = 0;
  let TAX = 10;

  cart.getCartItems().forEach((cartItem) =>
  {
    // get the cost of the items 
    const product = getProduct(cartItem.getProductId());
    grossCostCents += cartItem.getQuantity() * product.getPriceCents();

    // get the cost of the shipping
    const deliveryOption = getDeliveryOption(cartItem.getDeliveryOptionId());
    shippingCostCents += deliveryOption.priceCents;
  });

  // calculate the totals
  let totalBeforeTaxCents = grossCostCents + shippingCostCents;
  let taxCents = totalBeforeTaxCents * (TAX / 100);
  const totalCents = totalBeforeTaxCents + taxCents;

  const paymentSummaryHTML = 
  `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${cart.getCartQuantity()}):</div>
      <div class="payment-summary-money">
        $${formatCurrency(grossCostCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">
        $${formatCurrency(shippingCostCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalBeforeTaxCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
        $${formatCurrency(taxCents)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">
        $${formatCurrency(totalCents)}
      </div>
    </div>

    <button class="js-place-order place-order-button button-primary">
      Place your order
    </button>
  `;

  // insert the HTML onto the page
  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;

  // make sure that the user cannot make an order with no items in the cart
  if (cart.getCartQuantity() === 0)
    document.querySelector('.js-place-order').classList.add('is-unavailable');

  // event listener for the order button
  document.querySelector('.js-place-order').addEventListener('click', async () =>
  {
    try
    {
      // create a request to the backend
      const response = await fetch('https://supersimplebackend.dev/orders', 
      {
        method: 'POST',
        headers: 
        {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: cart.getCartItems()
        })
      });
  
      const order = await response.json();

      // add the order to the orders array
      addOrder(order);
    }
    catch(error)
    {
      console.log('unexpected error. Try again later');
    }

    window.location.href = 'orders.html';
  });
}