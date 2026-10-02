async function fetchInventory() {
  
  try {
    const response = await fetch('/dashboard/inventory');
    const inventory = await response.json()
    for (const [drink, count] of Object.entries(inventory)) {
      const el = document.querySelector(`#stock-${drink}`)
      if (el) {
        el.textContent = count;
      }
    }
  } catch (e) {
    console.error('Error retrieving stock:', e);
  }
}

setInterval(fetchInventory, 3000);