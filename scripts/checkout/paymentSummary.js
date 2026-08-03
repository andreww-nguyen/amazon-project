import {cart} from '../../data/cart.js';
import {getProduct} from '../../data/products.js';
import {getDeliveryOption} from '../..//data/deliveryOptions.js';
import {formatCurrency} from '../utils/money.js';


export function renderPaymentSummary()
{
  let grossCostCents = 0;
  let shippingCostCents = 0;
  let TAX = 10;

  cart.forEach((cartItem) =>
  {
    // get the cost of the items 
    const product = getProduct(cartItem.productId);
    grossCostCents += cartItem.quantity * product.priceCents;

    // get the cost of the shipping
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingCostCents += deliveryOption.priceCents;
  });

  // calculate the totals
  let totalBeforeTaxCents = grossCostCents + shippingCostCents;
  let taxCents = totalBeforeTaxCents * (TAX / 100);
  const totalCents = totalBeforeTaxCents + taxCents;

  console.log(grossCostCents);
  console.log(shippingCostCents);

  const paymentSummaryHTML = 
  `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${cart.length}):</div>
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

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}