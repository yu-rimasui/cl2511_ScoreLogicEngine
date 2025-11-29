"use client"

import { useState } from "react"
import { Camera, Loader2, CheckCircle2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Screen = "home" | "loading" | "correction" | "analysis"

interface HoleData {
  hole: number
  par: number
  score: number
}

const mockScorecard: HoleData[] = [
  // OUT Course (1-9)
  { hole: 1, par: 4, score: 4 },
  { hole: 2, par: 4, score: 4 },
  { hole: 3, par: 5, score: 5 },
  { hole: 4, par: 4, score: 4 },
  { hole: 5, par: 3, score: 3 },
  { hole: 6, par: 5, score: 9 },
  { hole: 7, par: 4, score: 6 },
  { hole: 8, par: 3, score: 3 },
  { hole: 9, par: 4, score: 5 },
  // IN Course (10-18)
  { hole: 10, par: 4, score: 7 },
  { hole: 11, par: 4, score: 5 },
  { hole: 12, par: 3, score: 4 },
  { hole: 13, par: 5, score: 6 },
  { hole: 14, par: 4, score: 4 },
  { hole: 15, par: 4, score: 6 },
  { hole: 16, par: 3, score: 4 },
  { hole: 17, par: 5, score: 6 },
  { hole: 18, par: 4, score: 5 },
]

export default function GolfAIPartner() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("home")
  const [holes, setHoles] = useState<HoleData[]>(mockScorecard)

  const handleUpload = () => {
    setCurrentScreen("loading")
    setTimeout(() => {
      setCurrentScreen("correction")
    }, 2000)
  }

  const handleScoreChange = (holeIndex: number, newScore: number) => {
    const updatedHoles = [...holes]
    updatedHoles[holeIndex].score = newScore
    setHoles(updatedHoles)
  }

  const calculateSubtotal = (start: number, end: number) => {
    return holes.slice(start, end).reduce((sum, hole) => sum + hole.score, 0)
  }

  const calculateTotal = () => {
    return holes.reduce((sum, hole) => sum + hole.score, 0)
  }

  const calculateTotalPar = () => {
    return holes.reduce((sum, hole) => sum + hole.par, 0)
  }

  const outSubtotal = calculateSubtotal(0, 9)
  const inSubtotal = calculateSubtotal(9, 18)
  const totalScore = calculateTotal()
  const totalPar = calculateTotalPar()
  const overPar = totalScore - totalPar

  return (
    <div className="min-h-screen bg-background">
      {/* Home Screen */}
      {currentScreen === "home" && (
        <div className="flex min-h-screen flex-col">
          {/* Hero Section */}
          <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-12">
            <div className="mb-8 text-center">
              <h1 className="mb-3 font-serif text-5xl font-bold tracking-tight text-foreground text-balance md:text-6xl">
                Golf AI Analysis
              </h1>
              <p className="text-lg text-muted-foreground text-balance md:text-xl">
                Analyze your game with AI-powered insights
              </p>
            </div>

            {/* Hero Visual - Golf Course Image */}
            <div className="mb-12 w-full max-w-md overflow-hidden rounded-2xl shadow-lg">
              <img src="/scenic-golf-course-with-green-fairway.jpg" alt="Golf course" className="h-[300px] w-full object-cover" />
            </div>

            {/* Primary CTA */}
            <Button
              onClick={handleUpload}
              size="lg"
              className="h-14 gap-3 rounded-full bg-primary px-8 text-lg font-semibold shadow-xl hover:bg-primary/90"
            >
              <Camera className="h-6 w-6" />
              Camera / Upload Scorecard
            </Button>
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {currentScreen === "loading" && (
        <div className="flex min-h-screen flex-col items-center justify-center px-6">
          <div className="text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-foreground">Analyzing Scorecard</h2>
            <p className="text-muted-foreground">AI is processing your scorecard...</p>
          </div>
        </div>
      )}

      {/* Correction & Confirmation Screen */}
      {currentScreen === "correction" && (
        <div className="min-h-screen px-4 py-6">
          <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="mb-2 text-3xl font-bold text-foreground">Confirm Your Scorecard</h2>
              <p className="text-muted-foreground">Review and edit your scores if needed</p>
            </div>

            {/* Image Placeholder */}
            <Card className="mb-6 overflow-hidden shadow-md">
              <img src="/golf-scorecard-photo.jpg" alt="Uploaded scorecard" className="h-48 w-full object-cover" />
            </Card>

            {/* Scorecard Form */}
            <div className="space-y-6">
              {/* OUT Course (1-9) */}
              <Card className="p-6 shadow-md">
                <h3 className="mb-4 text-xl font-bold text-foreground">OUT (1-9)</h3>
                <div className="space-y-3">
                  {holes.slice(0, 9).map((hole, index) => (
                    <div key={hole.hole} className="flex items-center gap-4 rounded-lg bg-secondary/50 p-3">
                      <div className="flex w-16 items-center gap-2">
                        <span className="font-semibold text-foreground">{hole.hole}</span>
                        <span className="text-sm text-muted-foreground">Par {hole.par}</span>
                      </div>
                      <Input
                        type="number"
                        min="1"
                        max="15"
                        value={hole.score}
                        onChange={(e) => handleScoreChange(index, Number.parseInt(e.target.value) || 0)}
                        className="h-12 w-20 text-center text-lg font-semibold"
                      />
                    </div>
                  ))}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="font-semibold text-foreground">OUT Total</span>
                    <span className="text-2xl font-bold text-primary">{outSubtotal}</span>
                  </div>
                </div>
              </Card>

              {/* IN Course (10-18) */}
              <Card className="p-6 shadow-md">
                <h3 className="mb-4 text-xl font-bold text-foreground">IN (10-18)</h3>
                <div className="space-y-3">
                  {holes.slice(9, 18).map((hole, index) => (
                    <div key={hole.hole} className="flex items-center gap-4 rounded-lg bg-secondary/50 p-3">
                      <div className="flex w-16 items-center gap-2">
                        <span className="font-semibold text-foreground">{hole.hole}</span>
                        <span className="text-sm text-muted-foreground">Par {hole.par}</span>
                      </div>
                      <Input
                        type="number"
                        min="1"
                        max="15"
                        value={hole.score}
                        onChange={(e) => handleScoreChange(index + 9, Number.parseInt(e.target.value) || 0)}
                        className="h-12 w-20 text-center text-lg font-semibold"
                      />
                    </div>
                  ))}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="font-semibold text-foreground">IN Total</span>
                    <span className="text-2xl font-bold text-primary">{inSubtotal}</span>
                  </div>
                </div>
              </Card>

              {/* Grand Total */}
              <Card className="bg-primary p-6 text-primary-foreground shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-semibold">Total Score</span>
                  <span className="text-4xl font-bold">{totalScore}</span>
                </div>
                <p className="mt-2 text-primary-foreground/80">{overPar > 0 ? `+${overPar}` : overPar} over par</p>
              </Card>
            </div>

            {/* Confirm Button */}
            <Button
              onClick={() => setCurrentScreen("analysis")}
              size="lg"
              className="mt-8 h-14 w-full gap-3 rounded-full bg-accent text-lg font-semibold shadow-lg hover:bg-accent/90"
            >
              <CheckCircle2 className="h-6 w-6" />
              Confirm & Analyze
            </Button>
          </div>
        </div>
      )}

      {/* Analysis Result Screen */}
      {currentScreen === "analysis" && (
        <div className="min-h-screen px-4 py-6">
          <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="mb-8 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="mb-2 text-3xl font-bold text-foreground">Analysis Complete</h2>
              <p className="text-muted-foreground">Here's your performance breakdown</p>
            </div>

            {/* Score Summary */}
            <Card className="mb-6 bg-primary p-8 text-center text-primary-foreground shadow-lg">
              <p className="mb-2 text-sm font-medium uppercase tracking-wide text-primary-foreground/80">Total Score</p>
              <p className="mb-1 text-6xl font-bold">{totalScore}</p>
              <p className="text-xl text-primary-foreground/90">({overPar > 0 ? `+${overPar}` : overPar})</p>
            </Card>

            {/* AI Advice Card */}
            <Card className="mb-6 p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-foreground">AI Analysis & Tips</h3>
              <div className="space-y-3 text-foreground/90 leading-relaxed">
                <p>
                  <strong className="text-foreground">Great game!</strong> Your putting on the OUT course was solid,
                  particularly on holes 1-5 where you played close to par.
                </p>
                <p>
                  However, you struggled with the driver on <strong className="text-destructive">Hole 6 & 10</strong>,
                  where you went significantly over par. Let's focus on tee-shot stability in your next practice
                  session.
                </p>
                <p>
                  <strong className="text-foreground">Key Insights:</strong>
                </p>
                <ul className="ml-6 list-disc space-y-1 text-muted-foreground">
                  <li>Par 3 performance: Solid with minimal over-par shots</li>
                  <li>Par 5 challenges: Consider course management strategy</li>
                  <li>Back 9 consistency: Good recovery after hole 10</li>
                </ul>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                size="lg"
                className="h-14 w-full gap-3 rounded-full bg-accent text-lg font-semibold shadow-lg hover:bg-accent/90"
              >
                <Send className="h-5 w-5" />
                Send Report to LINE
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setCurrentScreen("home")}
                className="h-14 w-full rounded-full border-2 text-lg font-semibold"
              >
                Analyze Another Scorecard
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
