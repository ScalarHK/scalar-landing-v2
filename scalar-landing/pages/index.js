import Head from 'next/head'
import ScalarLandingPage from '../components/ScalarLandingPage'

export default function Home() {
  return (
    <>
      <Head>
        <title>Scalar - AI Receptionist for Your Clinic</title>
        <meta
          name="description"
          content="Turn your website into a 24/7 AI receptionist. Never miss a lead again. Instantly preview your custom AI chatbot for WhatsApp, Instagram, and web chat."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://scalar.app/" />
        <meta property="og:title" content="Scalar - AI Receptionist for Your Clinic" />
        <meta
          property="og:description"
          content="Turn your website into a 24/7 AI receptionist. Never miss a lead again."
        />
        <meta property="og:image" content="https://scalar.app/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://scalar.app/" />
        <meta property="twitter:title" content="Scalar - AI Receptionist for Your Clinic" />
        <meta
          property="twitter:description"
          content="Turn your website into a 24/7 AI receptionist. Never miss a lead again."
        />
        <meta property="twitter:image" content="https://scalar.app/og-image.jpg" />
      </Head>

      <main>
        <ScalarLandingPage />
      </main>
    </>
  )
}
