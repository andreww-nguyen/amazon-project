// retrieve the orders from the local storage
// return empty array if no orders
export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order)
{
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage()
{
  localStorage.setItem('orders', JSON.stringify(orders));
}