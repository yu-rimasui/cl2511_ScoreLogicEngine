import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Gemini APIの初期化
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "")

export async function POST(req: NextRequest) {
  try {
    // フロントから送信されたフォームデータを取得
    const data = await req.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // 画像ファイルをArrayBufferに変換し、Base64文字列にする
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString("base64")

    // Geminiモデルの指定（高速な Flash 1.5 を推奨）
    const model = genAI.getGenerativeModel({model: "models/gemini-pro-latest"})

    // プロンプト（命令文）
    const prompt = `
      このゴルフスコアカードの画像を読み取り、以下のJSON形式でデータのみを出力してください。
      余計な解説は不要です。
      
      【必須要件】
      - 1番ホールから18番ホールまでの「Par」と「Score」を抽出すること。
      - 画像が不鮮明で読めない場所は score: 0 とすること。
      - JSONフォーマット:
      [
        { "hole": 1, "par": 4, "score": 5 },
        ...
        { "hole": 18, "par": 4, "score": 6 }
      ]
    `

    // 画像とプロンプトを渡して生成
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Image,
          mimeType: file.type,
        },
      },
    ])

    const response = await result.response
    const text = response.text()

    // Geminiはたまに ```json ... ``` のようなマークダウン記法を含めるので削除してパース
    const jsonString = text.replace(/```json|```/g, "").trim()
    const holesData = JSON.parse(jsonString)

    return NextResponse.json({ holes: holesData })

  } catch (error) {
    console.error("OCR Error:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}



