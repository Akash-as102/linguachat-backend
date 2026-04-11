
import axios from "axios";

export async function translate(text, target) {
  const url = "https://translation.googleapis.com/language/translate/v2";

  const res = await axios.post(url, {}, {
    params: {
      q: text,
      target,
      key: process.env.API_KEY
    }
  });

  return res.data.data.translations[0].translatedText;
}
