import { loadProducts, getProduct } from '../data/products.js';
import { orders } from '../data/orders.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

renderTrackingPage();


document.querySelector('.js-search-button').addEventListener('click', () =>
{
  const search = document.querySelector('.js-search-bar').value;

  // check if the user entered anythin in the text box
  if (search)
    document.querySelector('.js-search-link').href = `index.html?search=${search}`;
  else
    document.querySelector('.js-search-link').href = `index.html`;
});

document.body.addEventListener('keydown', (event) =>
{
  const search = document.querySelector('.js-search-bar').value;

  // only trigger if the search bar is the active element
  if ((event.key === 'Enter') && 
    document.activeElement === document.querySelector('.js-search-bar'))
  {
    // check if the user entered anythin in the text box
    if (search)
      window.location.href = `index.html?search=${search}`;
    else
      window.location.href = `index.html`;
  }
});

/**
 * renders teh tracking page of the item
 */
async function renderTrackingPage()
{
  await loadProducts();
  const url = new URL(window.location.href);
  const orderId = url.searchParams.get('orderId');
  const productId = url.searchParams.get('productId');
  let matchingProduct;
  let matchingOrder;

  orders.forEach((order) =>
  {
    // find the order in the orders array
    if (order.id === orderId)
    {
      matchingOrder = order;
      // find the product from the order
      order.products.forEach((product) =>
      {
        // find the matching product
        if (product.productId === productId)
          matchingProduct = product;
      });
    }
  });

  // calculate the delivery time
  const deliveryProgress = getDeliveryProgress(matchingOrder, matchingProduct);
  
  // find the matching order  
  let productOrderHTML = 
  `
    <a class="back-to-orders-link link-primary" href="orders.html">
      <button class="back-to-orders-button button-primary">
        View all orders
      </button>
    </a>

    <div class="delivery-date">
      Arriving on ${dayjs(matchingProduct.estimatedDeliveryTime).format('dddd, MMMM D')}
    </div>

    <div class="product-info">
      ${getProduct(matchingProduct.productId).getName()}
    </div>

    <div class="product-info">
      Quantity: ${matchingProduct.quantity}
    </div>

    <img class="product-image" src="${getProduct(matchingProduct.productId).getImage()}">

    <div class="progress-labels-container">
      <div class="prepare-progress-label">
        Preparing
      </div>
      <div class="shipped-progress-label">
        Shipped
      </div>
      <div class="delivered-progress-label">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
  `;
  document.querySelector('.js-order-tracking').innerHTML = productOrderHTML;

  // determine the order status
  let orderStatus;
  if (deliveryProgress >= 0 && deliveryProgress <= 49)
    orderStatus = 'prepare';
  else if (deliveryProgress > 49 && deliveryProgress <= 99)
    orderStatus = 'shipped'
  else if (deliveryProgress > 99)
    orderStatus = 'delivered';

  // change the HTML of the page
  document.querySelector('.progress-bar').style.width = `${deliveryProgress}%`;
  document.querySelector(`.${orderStatus}-progress-label`).classList.add('current-status');
}

/**
 * 
 * @param {order} order the order that was placed
 * @param {Product} product the product within the order
 * @returns the progress of the delivery as a percentage out of 100 (number)
 */
function getDeliveryProgress(order, product)
{
  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const estimatedDeliveryTime = dayjs(product.estimatedDeliveryTime);
  return ((today - orderTime) / (estimatedDeliveryTime - orderTime)) * 100;
}