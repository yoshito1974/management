const GAS_URL = "https://script.google.com/macros/s/AKfycbxZSFw2e83LpDZOf4lrL1ABE7WuQ8gFDclX8zor3Tj7sBr-5LhAOejUhZZiafXz4O60/exec"; // ★あなたのGASのURLに変更。このままでOK。

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

// LIFF初期化
async function initLiff() {
  await liff.init({ liffId: "2007681083-EwJbXNRl" }); // ★あなたのLIFF IDに置き換え。このままでOK。
  if (!liff.isLoggedIn()) {
    liff.login();
  } else {
    try { // プロフィール取得エラーハンドリングを追加
      const profile = await liff.getProfile();
      const displayName = profile.displayName;
      const userId = profile.userId;

      console.log("LIFF初期化済み、ログイン済みです。");
      console.log("取得したLINEプロフィール情報:", profile);
      console.log("取得したUser ID:", userId);
      console.log("取得した表示名:", displayName);

      // フォーム送信時に一緒に送るために保持
      window.userProfile = { displayName, userId };

      // borrower に自動入力（名前が一致すれば）
      const borrowerSelect = document.getElementById("borrower");
      for (let option of borrowerSelect.options) {
        if (option.value.includes(displayName)) { // 部分一致
          borrowerSelect.value = option.value;
          break;
        }
      }
    } catch (err) {
      console.error('プロフィール取得エラー', err);
      alert('LINEプロフィールの取得に失敗しました。');
    }
  }
}

initLiff();

// 送信処理
document.getElementById("loanForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // 金額の全角数字を半角に変換
  const amountRaw = document.getElementById("amount").value;
  const normalizedAmount = amountRaw.replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 65248));

  // フォームから取得した貸借記録データ
  const requestData = { 
    date: document.getElementById("date").value,
    name: document.getElementById("name").value,
    lender: document.getElementById("lender").value,
    borrower: document.getElementById("borrower").value,
    category: document.getElementById("category").value,
    item: document.getElementById("item").value,
    amount: normalizedAmount
  };
  
  // GASのdoPost関数が期待する最終的なデータ構造
  const dataToSendToGas = {
    userId: window.userProfile?.userId || "", // LIFFから取得したUser ID
    data: { // GASのIDENTIFIER_COLUMN_HEADER（例:'名前'）と紐づけるための識別子データ
      identifier: window.userProfile?.displayName || "" // ユーザーの表示名を識別子として送る
    },
    // 貸借記録データは、GAS側で'loanData'というキーで受け取る
    loanData: requestData 
  };

  fetch(GAS_URL, {
    method: "POST",
    // mode: "no-cors", // GASへのCORSリクエストは通常不要。削除推奨。
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dataToSendToGas) // このオブジェクトをGASに送信
  })
  .then(response => {
    // GASがJSONを返すので、JSONとしてパース
    if (response.ok) { // HTTPステータスが2xx系なら成功
      return response.json();
    }
    throw new Error('GASからの応答エラー: ' + response.statusText);
  })
  .then(gasResponse => {
      console.log("GASからの応答:", gasResponse);
      if (gasResponse.success) {
          alert(gasResponse.message || "送信されました。");
          document.getElementById("loanForm").reset(); // 送信成功後にフォームをリセット
          if (liff.isInClient()) {
            liff.closeWindow(); // 送信成功後にLIFFウィンドウを閉じる
          }
      } else {
          alert("送信エラー: " + (gasResponse.error || "不明なエラー"));
      }
  })
  .catch(error => {
      console.error("fetchエラー:", error);
      alert("送信中にエラーが発生しました。ネットワーク接続を確認してください。");
  });

});
