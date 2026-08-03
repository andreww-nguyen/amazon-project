import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';

export const deliveryOptions = 
[
  {
    id: '1',
    deliveryDays: 7,
    priceCents: 0
  },

  {
    id: '2',
    deliveryDays: 3,
    priceCents: 499
  },

  {
    id: '3',
    deliveryDays: 1,
    priceCents: 999
  }
];

export function getDeliveryOption(deliveryOptionId)
{
  let deliveryOption;
  deliveryOptions.forEach((option) =>
  {
    if (option.id === deliveryOptionId)
    {
      deliveryOption = option;
    }
  });

  return deliveryOption || deliveryOption[0];
}

export function getDeliveryDay(deliveryOption)
{
  // get today's date and format the date of the delivery
  const today = dayjs();
  let deliveryDate = today;
  let daysToAdd = deliveryOption.deliveryDays;
  
  while (daysToAdd > 0)
  {
    // add one day
    deliveryDate = deliveryDate.add(1, 'days');
    
    if (!isWeekend(deliveryDate))
    {
      // decrease the number of days to add
      // if the day to delivery is a saturday or sunday, we continue adding
      daysToAdd--;
    }
  }

  // format the deliveryDate
  const dateString = deliveryDate.format('dddd, MMMM D');
  return dateString;
}

function isWeekend(date)
{
  const dayOfWeek = date.format('dddd');
  return dayOfWeek === 'Sunday' || dayOfWeek === 'Saturday'
}