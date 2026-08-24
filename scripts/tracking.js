import { loadProducts, getProduct } from '../data/products.js';
import { orders } from '../data/orders.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';



renderTrackingPage();

async function renderTrackingPage()
{
  await loadProducts();
  const urlParam = new URLSearchParams(window.location.search);
  const orderId = urlParam.get('orderId');
  const productId = urlParam.get('productId');
  let matchingProduct;
  let matchingOrder;
  console.log(orders);

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
        {
          matchingProduct = product;
          console.log(matchingProduct)
        }

      });
    }
  });

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
      <div class="progress-label">
        Preparing
      </div>
      <div class="progress-label current-status">
        Shipped
      </div>
      <div class="progress-label">
        Delivered
      </div>
    </div>

    <div class="progress-bar-container">
      <div class="progress-bar"></div>
    </div>
  `;
  document.querySelector('.js-order-tracking').innerHTML = productOrderHTML;

  // calculate the delivery time
  const deliveryProgress = getDeliveryProgress(matchingOrder, matchingProduct);
  console.log(deliveryProgress);
  document.querySelector('.progress-bar').style.width = `${deliveryProgress}%`;
}

function getDeliveryProgress(order, product)
{
  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const estimatedDeliveryTime = dayjs(product.estimatedDeliveryTime);
  return ((today - orderTime) / (estimatedDeliveryTime - orderTime)) * 100;
}