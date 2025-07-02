document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form");

  // 全角→半角変換（数字のみ）
  function toHalfWidth(str) {
    return str.replace(/[０-９]/g, function (s) {
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
      price: toHalfWidth(document.getElementById("price").value)
    };

    fetch("https://script.google.com/macros/s/1RmmYz4R7Q1Jz_wG8dkFZzPBTiSLagr8u0405pTxK4j8/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          alert("送信しました！");
          form.reset();
        } else {
          alert("送信に失敗しました（ステータス: " + response.status + "）");
        }
      })
      .catch(error => {
        alert("エラーが発生しました：" + error);
        console.error("送信エラー:", error);
      });
  });
});
