"use client"

import { useEffect } from "react"

const targets = [
  ".differences-grid > div", ".about-visual", ".about-copy",
  ".section-heading", ".tabs", ".treatment-card", ".section-note",
  ".body-layout > div", ".center-heading", ".filters", ".result-card",
  ".result-disclaimer", ".manifesto .wrap", ".steps article",
  ".faq-layout > div:first-child", ".accordion details", ".faq-note",
  ".final-cta .wrap", ".contact > div", ".contact-form",
].map(selector => `main ${selector}`).join(",")

export function useScrollReveal(category: number, filter: string) {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(".hero")
    if (!hero) return
    let secondFrame = 0
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        hero.dataset.entrance = "ready"
      })
    })
    return () => {
      cancelAnimationFrame(firstFrame)
      cancelAnimationFrame(secondFrame)
      delete hero.dataset.entrance
    }
  }, [])
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let observer: IntersectionObserver | undefined
    const elements = Array.from(document.querySelectorAll<HTMLElement>(targets))
    const show = (element: HTMLElement) => {
      element.dataset.reveal = "visible"
    }
    const reset = () => {
      observer?.disconnect()
      elements.forEach(element => {
        delete element.dataset.reveal
        element.style.removeProperty("--reveal-delay")
      })
    }
    const setup = () => {
      reset()
      // Reduced motion retains opacity-only fades; CSS removes all translation.
      if (!("IntersectionObserver" in window)) return
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const element = entry.target as HTMLElement
          if (entry.isIntersecting || element.contains(document.activeElement)) {
            show(element)
          } else {
            // Re-arm outside the viewport so the entrance also works on return.
            element.dataset.reveal = "pending"
          }
        })
      }, { threshold: 0, rootMargin: "0px 0px -64px 0px" })
      elements.forEach(element => {
        const rect = element.getBoundingClientRect()
        const siblings = Array.from(element.parentElement?.children ?? [])
        const stagger = element.matches(".treatment-card, .result-card, .steps article, .differences-grid > div")
          ? (siblings.indexOf(element) % 3) * 65 : 0
        element.style.setProperty("--reveal-delay", `${stagger}ms`)
        // Never hide content already being read when filters or tabs change.
        element.dataset.reveal = rect.top < window.innerHeight - 64 && rect.bottom > 0
          ? "visible" : "pending"
        observer?.observe(element)
      })
    }
    const onFocus = (event: FocusEvent) => {
      if (event.target instanceof Element) {
        const element = event.target.closest<HTMLElement>('[data-reveal="pending"]')
        if (element) show(element)
      }
    }
    setup()
    motion.addEventListener("change", setup)
    document.addEventListener("focusin", onFocus)
    return () => {
      reset()
      motion.removeEventListener("change", setup)
      document.removeEventListener("focusin", onFocus)
    }
  }, [category, filter])
}
