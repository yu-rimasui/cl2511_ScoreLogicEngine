"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Camera, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGolf } from "./context/GolfContext"

export default function HomePage() {
  const router = useRouter()
  const { setImagePreview, setHoles } = useGolf()
  const [isLoading, setIsLoading] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [currentScreen, setCurrentScreen] = useState<"home" | "loading">("home")
  
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const cameraInputRef = useRef<HTMLInputElement | null>(null)

  // カメラ周りの状態
  const [isCameraActive, setIsCameraActive] = useState(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null)

  const handleUpload = () => {
    setShowPicker(true)
  }

  // ファイル（またはキャプチャ済みBlob）を処理する共通関数
  const processFile = async (file: File) => {
    // プレビュー表示
    const url = URL.createObjectURL(file)
    setImagePreview(url)
    setShowPicker(false)

    // ローディング開始
    setCurrentScreen("loading")
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("OCR Failed")
      }

      const data = await response.json()
      setHoles(data.holes)
      router.push("/correction")
    } catch (error) {
      console.error("Error analyzing scorecard:", error)
      alert("解析に失敗しました。もう一度試してください。")
      setCurrentScreen("home")
      setIsLoading(false)
    }
  }

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    processFile(file)
  }

  // カメラ起動（MediaDevices）
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false })
      setMediaStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setIsCameraActive(true)
      setShowPicker(false)
    } catch (err) {
      console.error("カメラの起動に失敗しました", err)
      alert("カメラにアクセスできませんでした。端末の設定を確認してください。")
    }
  }

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((t) => t.stop())
      setMediaStream(null)
    }
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
    }
    setIsCameraActive(false)
  }

  const capturePhoto = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current || document.createElement("canvas")
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) return
      setCapturedBlob(blob)
      // カメラ停止してプレビュー表示へ移行
      stopCamera()
    }, "image/jpeg", 0.9)
  }

  const retake = async () => {
    setCapturedBlob(null)
    await openCamera()
  }

  const confirmCapture = async () => {
    if (!capturedBlob) return
    const file = new File([capturedBlob], `capture_${Date.now()}.jpg`, { type: capturedBlob.type })
    processFile(file)
  }

  useEffect(() => {
    return () => {
      // アンマウント時にストリームを解放
      if (mediaStream) {
        mediaStream.getTracks().forEach((t) => t.stop())
      }
    }
  }, [mediaStream])

  // ローディング画面
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 bg-background">
        <div className="text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
          <h2 className="mb-2 text-2xl font-semibold text-foreground">スコアカードを分析中</h2>
          <p className="text-muted-foreground">AIがスコアカードを処理しています…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileSelected}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelected}
      />

      <div className="flex min-h-screen flex-col">
        <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12">
          <div className="mb-8 text-center">
            <h1 className="mb-3 font-serif text-5xl font-bold tracking-tight text-foreground text-balance md:text-6xl">
              ゴルフAI分析
            </h1>
            <p className="text-lg text-muted-foreground text-balance md:text-xl">
              AIがあなたのラウンドを分析します
            </p>
          </div>

          <div className="mb-12 w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
            {/* 画像パスはpublicフォルダに合わせてください */}
            <img src="/scenic-golf-course-with-green-fairway.jpg" alt="Golf course" className="h-[300px] w-full object-cover" />
          </div>

          <Button
            onClick={handleUpload}
            size="lg"
            className="h-14 gap-3 rounded-full bg-primary px-8 text-lg font-semibold shadow-xl hover:bg-primary/90"
          >
            <Camera className="h-6 w-6" />
            カメラ／スコアカードをアップロード
          </Button>

          {showPicker && (
            <div className="absolute left-0 top-0 z-50 flex h-full w-full items-end justify-center bg-black/30">
              <div className="mb-8 w-full max-w-md rounded-t-xl bg-white p-4">
                <p className="mb-3 text-center font-medium text-black">選択してください</p>
                <div className="space-y-2">
                  <Button 
                    size="lg" 
                    // onClick={openCamera} 
                    className="w-full">
                    カメラで撮影（未実装）
                  </Button>
                  <Button size="lg" onClick={() => fileInputRef.current?.click()} className="w-full">
                    画像をアップロード
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setShowPicker(false)} className="w-full text-black">
                    キャンセル
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* カメラモーダル */}
          {isCameraActive && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-md rounded-xl bg-white p-4">
                <div className="mb-3 text-center font-medium">写真を撮影してください</div>
                <div className="mb-3">
                  <video ref={videoRef} className="h-64 w-full rounded-md bg-black object-cover" playsInline muted />
                </div>
                <div className="flex gap-2">
                  <Button size="lg" onClick={capturePhoto} className="flex-1">
                    撮影
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => { stopCamera(); setShowPicker(false) }} className="flex-1">
                    キャンセル
                  </Button>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            </div>
          )}

          {/* 撮影済みプレビュー（確定 or 再撮影） */}
          {capturedBlob && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="w-full max-w-md rounded-xl bg-white p-4">
                <div className="mb-3 text-center font-medium">撮影プレビュー</div>
                <div className="mb-3">
                  <img src={URL.createObjectURL(capturedBlob)} alt="preview" className="h-64 w-full rounded-md object-cover" />
                </div>
                <div className="flex gap-2">
                  <Button size="lg" onClick={confirmCapture} className="flex-1">
                    確定して解析
                  </Button>
                  <Button variant="outline" size="lg" onClick={retake} className="flex-1">
                    再撮影
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
