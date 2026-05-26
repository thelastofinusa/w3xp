import React from "react"
import { Hero } from "./components/hero"
import { ProductPreview } from "./components/preview"
import { WhyW3Docs } from "./components/whyw3docs"
import { FAQs } from "./components/faqs"
import { Footer } from "./components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero />
      <ProductPreview />
      <WhyW3Docs />
      <FAQs />
      <Footer />
    </div>
  )
}
