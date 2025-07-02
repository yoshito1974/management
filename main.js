document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");

  // 全角→半角変換（数字のみ）
  function toHalfWidth(str) {
    return str.replace(/[０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const data = {
      date: document.getElementById("date").value,
      store: document.getElementById("store").value,
      lender: document.getElementById("lender").value,
      borrower: document.getElementById("borrower").value,
      item: document.getElementById("item").value,
      price: toHalfWidth(document.getElementById("price").value),
    };

    fetch("https://script.google.com/macros/s/あなたのGASデプロイURL/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    alert("送信しました！");
    form.reset();
  });
});
