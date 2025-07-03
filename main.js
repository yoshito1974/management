const GAS_URL = "https://script.google.com/macros/s/AKfycbyVakVT1XSQAiDX1Pic0F-GrkiiWeMSq_8e4XXseS-gDgVI5DaHehUlcxdI2mp_I9DU/exec";  // ここはあなたのGASのURLに変更

const shops = [
  "MARUGO‑D", "MARUGO‑OTTO", "元祖どないや新宿三丁目", "鮨こるり",
  "MARUGO", "MARUGO2", "MARUGO GRANDE", "MARUGO MARUNOUCHI",
@@ -9,84 +7,42 @@ const shops = [
  "X&C", "トラットリア ブリッコラ"
];

function populateShops() {
  const lenderSelect = document.getElementById("lender");
  const borrowerSelect = document.getElementById("borrower");

function populateSelect(name) {
  const select = document.querySelector(`select[name="${name}"]`);
  shops.forEach(shop => {
    const option1 = document.createElement("option");
    option1.value = shop;
    option1.textContent = shop;
    lenderSelect.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = shop;
    option2.textContent = shop;
    borrowerSelect.appendChild(option2);
    const option = document.createElement("option");
    option.value = shop;
    option.textContent = shop;
    select.appendChild(option);
  });
}

populateShops();

// LIFF初期化
async function initLiff() {
  await liff.init({ liffId: "【あなたのLIFF ID】" });
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    const profile = await liff.getProfile();
    const displayName = profile.displayName;
    const userId = profile.userId;

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
populateSelect("lender");
populateSelect("borrower");

// 送信処理
document.getElementById("loanForm").addEventListener("submit", function (e) {
document.getElementById("recordForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {};
  formData.forEach((value, key) => data[key] = value);

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
  const response = await fetch("https://script.google.com/macros/s/AKfycbyVakVT1XSQAiDX1Pic0F-GrkiiWeMSq_8e4XXseS-gDgVI5DaHehUlcxdI2mp_I9DU/exec", {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  });

  alert("送信されました。");

  document.getElementById("loanForm").reset();

  if (liff.isInClient()) {
    liff.closeWindow();
  }
  document.getElementById("result").innerHTML = `
    <p>送信が完了しました。</p>
    <ul>
      <li>日付: ${data.date}</li>
      <li>名前: ${data.name}</li>
      <li>貸主: ${data.lender}</li>
      <li>借主: ${data.borrower}</li>
      <li>カテゴリー: ${data.category}</li>
      <li>品目: ${data.item}</li>
      <li>金額: ${data.amount} 円</li>
    </ul>
  `;
  e.target.reset();
});
