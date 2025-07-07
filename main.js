const GAS_URL = "https://script.google.com/macros/s/AKfycbwx4ZPi9B6X6Jh4lhVyViISWKFLvO5IXSIrMdVB7D6iLqc6wOyHsKkVJ9gQwDsBs-y9/exec";
const shops = [
  "MARUGO‑D", "MARUGO‑OTTO", "元祖どないや新宿三丁目", "鮨こるり",
  "MARUGO", "MARUGO2", "MARUGO GRANDE", "MARUGO MARUNOUCHI",
  "マルゴ新橋", "MARUGO YOTSUYA", "371BAR", "三三五五",
  "BAR PELOTA", "Claudia2", "BISTRO CAVA,CAVA", "eric’S",
  "MITAN", "焼肉マルゴ", "SOBA‑JU", "Bar Violet",
  "X&C", "トラットリア ブリッコラ"
];

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

async function initLiff() {
  await liff.init({ liffId: "あなたのLIFF ID" });

  if (!liff.isLoggedIn()) {
    liff.login();
    return;
  }

  const profile = await liff.getProfile();
  window.userProfile = {
    displayName: profile.displayName,
    userId: profile.userId
  };

  // 自動補完
  const borrowerSelect = document.getElementById("borrower");
  for (let option of borrowerSelect.options) {
    if (option.value.includes(profile.displayName)) {
      borrowerSelect.value = option.value;
      break;
    }
  }
}

initLiff();

document.getElementById("loanForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const amountRaw = document.getElementById("amount").value;
  const normalizedAmount = amountRaw.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248));

  const userAgent = navigator.userAgent;

  const data = {
    date: document.getElementById("date").value,
    name: document.getElementById("name").value,
    lender: document.getElementById("lender").value,
    borrower: document.getElementById("borrower").value,
    category: document.getElementById("category").value,
    item: document.getElementById("item").value,
    amount: normalizedAmount,
    displayName: window.userProfile?.displayName || "",
    userId: window.userProfile?.userId || "",
    userAgent: userAgent
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
  if (liff.isInClient()) liff.closeWindow();
});
