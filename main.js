const GAS_URL = "https://script.google.com/macros/s/AKfycbzpdqf9or6umCtLdcL_Q5glqiYFFOleOcLj0dDF9fhpUDYrYsPEYMpWKPsrTJqtFEt_/exec"; // 最新のGAS URL

const shops = [
  "MARUGO‑D", "MARUGO‑OTTO", "元祖どないや新宿三丁目", "鮨こるり",
  "MARUGO", "MARUGO2", "MARUGO GRANDE", "MARUGO MARUNOUCHI",
  "マルゴ新橋", "MARUGO YOTSUYA", "371BAR", "三三五五",
  "BAR PELOTA", "Claudia2", "BISTRO CAVA,CAVA", "eric’S",
  "MITAN", "焼肉マルゴ", "SOBA‑JU", "Bar Violet",
  "X&C", "トラットリア ブリッコラ"
];

// 店舗セレクトボックスに反映
function populateShops() {
  const lenderSelect = document.getElementById("lender");
  const borrowerSelect = document.getElementById("borrower");
  shops.forEach(shop => {
    lenderSelect.add(new Option(shop, shop));
    borrowerSelect.add(new Option(shop, shop));
  });
}

// LIFF初期化とユーザープロファイル取得（エラー表示付き）
async function initLiff() {
  try {
    await liff.init({ liffId: "2007681083-B3Z2RkAv" });

    if (!liff.isLoggedIn()) {
      liff.login(); // 初回はここで戻る
      return;
    }

    const profile = await liff.getProfile();
    const displayName = profile.displayName;
    const userId = profile.userId;

    // ✅ 取得確認
    console.log("✅ LINE userId:", userId);
    alert("userId: " + userId); // ←一時的確認

    window.userProfile = { displayName, userId };

    // borrower に自動入力
    const borrowerSelect = document.getElementById("borrower");
    for (let option of borrowerSelect.options) {
      if (option.value.includes(displayName)) {
        borrowerSelect.value = option.value;
        break;
      }
    }

  } catch (err) {
    console.error("❌ LIFF初期化エラー:", err);
    alert("システムエラー: LIFFの初期化に失敗しました\n" + err.message);
  }
}

// フォーム送信処理
document.getElementById("loanForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  try {
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

    const response = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const resultText = await response.text();
    console.log("GAS応答:", resultText);
    alert("送信完了: " + resultText);
    document.getElementById("loanForm").reset();

    if (liff.isInClient()) {
      liff.closeWindow();
    }

  } catch (err) {
    console.error("❌ フォーム送信エラー:", err);
    alert("送信に失敗しました\n" + err.message);
  }
});

// 初期化
populateShops();
initLiff();
