(async () => {
  // LIFFの初期化（あなたの LIFF ID に置き換えてください）
  await liff.init({ liffId: "2007681083-EwJbXNRl" });

  const form = document.getElementById("form");

  form.addEventListener("submit", async e => {
    e.preventDefault();

    // 入力値を取得
    const data = {
      date: document.getElementById("date").value,
      store: document.getElementById("store").value,
      person: document.getElementById("person").value,
      item: document.getElementById("item").value,
      price: document.getElementById("price").value
    };

    try {
      // GAS Web Apps にPOST送信（ここにあなたのGASのURLを貼る）
      await fetch("https://script.google.com/macros/s/【あなたのGAS_URL】/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      alert("送信が完了しました！");
      liff.closeWindow(); // LINE内ブラウザを自動で閉じる
    } catch (error) {
      console.error("送信エラー:", error);
      alert("送信に失敗しました。もう一度お試しください。");
    }
  });
})();
