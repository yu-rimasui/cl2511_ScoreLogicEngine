"use client"

import React from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGolf } from "../context/GolfContext"

export default function ResultPage() {
  const router = useRouter()
  const { holes } = useGolf()

  // 計算ロジック
  const calculateTotal = () => holes.reduce((sum, hole) => sum + hole.score, 0)
  const calculateTotalPar = () => holes.reduce((sum, hole) => sum + hole.par, 0)
  
  const totalScore = calculateTotal()
  const totalPar = calculateTotalPar()
  const overPar = totalScore - totalPar

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-foreground">解析完了</h2>
          <p className="text-muted-foreground">あなたのパフォーマンスの要点です</p>
        </div>

        <Card className="mb-6 bg-primary p-8 text-center text-primary-foreground shadow-lg">
          <p className="mb-2 text-sm font-medium uppercase tracking-wide text-primary-foreground/80">Total Score</p>
          <p className="mb-1 text-6xl font-bold">{totalScore}</p>
          <p className="text-xl text-primary-foreground/90">({overPar > 0 ? `+${overPar}` : overPar})</p>
        </Card>

        <Card className="mb-6 p-6 shadow-md">
          <h3 className="mb-4 text-xl font-bold text-foreground">AI解析とアドバイス</h3>
          <div className="space-y-3 text-foreground/90 leading-relaxed">
            <p>
              <strong className="text-foreground">良いラウンドでした！</strong> OUT（前半）のパッティングは安定していました。
            </p>
            <p>
              ただし、ドライバーでのミスが <strong className="text-destructive">6番・10番</strong> に見られ、パーを大きく上回っています。
              次回の練習ではティーショットの安定性を重視しましょう。
            </p>
            <p>
              <strong className="text-foreground">主な気づき:</strong>
            </p>
            <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
              <li>パー3の安定感は良好</li>
              <li>パー5ではコースマネジメントを検討</li>
              <li>後半のリカバリーは概ね良好</li>
            </ul>
          </div>
        </Card>

        <div className="space-y-3">
          <Button
            size="lg"
            className="h-14 w-full gap-3 rounded-full bg-accent text-lg font-semibold shadow-lg hover:bg-accent/90"
          >
            <Send className="h-5 w-5" />
            LINEにレポートを送信（記録）
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/")}
            className="h-14 w-full rounded-full border-2 text-lg font-semibold"
          >
            ホームに戻る
          </Button>
        </div>
      </div>
    </div>
  )
}