import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// サーバーサイドでAPIキーを読み込みます
// .env.local に GOOGLE_API_KEY が設定されている前提です
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: NextRequest) {
  console.log("%%%%API: /api/ocr 呼び出し開始");

  try {
    // 1. リクエストボディから画像データを取得
    const body = await req.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      console.error("%%%%API: 画像データがありません");
      return NextResponse.json({ error: "No image data" }, { status: 400 });
    }

    // 2. Gemini 1.5 Flashモデルの準備 (JSONモード有効化)
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
      generationConfig: { responseMimeType: "application/json" }
    });

    console.log("%%%%API: Geminiへ解析リクエスト送信");

    // 3. プロンプト（解析指示書）の作成
    // フロントエンドの型定義 (ScoreData) に合わせたJSON構造を指定します
    const prompt = `
      このゴルフスコアカードの画像を分析し、以下のJSONスキーマに従ってデータを抽出してください。
      数値が読み取れない、または記載がない場合は null を使用してください。
      
      出力フォーマット:
      {
        "course_name": "コース名（文字列）",
        "date": "日付（YYYY-MM-DD形式の文字列）",
        "total_score": 合計スコア（数値）,
        "total_putts": 合計パット数（数値またはnull）,
        "holes": [
          { 
            "number": ホール番号（1〜18の数値）, 
            "par": パー（数値）, 
            "score": スコア（数値）, 
            "putts": パット数（数値またはnull） 
          }
        ]
      }
      
      注意点:
      - 手書き文字を正確に読み取ってください。
      - OUT/IN表記の場合は、OUTを1-9、INを10-18として扱ってください。
      - "holes" 配列には必ず18ホール分のデータを含めてください（データがないホールはnullで埋める）。
    `;

    // 4. Geminiへ送信
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBase64,
          mimeType: mimeType || "image/jpeg",
        },
      },
    ]);

    // 5. 結果の取得と整形
    const responseText = result.response.text();
    console.log("%%%%API: Geminiからの応答受信完了");
    
    // JSONとしてパースできるか確認してから返す
    try {
      const jsonResponse = JSON.parse(responseText);
      return NextResponse.json(jsonResponse);
    } catch (parseError) {
      console.error("%%%%API: JSONパースエラー", parseError);
      console.error("Original Text:", responseText);
      return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
    }

  } catch (error) {
    console.error("%%%%API: サーバー内部エラー", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}