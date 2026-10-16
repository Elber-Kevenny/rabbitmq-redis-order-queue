test("Deve criar um pedido com sucesso ao enviar o payload válido", async () => {
  const response = await fetch("http://localhost:3000/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      drinkOrder: "Latte",
      quantity: 2,
      customer: "Elber",
    }),
  });

  expect(response.status).toBe(200);
  const text = await response.text();
  expect(text).toEqual("Order processing");
});

test("Retornar 400 ao enviar um pedido inválido", async () => {
  const response = await fetch("http://localhost:3000/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      drinkOrder: undefined,
      quantity: 2,
      customer: "Elber",
    }),
  });

  expect(response.status).toBe(400);
  const text = await response.text();
  expect(text).not.toEqual("Order processing");
});
