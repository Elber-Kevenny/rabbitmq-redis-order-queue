document.addEventListener('DOMContentLoaded', () => {
  const orderForm = document.querySelector('#orderForm');

  if (orderForm) {
    orderForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    

    const drinkSelect = document.querySelector('#drinkSelect');
    const customInput = document.querySelector('#usernameInput');
    const qt = document.querySelector('#quantityInput');

    const drinkOrder = drinkSelect?.value
    const customer = customInput?.value
    const quantity = qt?.value


    const payload = {
      drinkOrder,
      quantity,
      customer: customer || 'Anonymous'
    };

    try {
      const response = await fetch('/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!response.ok) {
        throw new Error('erro')
      } else {
        alert('Order successfully submitted');
        orderForm.reset();
         return response.json()
      }
     
    } catch (e) {
      console.error(e)
    }

  })
  } else {
    return
  }
  
  
  
})
