document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
      date: document.getElementById("date").value,
      store: document.getElementById("store").value,
      lender: document.getElementById("lender").value,
      borrower: document.getElementById("borrower").value,
      item: document.getElementById("item").value,
      price: document.getElementById("price").value,
    };

    // Google Apps Script の Web App URL に置き換えてください
    const GAS_ENDPOINT = "https://script.google.com/macros/s/あなたのGASデプロイURL/exec";

    fetch(GAS_ENDPOINT, {
      method: "POST",
      mode: "no-cors", // レスポンスを使わない前提
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    alert("送信しました！");
    form.reset(); // 送信後、フォームを初期化
  });
});
