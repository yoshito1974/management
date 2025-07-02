const shops = [
  "MARUGO‑D", "MARUGO‑OTTO", "元祖どないや新宿三丁目", "鮨こるり",
  "MARUGO", "MARUGO2", "MARUGO GRANDE", "MARUGO MARUNOUCHI",
  "マルゴ新橋", "MARUGO YOTSUYA", "371BAR", "三三五五",
  "BAR PELOTA", "Claudia2", "BISTRO CAVA,CAVA", "eric’S",
  "MITAN", "焼肉マルゴ", "SOBA‑JU", "Bar Violet",
  "X&C", "トラットリア ブリッコラ"
];

function populateSelect(id) {
  const select = document.getElementById(id);
  shops.forEach(shop => {
    const option = document.createElement("option");
    option.value = shop;
    option.textContent = shop;
    select.appendChild(option);
  });
}

populateSelect("lender");
populateSelect("borrower");

const categorySelect = document.getElementById("category");
["食材", "飲料", "その他"].forEach(c => {
  const option = document.createElement("option");
  option.value = c;
  option.textContent = c;
  categorySelect.appendChild(option);
});

async function initLiff() {
  await liff.init({ liffId: "YOUR_LIFF_ID" });
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    const profile = await liff.getProfile();
    const displayName = profile.displayName;
    const userId = profile.userId;

    // displayNameが含まれているショップ名にセット
    const borrowerSelect = document.getElementById("borrower");
    for (let option of borrowerSelect.options) {
      if (option.value.includes(displayName)) {
        borrowerSelect.value = option.value;
        break;
      }
    }

    // 隠し要素にセット（GAS送信用）
    document.getElementById("userId").value = userId;
    document.getElementById("displayName").value = displayName;
  }
}
initLiff();

document.getElementById("loanForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const data = {
    date: document.getElementById("date").value,
    name: document.getElementById("name").value,
    lender: document.getElementById("lender").value,
    borrower: document.getElementById("borrower").value,
    item: document.getElementById("item").value,
    amount: document.getElementById("amount").value.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248)),
    category: document.getElementById("category").value,
    userId: document.getElementById("userId").value,
    displayName: document.getElementById("displayName").value
  };

  fetch("YOUR_GAS_WEBAPP_URL", {
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
