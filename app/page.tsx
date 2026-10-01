import ClinicSite from "@/components/clinic-site"
import { clinic } from "@/lib/content"
export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: clinic.name,
    description: "Harmonização facial e corporal",
    telephone: clinic.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Travessa Nestor de Castro, 247",
      addressLocality: "Curitiba",
      addressRegion: "PR",
      postalCode: "80020-120",
      addressCountry: "BR",
    },
    sameAs: [clinic.instagram],
    ...(clinic.siteUrl ? { url: clinic.siteUrl } : {}),
  }
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <ClinicSite />
    </>
  )
}
