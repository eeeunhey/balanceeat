import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_API_GEMINI_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export const getMealAiReport = async (nutrition) => {
  const prompt = `
당신은 영양 전문가입니다.

아래는 한 끼 식단의 총 영양 데이터와 메뉴 목록 입니다.
이 데이터를 바탕으로 건강 점수(0~100), 부족/과다 태그(최대 3개까지 중요한 부분만), 개선 조언을 작성해주세요.
개선 조언은 500자를 넘기지 않도록 해주세요.

반드시 아래 JSON 형식으로만 응답하세요:

{
  "score": number,
  "tags": [string],
  "comment": string
}

영양소 데이터:
${JSON.stringify(nutrition)}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  let text = response.candidates[0].content.parts[0].text;

  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(text);
};
