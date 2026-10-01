export const clinic = {
  name: "Dra. Gisele Nasário",
  phone: "+55 41 9776-3995",
  whatsapp: "554197763995",
  instagram: "https://www.instagram.com/dra.giselenasario/",
  maps: "https://www.google.com/maps/search/?api=1&query=Travessa+Nestor+de+Castro+247+Centro+Curitiba+PR+80020-120",
  // Preencher somente com informações confirmadas pela profissional.
  registration: "",
  hours: "",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "",
}
export const whatsappUrl = (
  message = "Olá, Dra. Gisele! Gostaria de agendar uma avaliação."
) => `https://wa.me/${clinic.whatsapp}?text=${encodeURIComponent(message)}`
export const treatments = [
  {
    category: "Harmonização facial",
    intro: "Seus traços, em harmonia.",
    items: [
      [
        "Preenchimento labial",
        "Planejamento de volume e definição, respeitando as proporções dos seus lábios.",
      ],
      [
        "Preenchimento de mento",
        "Avaliação da projeção do queixo e de sua relação com o perfil facial.",
      ],
      [
        "Tratamento de olheiras",
        "Um olhar individual para as características da região abaixo dos olhos.",
      ],
      [
        "Harmonização facial",
        "Um planejamento integrado que considera o rosto como um todo.",
      ],
      [
        "Contorno e equilíbrio facial",
        "Valorização das proporções e dos contornos, preservando sua identidade.",
      ],
    ],
  },
  {
    category: "Rejuvenescimento",
    intro: "Cuidado que acompanha você.",
    items: [
      [
        "Toxina botulínica",
        "Avaliação das linhas de expressão e da dinâmica muscular de cada rosto.",
      ],
      [
        "Bioestimuladores de colágeno",
        "Estratégias para estimular colágeno conforme as necessidades da pele.",
      ],
      [
        "Fios de PDO",
        "Uma possibilidade a ser avaliada de acordo com as características dos tecidos.",
      ],
      [
        "Tratamentos para qualidade da pele",
        "Cuidados personalizados para textura e aparência da pele.",
      ],
    ],
  },
  {
    category: "Harmonização corporal",
    intro: "Sua essência em cada curva.",
    items: [
      [
        "Harmonização glútea",
        "Planejamento que considera formato, proporções e objetivos individuais.",
      ],
      [
        "Preenchimento glúteo com ácido hialurônico",
        "Avaliação de volume, contorno e pequenas assimetrias da região glútea.",
      ],
      [
        "Tratamentos para contorno corporal",
        "Um olhar cuidadoso para as proporções e particularidades do seu corpo.",
      ],
    ],
  },
]
export const faqs = [
  [
    "Como saber qual tratamento é indicado para mim?",
    "A indicação depende de uma avaliação individual. Na consulta, conversamos sobre seus objetivos, características e histórico para entender as possibilidades, os limites e os riscos de cada opção.",
  ],
  [
    "Os resultados ficam naturais?",
    "A naturalidade orienta o planejamento: respeitamos suas proporções e sua identidade. A resposta de cada organismo é individual e nenhum resultado pode ser garantido.",
  ],
  [
    "Quantas sessões são necessárias?",
    "O número de sessões varia conforme o procedimento, a avaliação e a resposta de cada pessoa. O plano e as possíveis reavaliações são discutidos na consulta.",
  ],
  [
    "Quanto tempo dura o resultado?",
    "A durabilidade varia conforme o tratamento, o produto utilizado, as características individuais e os cuidados. A avaliação permite conversar sobre expectativas realistas e manutenção.",
  ],
  [
    "Existe algum cuidado antes ou depois?",
    "Sim. Cada procedimento exige orientações próprias e pode apresentar riscos e contraindicações. Você receberá orientações individualizadas; não suspenda medicamentos por conta própria.",
  ],
  [
    "Posso realizar mais de um procedimento?",
    "Em alguns casos, procedimentos podem fazer parte do mesmo plano. A combinação e os intervalos precisam de avaliação profissional para considerar segurança, recuperação e seus objetivos.",
  ],
  [
    "Como funciona a primeira avaliação?",
    "Começamos pela escuta, seguida da avaliação e da conversa sobre alternativas, cuidados e limitações. Você pode esclarecer dúvidas e decidir com tranquilidade, sem obrigação de realizar um procedimento.",
  ],
]
export const results = [1, 2, 3, 4, 5, 6].map((n) => ({
  src: `/images/ref${n}.webp`,
  category: n === 3 || n === 4 ? "Corporal" : "Lábios",
  title: n === 3 || n === 4 ? "Harmonização glútea" : "Preenchimento labial",
}))
// Depoimentos ocultos até receber conteúdo real e autorizado. Placeholder: Adicionar depoimento autorizado.
export const testimonials: { name: string; text: string }[] = []
