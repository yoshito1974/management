document.addEventListener("DOMContentLoaded", async function () {
  // LIFF 初期化
  await liff.init({ liffId: "YOUR_LIFF_ID" }); // ←あなたのLIFF IDに置き換えてください

  // ログインしていなければログイン
  if (!liff.isLoggedIn()) {
    liff.login();
    return;
  }

  // プロフィールから表示名を取得して borrower に入力
  const profile = await liff.getProfile();
  const borrowerInput = document.getElementById("borrower");
  if (borrowerInput) borrowerInput.value = profile.displayName;

  // フォーム送信処理
  document.getElementById("loanForm").addEventListener("submit", function (e) {
    e.preventDefault();

    // 全角数字を半角に変換
    const toHalfWidth = (str) => {
      return str.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248));
    };

    const data = {
      date: document.getElementById("date").value,
      name: document.getElementById("name").value,
      lender: document.getElementById("lender").value,
      borrower: document.getElementById("borrower").value,
      item: document.getElementById("item").value,
      amount: toHalfWidth(document.getElementById("amount").value)
    };

    fetch("https://script.google.com/macros/s/あなたのGASデプロイURL/exec", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    alert("送信されました。");
    document.getElementById("loanForm").reset();

    // LIFFブラウザなら閉じる
    if (liff.isInClient()) {
      liff.closeWindow();
    }
  });
});
