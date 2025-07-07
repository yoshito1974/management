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
const GAS_URL = "https://script.google.com/macros/s/AKfycbwr4f2s3LMaTOAxWs54BmXbPe62_M-eHMk0qWAUU-grjYA83AG9n-Fg5posjcv3n716/exec";  // ここはあなたのGASのURLに変更

  populateSelect("lender", shops);
  populateSelect("borrower", shops);
  populateSelect("category", categories);
const shops = [
  "MARUGO‑D", "MARUGO‑OTTO", "元祖どないや新宿三丁目", "鮨こるり",
  "MARUGO", "MARUGO2", "MARUGO GRANDE", "MARUGO MARUNOUCHI",
  "マルゴ新橋", "MARUGO YOTSUYA", "371BAR", "三三五五",
  "BAR PELOTA", "Claudia2", "BISTRO CAVA,CAVA", "eric’S",
  "MITAN", "焼肉マルゴ", "SOBA‑JU", "Bar Violet",
  "X&C", "トラットリア ブリッコラ"
];

  // LIFF 初期化
  await liff.init({ liffId: "2007681083-EwJbXNRl" });
function populateShops() {
  const lenderSelect = document.getElementById("lender");
  const borrowerSelect = document.getElementById("borrower");

  shops.forEach(shop => {
    const option1 = document.createElement("option");
    option1.value = shop;
    option1.textContent = shop;
    lenderSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = shop;
    option2.textContent = shop;
    borrowerSelect.appendChild(option2);
  });
}

populateShops();

// LIFF初期化
async function initLiff() {
  await liff.init({ liffId: "2007681083-EwJbXNRl" });
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    const profile = await liff.getProfile();
    document.getElementById("name").value = profile.displayName;
  }
    const displayName = profile.displayName;
    const userId = profile.userId;

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

    await fetch("https://script.google.com/macros/s/AKfycbwr4f2s3LMaTOAxWs54BmXbPe62_M-eHMk0qWAUU-grjYA83AG9n-Fg5posjcv3n716/exec", {
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
    // フォーム送信時に一緒に送るために保持
    window.userProfile = { displayName, userId };

    // borrower に自動入力（名前が一致すれば）
    const borrowerSelect = document.getElementById("borrower");
    for (let option of borrowerSelect.options) {
      if (option.value.includes(displayName)) {
        borrowerSelect.value = option.value;
        break;
      }
    }
  }
}

initLiff();

// 送信処理
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
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  alert("送信されました。");

  document.getElementById("loanForm").reset();

  if (liff.isInClient()) {
    liff.closeWindow();
  }
});
