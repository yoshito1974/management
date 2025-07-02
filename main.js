document.addEventListener("DOMContentLoaded", async function () {
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
    options.forEach(opt => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      select.appendChild(option);
    });
  }

  populateSelect("lender", shops);
  populateSelect("borrower", shops);
  populateSelect("category", categories);

  await liff.init({ liffId: "2007681083-EwJbXNRl" });

  if (!liff.isLoggedIn()) {
    liff.login();
    return;
  }

  const profile = await liff.getProfile();
  const displayName = profile.displayName;

  const borrowerSelect = document.getElementById("borrower");
  for (let option of borrowerSelect.options) {
    if (option.value.includes(displayName)) {
      borrowerSelect.value = option.value;
      break;
    }
  }

  document.getElementById("loanForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const data = {
      date: document.getElementById("date").value,
      name: document.getElementById("name").value,
      lender: document.getElementById("lender").value,
      borrower: document.getElementById("borrower").value,
      item: document.getElementById("item").value,
      category: document.getElementById("category").value,
      amount: document.getElementById("amount").value.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248))
    };

    try {
      await fetch("1RmmYz4R7QlJz_wG8dkFZzPBTiSLagr8u04O5pTxK4j8", {
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

    } catch (error) {
      alert("送信に失敗しました: " + error.message);
    }
  });
});
