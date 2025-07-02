(async () => {
  await liff.init({ liffId: "2007681083-EwJbXNRI" });

  const form = document.getElementById("form");

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const data = {
      date: document.getElementById("date").value,
      store: document.getElementById("store").value,
      lender: document.getElementById("lender").value,
      borrower: document.getElementById("borrower").value,
      item: document.getElementById("item").value,
      price: document.getElementById("price").value
    };

    try {
      await fetch("https://script.google.com/macros/s/AKfycbw9ScrkV7xuZGWdxL9UF1Ylioomzu6vG1WZw6poe1_TWE_31_YZJUCrizscOT4AOt4w/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      alert("送信が完了しました！");
      liff.closeWindow();
    } catch (error) {
      console.error("送信エラー:", error);
      alert("送信に失敗しました。もう一度お試しください。");
    }
  });
})();
