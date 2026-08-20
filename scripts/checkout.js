import {renderOrderSummary} from './checkout/orderSummary.js';
import {renderPaymentSummary} from './checkout/paymentSummary.js';
import {renderCheckoutHeader} from './checkout/checkoutHeader.js';
import { loadProducts } from '../data/products.js';
import { loadCart } from '../data/cart.js'


async function loadPage()
{
  try
  {
    // wait until loading the products finishes
    await loadProducts()

    // load the cart
    await new Promise((resolve) =>
    {
      loadCart(() =>
      {
        resolve();
      });
    });
  }
  catch(error)
  {
    console.log('unexpected error. Try again later');
  }
  
  // render the checkout page
  renderCheckoutHeader();
  renderOrderSummary();
  renderPaymentSummary();
}

loadPage();


// load both cart and the products asynchronously
// Promise.all(
// [
//   // load the products
//   loadProducts(),

//   // load the cart
//   new Promise((resolve) =>
//   {
//     loadCart(() =>
//     {
//       resolve();
//     });
//   })

// ]).then((values) =>
// {
//   // render the checkout page
//   console.log(values);
//   renderCheckoutHeader();
//   renderOrderSummary();
//   renderPaymentSummary();
// });



// new Promise((resolve) =>
// {
//   loadProducts(() =>
//   {
//     resolve('value1');
//   });

// }).then((value) =>
// {

//   console.log(value);
//   return new Promise((resolve) =>
//   {
//     loadCart(() =>
//     {
//       resolve();
//     });
//   });

// }).then(() =>
// {
//   renderCheckoutHeader();
//   renderOrderSummary();
//   renderPaymentSummary();
// });

// loadProducts(() =>
// {
//   loadCart(() =>
//   {
//     renderCheckoutHeader();
//     renderOrderSummary();
//     renderPaymentSummary();
//   });
// });