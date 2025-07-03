const shops = [
  "MARUGO‑D", "MARUGO‑OTTO", "元祖どないや新宿三丁目", "鮨こるり",
  "MARUGO", "MARUGO2", "MARUGO GRANDE", "MARUGO MARUNOUCHI",
  "マルゴ新橋", "MARUGO YOTSUYA", "371BAR", "三三五五",
  "BAR PELOTA", "Claudia2", "BISTRO CAVA,CAVA", "eric’S",
  "MITAN", "焼肉マルゴ", "SOBA‑JU", "Bar Violet",
  "X&C", "トラットリア ブリッコラ"
];

function populateSelect(name) {
  const select = document.querySelector(`select[name="${name}"]`);
  shops.forEach(shop => {
    const option = document.createElement("option");
    option.value = shop;
    option.textContent = shop;
    select.appendChild(option);
  });
}

populateSelect("lender");
populateSelect("borrower");

document.getElementById("recordForm").addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = {};
  formData.forEach((value, key) => data[key] = value);

  const response = await fetch("https://script.google.com/macros/s/AKfycbyVakVT1XSQAiDX1Pic0F-GrkiiWeMSq_8e4XXseS-gDgVI5DaHehUlcxdI2mp_I9DU/exec", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  });

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
