document.addEventListener("DOMContentLoaded", async () => {
  const shops = [
    "MARUGO‑D", "MARUGO‑OTTO", "元祖どないや新宿三丁目", "鮨こるり",
    "MARUGO", "MARUGO2", "MARUGO GRANDE", "MARUGO MARUNOUCHI",
    "マルゴ新橋", "MARUGO YOTSUYA", "371BAR", "三三五五",
    "BAR PELOTA", "Claudia2", "BISTRO CAVA,CAVA", "eric’S",
    "MITAN", "焼肉マルゴ", "SOBA‑JU", "Bar Violet",
    "X&C", "トラットリア ブリッコラ"
  ];

  const categories = ["食材", "飲料", "その他"];

  function populateSelect(id, options) {
    const select = document.getElementById(id);
    options.forEach(option => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      select.appendChild(opt);
    });
  }

  populateSelect("lender", shops);
  populateSelect("borrower", shops);
  populateSelect("category", categories);

  // LIFF 初期化
  await liff.init({ liffId: "あなたのLIFF ID" });

  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    const profile = await liff.getProfile();
    document.getElementById("name").value = profile.displayName;
  }

  // フォーム送信処理
  document.getElementById("loanForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      date: document.getElementById("date").value,
      name: document.getElementById("name").value,
      lender: document.getElementById("lender").value,
      borrower: document.getElementById("borrower").value,
      category: document.getElementById("category").value,
      item: document.getElementById("item").value,
      amount: document.getElementById("amount").value.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)) // 全角→半角
    };

    await fetch("あなたのGAS Web AppのURL", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    alert("送信が完了しました。");

    // フォームをリセット
    document.getElementById("loanForm").reset();

    // LINEアプリ内であれば閉じる
    if (liff.isInClient()) {
      liff.closeWindow();
    }
  });
});
