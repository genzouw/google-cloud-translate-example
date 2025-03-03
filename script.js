const apiKey = "***************************************"; // ここに取得したAPIキーを設定
const translateButton = document.getElementById("translate-button");
const translationResult = document.getElementById("translation-result");

let func = () => {
  const textToTranslate = document.documentElement.outerHTML; // 翻訳対象テキストを取得
  const targetLanguage = document.querySelector(
    'input[name="language"]:checked'
  ).value; // 選択された言語を取得

  translateText(textToTranslate, targetLanguage)
    .then((translatedText) => {

      document.documentElement.innerHTML = translatedText;
      // ボタンのクリックイベントが解除されているため再設定
      document.getElementById("translate-button").addEventListener("click", func);
      // targetLanguage の値を再度選択状態にする
      document.getElementsByName("language").forEach((radio) => {
        if (radio.value === targetLanguage) {
          radio.checked = true;
        }
      })
    })
    .catch((error) => {
      console.error("翻訳エラー:", error);
      translationResult.innerText = "翻訳に失敗しました。";
    });
  translationResult.innerText = "翻訳に失敗しました。";
}

translateButton.addEventListener("click", func);

async function translateText(text, targetLanguage) {
  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  const requestBody = {
    q: text,
    target: targetLanguage,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(`API error: ${data.error.message}`);
    }

    const translatedText = data.data.translations[0].translatedText;
    return translatedText;
  } catch (error) {
    console.error("翻訳APIリクエストエラー:", error);
    throw error; // エラーを呼び出し元に伝播
  }
}
