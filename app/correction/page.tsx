"use client"

import React from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useGolf } from "../context/GolfContext"

export default function CorrectionPage() {
  const { holes, setHoles, imagePreview } = useGolf()

  const handleScoreChange = (holeIndex: number, newScore: number) => {
    const updatedHoles = [...holes]
    updatedHoles[holeIndex].score = newScore
    setHoles(updatedHoles)
  }

  const handleParChange = (holeIndex: number, newPar: number) => {
    const updatedHoles = [...holes]
    updatedHoles[holeIndex].par = newPar
    setHoles(updatedHoles)
  }

  // 計算ロジック
  const calculateSubtotal = (start: number, end: number) => {
    return holes.slice(start, end).reduce((sum, hole) => sum + hole.score, 0)
  }
  const calculateTotal = () => holes.reduce((sum, hole) => sum + hole.score, 0)
  const calculateTotalPar = () => holes.reduce((sum, hole) => sum + hole.par, 0)

  const outSubtotal = calculateSubtotal(0, 9)
  const inSubtotal = calculateSubtotal(9, 18)
  const totalScore = calculateTotal()
  const totalPar = calculateTotalPar()
  const overPar = totalScore - totalPar

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-3xl font-bold text-foreground">スコアカード確認</h2>
          <p className="text-muted-foreground">必要に応じてスコアとパーを編集してください</p>
        </div>

        <Card className="mb-6 overflow-hidden shadow-md">
          {imagePreview ? (
            <img src={imagePreview} alt="Uploaded scorecard" className="h-48 w-full object-cover" />
          ) : (
            <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-muted-foreground">
              画像がありません
            </div>
          )}
        </Card>

        <div className="space-y-6">
          {/* IN Course (10-18) */}
          <Card className="p-6 shadow-md">
            <h3 className="mb-4 text-xl font-bold text-foreground">IN（10-18）</h3>
            <div className="space-y-3">
              {holes.slice(9, 18).map((hole, index) => {
                const holeIndex = index + 9
                return (
                  <div key={hole.hole} className="flex items-center gap-4 rounded-lg bg-secondary/50 p-3">
                    <div className="flex w-16 items-center gap-2">
                      <span className="font-semibold text-foreground">{hole.hole}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Par</span>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={hole.par}
                        onChange={(e) => handleParChange(holeIndex, Number.parseInt(e.target.value) || 0)}
                        className="h-10 w-16 text-center text-sm"
                      />
                    </div>
                    <div className="ml-auto">
                      <Input
                        type="number"
                        min="1"
                        max="15"
                        value={hole.score}
                        onChange={(e) => handleScoreChange(holeIndex, Number.parseInt(e.target.value) || 0)}
                        className="h-12 w-20 text-center text-lg font-semibold"
                      />
                    </div>
                  </div>
                )
              })}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="font-semibold text-foreground">IN 合計</span>
                <span className="text-2xl font-bold text-primary">{inSubtotal}</span>
              </div>
            </div>
          </Card>
          
          {/* OUT Course (1-9) */}
          <Card className="p-6 shadow-md">
            <h3 className="mb-4 text-xl font-bold text-foreground">OUT（1-9）</h3>
            <div className="space-y-3">
              {holes.slice(0, 9).map((hole, index) => {
                const holeIndex = index
                return (
                  <div key={hole.hole} className="flex items-center gap-4 rounded-lg bg-secondary/50 p-3">
                    <div className="flex w-16 items-center gap-2">
                      <span className="font-semibold text-foreground">{hole.hole}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Par</span>
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={hole.par}
                        onChange={(e) => handleParChange(holeIndex, Number.parseInt(e.target.value) || 0)}
                        className="h-10 w-16 text-center text-sm"
                      />
                    </div>
                    <div className="ml-auto">
                      <Input
                        type="number"
                        min="1"
                        max="15"
                        value={hole.score}
                        onChange={(e) => handleScoreChange(holeIndex, Number.parseInt(e.target.value) || 0)}
                        className="h-12 w-20 text-center text-lg font-semibold"
                      />
                    </div>
                  </div>
                )
              })}
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="font-semibold text-foreground">OUT 合計</span>
                <span className="text-2xl font-bold text-primary">{outSubtotal}</span>
              </div>
            </div>
          </Card>

          <Card className="bg-primary p-6 text-primary-foreground shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xl font-semibold">合計スコア</span>
              <span className="text-4xl font-bold">{totalScore}</span>
            </div>
            <p className="mt-2 text-primary-foreground/80">{overPar > 0 ? `+${overPar}` : overPar} オーバー</p>
          </Card>
        </div>

        <Button
          // onClick={() => router.push("/result")} // 分析画面へ遷移
          size="lg"
          className="mt-8 h-14 w-full gap-3 rounded-full bg-accent text-lg font-semibold shadow-lg hover:bg-accent/90"
        >
          <CheckCircle2 className="h-6 w-6" />
          確認して解析
        </Button>
      </div>
    </div>
  )
}