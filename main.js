(async () => {
  await liff.init({ liffId: "2007681083-EwJbXNRl" });
  const form = document.getElementById("form");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const vals = {
      date: document.getElementById("date").value,
      store: document.getElementById("store").value,
      person: document.getElementById("person").value,
      item: document.getElementById("item").value,
      price: document.getElementById("price").value
    };
    const text = `${vals.date} ${vals.store} ${vals.person} ${vals.item} ${vals.price}`;
    await liff.sendMessages([{ type: "text", text }]);
    liff.closeWindow();
  });
})();
// JavaScript Document
