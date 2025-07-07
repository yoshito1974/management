const GAS_URL = "https://script.google.com/macros/s/AKfycbzpdqf9or6umCtLdcL_Q5glqiYFFOleOcLj0DdFF9fhpUDrYsPEYMpWKPsrTJqtFEt_/exec";  // あなたのGAS URL

const shops = [
  "MARUGO‑D", "MARUGO‑OTTO", "元祖どないや新宿三丁目", "鮨こるり",
  "MARUGO", "MARUGO2", "MARUGO GRANDE", "MARUGO MARUNOUCHI",
  "マルゴ新橋", "MARUGO YOTSUYA", "371BAR", "三三五五",
  "BAR PELOTA", "Claudia2", "BISTRO CAVA,CAVA", "eric’S",
  "MITAN", "焼肉マルゴ", "SOBA‑JU", "Bar Violet",
  "X&C", "トラットリア ブリッコラ"
];

// 店舗名をプルダウンにセット
function populateShops() {
  const lenderSelect = document.getElementById("lender");
  const borrowerSelect = document.getElementById("borrower");
  shops.forEach(shop => {
    const option1 = new Option(shop, shop);
    const option2 = new Option(shop, shop);
    lenderSelect.add(option1);
    borrowerSelect.add(option2);
  });
}

// LIFF初期化とuserId取得（ここが重要）
async function initLiff() {
  await liff.init({ liffId: "2007681083-EwJbXNRI" }); // あなたのLIFF ID

  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    const profile = await liff.getProfile();
    const displayName = profile.displayName;
    const userId = profile.userId;

    // ✅ 確認用：userId表示
    console.log("✅ LINE displayName:", displayName);
    console.log("✅ LINE userId:", userId);
    alert("確認用 userId: " + userId);

    // フォーム送信時に参照する用
    window.userProfile = { displayName, userId };

    // 自動で borrower に自分の名前が含まれていたら選択
    const borrowerSelect = document.getElementById("borrower");
    for (let option of borrowerSelect.options) {
      if (option.value.includes(displayName)) {
        borrowerSelect.value = option.value;
        break;
      }
    }
  }
}

// フォーム送信処理
document.getElementById("loanForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const amountRaw = document.getElementById("amount").value;
  const normalizedAmount = amountRaw.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248));

  const data = {
    date: document.getElementById("date").value,
    name: document.getElementById("name").value,
    lender: document.getElementById("lender").value,
    borrower: document.getElementById("borrower").value,
    category: document.getElementById("category").value,
    item: document.getElementById("item").value,
    amount: normalizedAmount,
    displayName: window.userProfile?.displayName || "",
    userId: window.userProfile?.userId || ""
  };

  fetch(GAS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(txt => {
    alert("送信完了: " + txt);
    document.getElementById("loanForm").reset();
    if (liff.isInClient()) liff.closeWindow();
  })
  .catch(err => {
    console.error("送信エラー:", err);
    alert("送信中にエラーが発生しました");
  });
});

// 起動時処理
populateShops();
initLiff();
