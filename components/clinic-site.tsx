"use client"
import Image from "next/image"
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react"
import {
  Menu,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Fingerprint,
  Award,
  MessageCircle,
  Camera as Instagram,
  MapPin,
  MoveUpRight,
  ScanFace,
  Flower2,
  Shapes,
  Check,
  ZoomIn,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import {
  clinic,
  whatsappUrl,
  treatments,
  faqs,
  results,
  testimonials,
} from "@/lib/content"

type Photo = { src: string; title: string }
type Consent = "essential" | "accepted"
function track(event: string, label: string) {
  try {
    if (localStorage.getItem("gn-consent") === "accepted")
      window.dispatchEvent(
        new CustomEvent("clinic:analytics", { detail: { event, label } })
      )
  } catch {}
}
function External({
  href,
  children,
  className = "",
  event = "whatsapp",
}: {
  href: string
  children: ReactNode
  className?: string
  event?: string
}) {
  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track(event, event)}
    >
      {children}
    </a>
  )
}
function CTA({
  children = "Agendar avaliação",
  className = "",
}: {
  children?: ReactNode
  className?: string
}) {
  return (
    <External href={whatsappUrl()} className={`cta ${className}`}>
      <MessageCircle size={17} />
      {children}
    </External>
  )
}
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="eyebrow">
      <span />
      {children}
    </p>
  )
}
function Brand() {
  return (
    <a
      className="brand"
      href="#inicio"
      aria-label="Dra. Gisele Nasário — início"
    >
      <span className="monogram">GN</span>
      <span>
        Gisele Nasário<small>HARMONIZAÇÃO FACIAL E CORPORAL</small>
      </span>
    </a>
  )
}
const nav = [
  ["Início", "inicio"],
  ["Sobre", "sobre"],
  ["Tratamentos", "tratamentos"],
  ["Resultados", "resultados"],
  ["Dúvidas", "duvidas"],
  ["Contato", "contato"],
]
const editorial = [1, 2, 3, 4, 5, 6].map((n) => ({
  src: `/images/${n}.webp`,
  title: [
    "Preenchimento glúteo: o que considerar",
    "Contorno e planejamento individual",
    "Ácido hialurônico",
    "Harmonia sem exageros",
    "Antes do procedimento",
    "Cada corpo tem sua própria beleza",
  ][n - 1],
}))
export default function ClinicSite() {
  const [openFaq, setOpenFaq] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false),
    [menu, setMenu] = useState(false),
    [category, setCategory] = useState(0),
    [filter, setFilter] = useState("Todos")
  const [lightbox, setLightbox] = useState<{
      items: Photo[]
      index: number
    } | null>(null),
    [treatment, setTreatment] = useState<string[] | null>(null),
    [legal, setLegal] = useState<string | null>(null)
  const [cookies, setCookies] = useState(false),
    [consent, setConsent] = useState<Consent | null>(null),
    [formError, setFormError] = useState(""),
    [prepared, setPrepared] = useState("")
  const gallery = useRef<HTMLDivElement>(null),
    dialog = useRef<HTMLDialogElement>(null),
    origin = useRef<HTMLElement | null>(null),
    started = useRef(0),
    mobileNav = useRef<HTMLElement>(null)
  const modal = !!(lightbox || treatment || legal)
  useScrollReveal(category, filter)
  useEffect(() => {
    const scroll = () => setScrolled(window.scrollY > 35)
    scroll()
    window.addEventListener("scroll", scroll, { passive: true })
    started.current = Date.now()
    try {
      const saved = localStorage.getItem("gn-consent") as Consent | null
      setConsent(saved)
      setCookies(!saved)
    } catch {
      setCookies(true)
    }
    return () => window.removeEventListener("scroll", scroll)
  }, [])
  useEffect(() => {
    if (modal) {
      origin.current = document.activeElement as HTMLElement
      dialog.current?.showModal()
      document.body.style.overflow = "hidden"
    } else {
      dialog.current?.close()
      document.body.style.overflow = ""
      origin.current?.focus()
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [modal])
  useEffect(() => {
    if (!menu) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onResize = () => {
      if (window.innerWidth > 900) setMenu(false)
    }
    window.addEventListener("resize", onResize)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false)
        document.getElementById("menu-toggle")?.focus()
      }
      if (e.key === "Tab") {
        const els = Array.from(
          mobileNav.current?.querySelectorAll<HTMLElement>("a,button") || []
        )
        const first = document.getElementById("menu-toggle")
        const last = els.at(-1)
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      }
    }
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
      document.body.style.overflow = previousOverflow
    }
  }, [menu])
  const close = () => {
    setLightbox(null)
    setTreatment(null)
    setLegal(null)
  }
  const choose = (value: Consent) => {
    setConsent(value)
    setCookies(false)
    try {
      localStorage.setItem("gn-consent", value)
    } catch {}
  }
  const filtered = results.filter(
    (r) =>
      filter === "Todos" ||
      r.category === filter ||
      (filter === "Facial" && r.category === "Lábios")
  )
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError("")
    setPrepared("")
    const data = new FormData(e.currentTarget)
    if (data.get("website") || Date.now() - started.current < 3000) {
      setFormError("Aguarde alguns segundos e tente novamente.")
      return
    }
    const name = String(data.get("name") || "").trim(),
      phone = String(data.get("phone") || "").replace(/\D/g, "")
    if (name.length < 2) {
      setFormError("Informe seu nome com pelo menos 2 caracteres.")
      return
    }
    if (!/^\d{10,13}$/.test(phone)) {
      setFormError("Informe um WhatsApp válido com DDD.")
      return
    }
    if (!data.get("privacy")) {
      setFormError(
        "Confirme a leitura da Política de Privacidade para continuar."
      )
      return
    }
    setPrepared(
      whatsappUrl(
        `Olá, Dra. Gisele! Gostaria de agendar uma avaliação.\nNome: ${name}\nWhatsApp: ${phone}\nInteresse: ${data.get("interest")}\n${String(data.get("message") || "").trim()}`
      )
    )
  }
  return (
    <>
      <a className="skip" href="#conteudo">
        Pular para o conteúdo
      </a>
      <header className={`header ${scrolled || menu ? "solid" : ""} ${menu ? "menu-open" : ""}`}>
        <div className="header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Navegação principal">
            {nav.map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <CTA className="header-cta" />
          <button
            id="menu-toggle"
            className="menu-toggle icon-button"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-controls="mobile-nav"
            aria-label={menu ? "Fechar menu" : "Abrir menu"}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
        {menu && <button className="menu-backdrop" tabIndex={-1} aria-label="Fechar menu lateral" onClick={() => {
          setMenu(false)
          document.getElementById("menu-toggle")?.focus()
        }} />}
        {menu && (
          <nav
            ref={mobileNav}
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Navegação mobile"
          >
            {nav.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenu(false)}>
                {label}
              </a>
            ))}
            <CTA />
          </nav>
        )}
      </header>
      <main id="conteudo">
        <section className="hero" id="inicio">
          <div className="hero-photo">
            <Image
              src="/images/dra1.webp"
              alt="Dra. Gisele Nasário em retrato profissional, vestindo um blazer marrom"
              fill
              preload
              sizes="(max-width: 700px) 100vw, 60vw"
            />
          </div>
          <div className="hero-shade" />
          <div className="hero-content wrap">
            <Eyebrow>Harmonização facial e corporal em Curitiba</Eyebrow>
            <h1>
              Beleza com
              <br />
              <em>propósito,</em>
              <br />
              técnica e naturalidade<span>.</span>
            </h1>
            <p className="hero-description">
              Tratamentos personalizados para valorizar seus traços, respeitar
              sua identidade e elevar sua autoestima.
            </p>
            <div className="hero-actions">
              <CTA>Agendar minha avaliação</CTA>
              <a className="text-link" href="#tratamentos">
                Conhecer tratamentos <MoveUpRight size={16} />
              </a>
            </div>
            <p className="hero-credentials">
              Farmacêutica bioquímica <span>•</span> Pós-graduada em
              harmonização
              <br />
              Mais de 13 anos de experiência
            </p>
          </div>
          <div className="hero-bottom">
            <span>BELEZA QUE RESPEITA A SUA ESSÊNCIA</span>
            <a href="#sobre">
              Explore o cuidado <span>↓</span>
            </a>
          </div>
          <span className="hero-side">CURITIBA · PARANÁ</span>
        </section>
        <section className="differences" aria-label="Nossos diferenciais">
          <div className="wrap differences-grid">
            {[
              [Award, "Mais de 13 anos", "de experiência"],
              [Fingerprint, "Planejamento", "individualizado"],
              [ShieldCheck, "Técnica", "e segurança"],
              [Flower2, "Resultados", "naturais"],
            ].map(([Icon, a, b], i) => {
              const I = Icon as typeof Award
              return (
                <div key={i}>
                  <I strokeWidth={1.2} />
                  <p>
                    {a as string}
                    <span>{b as string}</span>
                  </p>
                </div>
              )
            })}
          </div>
        </section>
        <section className="about section wrap" id="sobre">
          <div className="about-visual">
            <div className="about-photo">
              <Image
                src="/images/quemsou.webp"
                alt="Dra. Gisele: ver o brilho no olhar de quem se redescobre no espelho"
                width={1170}
                height={1463}
                sizes="(max-width: 768px) 90vw, 42vw"
              />
            </div>
            <div className="experience-seal">
              <strong>
                13<span>+</span>
              </strong>
              <span>
                ANOS DE CUIDADO
                <br />E DEDICAÇÃO
              </span>
            </div>
            <span className="image-caption">
              CONHECIMENTO, SENSIBILIDADE E PROPÓSITO.
            </span>
          </div>
          <div className="about-copy">
            <Eyebrow>Um olhar único para você</Eyebrow>
            <h2>
              Conheça a<br />
              Dra. <em>Gisele.</em>
            </h2>
            <p>
              Sou farmacêutica bioquímica, pós-graduada em harmonização facial e
              corporal, e atuo há mais de 13 anos ajudando pessoas a se
              reconectarem com a própria beleza.
            </p>
            <p>
              Meu trabalho parte de uma avaliação cuidadosa e de um planejamento
              individualizado. Cada rosto e cada corpo possuem características
              únicas, por isso os procedimentos devem respeitar a identidade, as
              proporções e os objetivos de cada paciente.
            </p>
            <p>
              Além dos atendimentos, compartilho minha experiência como mentora
              de profissionais da área de harmonização. Para mim, beleza com
              propósito significa unir conhecimento, cuidado e resultados que
              façam sentido para cada pessoa.
            </p>
            <blockquote>
              “O que eu mais amo no meu trabalho é ver o brilho no olhar de quem
              se redescobre no espelho.”
            </blockquote>
            <a href="#contato" className="text-link dark">
              Vamos conversar sobre você <MoveUpRight size={16} />
            </a>
          </div>
        </section>
        <section className="treatments section" id="tratamentos">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <Eyebrow>Cuidado em cada detalhe</Eyebrow>
                <h2>
                  Por onde você
                  <br />
                  deseja <em>começar?</em>
                </h2>
              </div>
              <p>
                Cada tratamento é indicado após
                <br />
                uma avaliação individualizada.
              </p>
            </div>
            <div
              className="tabs"
              role="tablist"
              aria-label="Categorias de tratamentos"
            >
              {treatments.map((t, i) => (
                <button
                  key={t.category}
                  id={`tab-${i}`}
                  role="tab"
                  aria-selected={category === i}
                  aria-controls="treatment-panel"
                  tabIndex={category === i ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                      e.preventDefault()
                      const n = (i + (e.key === "ArrowRight" ? 1 : 2)) % 3
                      setCategory(n)
                      document.getElementById(`tab-${n}`)?.focus()
                    }
                  }}
                  onClick={() => setCategory(i)}
                >
                  <span>0{i + 1}</span>
                  {t.category}
                </button>
              ))}
            </div>
            <div
              className="treatment-grid"
              id="treatment-panel"
              role="tabpanel"
              aria-labelledby={`tab-${category}`}
            >
              {treatments[category].items.map((t, i) => {
                const Icon = [ScanFace, Flower2, Shapes][category]
                return (
                  <article className="treatment-card" key={t[0]}>
                    <div className="card-top">
                      <Icon size={35} strokeWidth={1} />
                      <span>0{i + 1}</span>
                    </div>
                    <h3>{t[0]}</h3>
                    <p>{t[1]}</p>
                    <button
                      className="text-link dark"
                      onClick={() => {
                        track("treatment", t[0])
                        setTreatment(t)
                      }}
                      aria-label={`Saiba mais sobre ${t[0]}`}
                    >
                      Saiba mais <Plus size={16} />
                    </button>
                    <External
                      className="card-book"
                      href={whatsappUrl(
                        `Olá, Dra. Gisele! Gostaria de agendar uma avaliação sobre ${t[0].toLowerCase()}.`
                      )}
                    >
                      Agendar avaliação
                    </External>
                  </article>
                )
              })}
            </div>
            <p className="section-note">
              Sua identidade é o ponto de partida. O planejamento vem depois.
            </p>
          </div>
        </section>
        <section className="body-section section">
          <div className="wrap body-layout">
            <div>
              <Eyebrow>Harmonização corporal</Eyebrow>
              <h2>
                Contorno, projeção
                <br />e equilíbrio com
                <br />
                <em>planejamento.</em>
              </h2>
              <p>
                O preenchimento glúteo com ácido hialurônico pode ser uma opção
                para quem deseja trabalhar volume, contorno e pequenas
                assimetrias. A indicação depende de uma avaliação cuidadosa das
                proporções corporais, dos objetivos e das necessidades de cada
                paciente.
              </p>
              <ul className="check-list">
                {[
                  "Formato dos glúteos",
                  "Regiões que podem ser valorizadas",
                  "Resultado desejado",
                  "Indicação e segurança para cada caso",
                ].map((x) => (
                  <li key={x}>
                    <Check size={16} />
                    {x}
                  </li>
                ))}
              </ul>
              <CTA>Quero entender se é indicado para mim</CTA>
            </div>
            <div className="editorial-gallery">
              <div
                className="carousel"
                ref={gallery}
                aria-label="Conteúdos sobre preenchimento glúteo"
              >
                {editorial.map((photo, i) => (
                  <button
                    key={photo.src}
                    className="editorial-card"
                    onClick={() => setLightbox({ items: editorial, index: i })}
                    aria-label={`Ampliar: ${photo.title}`}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.title}
                      width={1080}
                      height={1350}
                      sizes="(max-width: 768px) 78vw, 32vw"
                    />
                    <span>
                      <ZoomIn size={16} /> Ampliar conteúdo
                    </span>
                  </button>
                ))}
              </div>
              <div className="carousel-controls">
                <span>
                  Um bom resultado não precisa
                  <br />
                  parecer exagerado.
                </span>
                <div>
                  <button
                    className="icon-button"
                    aria-label="Conteúdo anterior"
                    onClick={() =>
                      gallery.current?.scrollBy({
                        left: -340,
                        behavior: "smooth",
                      })
                    }
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Próximo conteúdo"
                    onClick={() =>
                      gallery.current?.scrollBy({
                        left: 340,
                        behavior: "smooth",
                      })
                    }
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="results section wrap" id="resultados">
          <div className="center-heading">
            <Eyebrow>Beleza real. Cuidado individual.</Eyebrow>
            <h2>
              Resultados que preservam
              <br />a sua <em>essência.</em>
            </h2>
            <p>
              Planejamento individualizado para resultados sutis,
              <br />
              equilibrados e compatíveis com cada anatomia.
            </p>
          </div>
          <div className="filters" aria-label="Filtrar resultados">
            {["Todos", "Lábios", "Facial", "Corporal"].map((f) => (
              <Button
                key={f}
                variant="ghost"
                className={filter === f ? "active" : ""}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f}
              </Button>
            ))}
          </div>
          <div className="result-grid">
            {filtered.map((r, i) => (
              <button
                className="result-card"
                key={r.src}
                onClick={() => setLightbox({ items: filtered, index: i })}
                aria-label={`Ampliar resultado ${i + 1}: ${r.title}`}
              >
                <div className="result-image">
                  <Image
                    src={r.src}
                    alt={`Registro comparativo de ${r.title.toLowerCase()}, com antes e depois e créditos originais`}
                    width={1170}
                    height={1560}
                    sizes="(max-width: 600px) 90vw, (max-width: 1000px) 45vw, 30vw"
                  />
                  <span className="zoom">
                    <ZoomIn size={19} />
                  </span>
                </div>
                <span className="result-label">
                  {r.title}
                  <Plus size={18} />
                </span>
              </button>
            ))}
          </div>
          <p className="result-disclaimer">
            <ShieldCheck size={18} /> Resultados são individuais e podem variar.
            As imagens são publicadas mediante autorização.
          </p>
        </section>
        {testimonials.length > 0 && (
          <section className="section wrap">
            <h2>Experiências de quem escolheu se cuidar</h2>
            {testimonials.map((t) => (
              <blockquote key={t.name}>
                {t.text}
                <cite>{t.name}</cite>
              </blockquote>
            ))}
          </section>
        )}
        <section className="manifesto">
          <div className="wrap">
            <span className="quote-mark">“</span>
            <h2>
              A beleza com propósito
              <br />
              vai muito além <em>do que se vê.</em>
            </h2>
            <p>DRA. GISELE NASÁRIO</p>
            <Flower2 size={38} strokeWidth={1} />
          </div>
        </section>
        <section className="process section wrap">
          <div className="center-heading">
            <Eyebrow>Um cuidado que começa na escuta</Eyebrow>
            <h2>
              Seu tratamento começa com
              <br />
              uma avaliação <em>cuidadosa.</em>
            </h2>
          </div>
          <div className="steps">
            {[
              [
                "Escuta",
                "Entendemos suas necessidades, expectativas e o que deseja valorizar.",
              ],
              [
                "Avaliação",
                "Analisamos características faciais ou corporais, proporções e histórico.",
              ],
              [
                "Planejamento",
                "Definimos uma proposta personalizada, respeitando sua identidade.",
              ],
              [
                "Acompanhamento",
                "Orientamos os cuidados e acompanhamos sua evolução.",
              ],
            ].map(([title, text], i) => (
              <article key={title}>
                <span className="step-number">0{i + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="faq section" id="duvidas">
          <div className="wrap faq-layout">
            <div>
              <Eyebrow>Decidir com tranquilidade</Eyebrow>
              <h2>
                Espaço para
                <br />
                suas <em>dúvidas.</em>
              </h2>
              <p>
                Informação também é cuidado.
                <br />
                Converse sobre o que é importante para você.
              </p>
              <CTA>Conversar com a clínica</CTA>
            </div>
            <div className="accordion">
              {faqs.map(([q, a]) => (
                <details key={q} open={openFaq === q}>
                  <summary onClick={(event) => {
                    event.preventDefault()
                    setOpenFaq(current => current === q ? null : q)
                  }}>
                    {q}
                    <Plus size={18} />
                  </summary>
                  <p>{a}</p>
                </details>
              ))}
              <p className="faq-note">
                Conteúdo informativo. Não substitui uma avaliação e orientação
                profissional.
              </p>
            </div>
          </div>
        </section>
        <section className="final-cta">
          <div className="wrap">
            <Eyebrow>Seu próximo passo, no seu tempo</Eyebrow>
            <h2>
              Sua beleza merece um planejamento
              <br />
              tão <em>único quanto você.</em>
            </h2>
            <p>
              Agende sua avaliação e descubra quais tratamentos
              <br />
              fazem sentido para seus objetivos.
            </p>
            <div className="final-actions">
              <CTA>Agendar avaliação pelo WhatsApp</CTA>
              <External
                href={clinic.maps}
                event="location"
                className="text-link"
              >
                Ver localização <MapPin size={17} />
              </External>
            </div>
          </div>
        </section>
        <section className="contact section wrap" id="contato">
          <div>
            <Eyebrow>Será um prazer receber você</Eyebrow>
            <h2>
              Vamos cuidar
              <br />
              da sua <em>beleza?</em>
            </h2>
            <p>
              Um espaço para conversar sobre seus objetivos
              <br />e encontrar o cuidado que faz sentido para você.
            </p>
            <div className="contact-line">
              <MapPin />
              <div>
                <strong>Em Curitiba, pertinho de você</strong>
                <address>
                  Travessa Nestor de Castro, 247
                  <br />
                  Centro, Curitiba – PR · CEP 80020-120
                </address>
                <External
                  href={clinic.maps}
                  event="location"
                  className="text-link dark"
                >
                  Abrir no Google Maps <MoveUpRight size={15} />
                </External>
              </div>
            </div>
            <div className="contact-line">
              <MessageCircle />
              <div>
                <strong>Agendamentos e informações</strong>
                <External href={whatsappUrl()}>{clinic.phone}</External>
                <span>
                  {clinic.hours || "Consulte os horários pelo WhatsApp."}
                </span>
              </div>
            </div>
            <div className="contact-line">
              <Instagram />
              <div>
                <strong>Acompanhe nosso trabalho</strong>
                <External href={clinic.instagram} event="instagram">
                  @dra.giselenasario
                </External>
              </div>
            </div>
          </div>
          <form
            className="contact-form"
            onSubmit={submit}
            onChange={() => setPrepared("")}
          >
            <h3>Seu cuidado começa aqui.</h3>
            <p>Preencha e continue a conversa pelo WhatsApp.</p>
            <label htmlFor="name">Seu nome</label>
            <input
              id="name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              placeholder="Como podemos chamar você?"
            />
            <label htmlFor="phone">WhatsApp com DDD</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              maxLength={20}
              placeholder="(41) 99999-9999"
            />
            <label htmlFor="interest">Tratamento de interesse</label>
            <select id="interest" name="interest" required>
              <option value="">Selecione uma opção</option>
              <option>Ainda não sei, quero uma avaliação</option>
              <option>Harmonização facial</option>
              <option>Rejuvenescimento</option>
              <option>Harmonização corporal</option>
              <option>Preenchimento labial</option>
              <option>Preenchimento glúteo</option>
            </select>
            <label htmlFor="message">
              Mensagem <span>(opcional)</span>
            </label>
            <textarea
              id="message"
              name="message"
              maxLength={600}
              rows={3}
              placeholder="Conte como podemos ajudar."
            />
            <small>Não inclua informações médicas ou dados sensíveis.</small>
            <div className="honeypot" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <label className="consent">
              <input type="checkbox" name="privacy" required />
              <span>
                Li a{" "}
                <button type="button" onClick={() => setLegal("privacidade")}>
                  Política de Privacidade
                </button>{" "}
                e autorizo o uso dos dados para responder ao meu contato.
              </span>
            </label>
            {formError && (
              <p role="alert" className="form-error">
                {formError}
              </p>
            )}
            <Button type="submit" className="cta form-submit">
              Preparar mensagem <MessageCircle size={17} />
            </Button>
            {prepared && (
              <div className="form-success" role="status">
                <p>
                  Mensagem pronta. Você poderá revisá-la no WhatsApp antes de
                  enviar.
                </p>
                <External href={prepared} className="text-link dark">
                  Continuar no WhatsApp <MoveUpRight size={16} />
                </External>
              </div>
            )}
          </form>
        </section>
      </main>
      <footer>
        <div className="wrap footer-top">
          <div>
            <Brand />
            <p>
              Beleza com propósito.
              <br />
              Cuidado que respeita quem você é.
            </p>
            {clinic.registration && <p>{clinic.registration}</p>}
          </div>
          <nav aria-label="Navegação do rodapé">
            {nav.slice(1).map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="footer-location">
            <span>CURITIBA · PARANÁ</span>
            <p>
              Travessa Nestor de Castro, 247
              <br />
              Centro · CEP 80020-120
            </p>
            <External href={clinic.instagram} event="instagram">
              <Instagram size={18} /> @dra.giselenasario
            </External>
          </div>
        </div>
        <div className="wrap footer-bottom">
          <span>
            © {new Date().getFullYear()} Dra. Gisele Nasário. Todos os direitos
            reservados.
          </span>
          <div>
            <button onClick={() => setLegal("privacidade")}>
              Política de Privacidade
            </button>
            <button onClick={() => setLegal("termos")}>Termos de Uso</button>
            <button onClick={() => setCookies(true)}>Cookies</button>
          </div>
        </div>
      </footer>
      <External href={whatsappUrl()} className="floating-wa">
        <span className="sr-only">
          Agendar uma avaliação com a Dra. Gisele Nasário pelo WhatsApp
        </span>
        <MessageCircle size={25} />
      </External>
      {cookies && (
        <aside className="cookie-banner" aria-label="Preferências de cookies">
          <div>
            <strong>Sua privacidade importa.</strong>
            <p>
              Guardamos sua preferência neste navegador. Você decide se permite
              eventos anônimos de navegação. Nenhum rastreador externo está
              ativo.{" "}
              <button onClick={() => setLegal("privacidade")}>
                Saiba mais
              </button>
            </p>
          </div>
          <div className="cookie-actions">
            <Button variant="outline" onClick={() => choose("essential")}>
              Somente essenciais
            </Button>
            <Button onClick={() => choose("accepted")}>
              Aceitar opcionais
            </Button>
            {consent && (
              <button
                className="icon-button"
                aria-label="Fechar preferências"
                onClick={() => setCookies(false)}
              >
                <X size={18} />
              </button>
            )}
          </div>
        </aside>
      )}
      <dialog
        ref={dialog}
        className={lightbox ? "modal lightbox" : "modal"}
        aria-labelledby="modal-title"
        onCancel={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
        onKeyDown={(e) => {
          if (lightbox && (e.key === "ArrowRight" || e.key === "ArrowLeft")) {
            e.preventDefault()
            setLightbox({
              ...lightbox,
              index:
                (lightbox.index +
                  (e.key === "ArrowRight" ? 1 : lightbox.items.length - 1)) %
                lightbox.items.length,
            })
          }
        }}
      >
        <button
          autoFocus
          className="modal-close icon-button"
          aria-label="Fechar janela"
          onClick={close}
        >
          <X />
        </button>
        {lightbox ? (
          <>
            <h2 id="modal-title">{lightbox.items[lightbox.index].title}</h2>
            <div className="lightbox-image">
              <Image
                src={lightbox.items[lightbox.index].src}
                alt={
                  lightbox.items[lightbox.index].title +
                  " — imagem completa, sem cortes"
                }
                width={1170}
                height={1560}
                sizes="90vw"
              />
            </div>
            <div className="lightbox-controls">
              <button
                className="icon-button"
                aria-label="Imagem anterior"
                onClick={() =>
                  setLightbox({
                    ...lightbox,
                    index:
                      (lightbox.index + lightbox.items.length - 1) %
                      lightbox.items.length,
                  })
                }
              >
                <ChevronLeft />
              </button>
              <span aria-live="polite">
                {lightbox.index + 1} / {lightbox.items.length}
              </span>
              <button
                className="icon-button"
                aria-label="Próxima imagem"
                onClick={() =>
                  setLightbox({
                    ...lightbox,
                    index: (lightbox.index + 1) % lightbox.items.length,
                  })
                }
              >
                <ChevronRight />
              </button>
            </div>
          </>
        ) : treatment ? (
          <>
            <Eyebrow>Planejado para você</Eyebrow>
            <h2 id="modal-title">{treatment[0]}</h2>
            <p>{treatment[1]}</p>
            <p>
              Na avaliação, conversamos sobre seus objetivos, histórico,
              alternativas e expectativas. A indicação, o número de sessões e a
              durabilidade variam para cada pessoa.
            </p>
            <p>
              Todo procedimento pode envolver riscos e contraindicações. Os
              cuidados e limites serão explicados pela profissional antes de
              qualquer decisão.
            </p>
            <CTA>Agendar minha avaliação</CTA>
          </>
        ) : legal ? (
          <>
            <Eyebrow>Transparência e cuidado</Eyebrow>
            <h2 id="modal-title">
              {legal === "privacidade"
                ? "Política de Privacidade"
                : "Termos de Uso"}
            </h2>
            {legal === "privacidade" ? (
              <>
                <p>
                  Este site apresenta o trabalho da Dra. Gisele Nasário. O
                  formulário prepara uma mensagem no seu navegador: não envia
                  nem armazena seus dados em um banco de dados do site.
                </p>
                <h3>Seu contato</h3>
                <p>
                  Nome, WhatsApp, interesse e mensagem são encaminhados ao
                  WhatsApp somente quando você decide continuar e enviar. São
                  utilizados para responder ao seu pedido e organizar o
                  atendimento. Evite compartilhar informações médicas neste
                  formulário.
                </p>
                <h3>Preferências e serviços externos</h3>
                <p>
                  Usamos o armazenamento local para lembrar sua escolha de
                  privacidade. Os eventos de cliques só são disponibilizados à
                  integração de métricas com sua autorização. Nenhum provedor de
                  analytics está instalado nesta versão. Você pode rever a
                  escolha em “Cookies”, no rodapé.
                </p>
                <p>
                  Ao abrir WhatsApp, Instagram ou Google Maps, passam a valer as
                  políticas desses serviços. Não carregamos mapas ou
                  rastreadores externos automaticamente.
                </p>
                <h3>Seus direitos</h3>
                <p>
                  Para solicitar informações, acesso, correção ou exclusão dos
                  dados de atendimento, ou revogar seu consentimento, contate a
                  clínica pelo WhatsApp {clinic.phone}. A retenção dos dados de
                  atendimento deve observar as obrigações aplicáveis à
                  atividade.
                </p>
              </>
            ) : (
              <>
                <p>
                  As informações deste site têm finalidade institucional e
                  educativa. Não substituem consulta, diagnóstico ou orientação
                  individualizada.
                </p>
                <p>
                  Tratamentos dependem de avaliação profissional, possuem riscos
                  e contraindicações. Resultados, durabilidade e número de
                  sessões variam; imagens não representam promessa ou garantia
                  de resultado.
                </p>
                <p>
                  O contato pelo WhatsApp é uma solicitação de agendamento. A
                  data e o horário dependem de confirmação pela clínica. Não
                  utilize este canal para emergências.
                </p>
                <p>
                  As imagens e os conteúdos não podem ser reutilizados sem
                  autorização de seus titulares.
                </p>
              </>
            )}
          </>
        ) : null}
      </dialog>
    </>
  )
}
