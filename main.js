const GAS_URL = "https://script.google.com/macros/s/AKfycbyd2xlHDOcqODKIpIYf6Z4XtI5UKw7zS2WoMZf1kl3BSF_cMc7GWRFu8z8Ol2euLAyb/exec"; // 最新のGAS URLに差し替え

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
    amount: normalizedAmount
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
});
