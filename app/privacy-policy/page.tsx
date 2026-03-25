import type { Metadata } from 'next'
import { Navbar } from '@/components/navbar'

export const metadata: Metadata = {
  title: 'Privacy Policy - TechVyro',
  description: 'Privacy Policy for TechVyro - Learn how we collect, use, and protect your information.',
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-24 md:pb-12 max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8 text-sm">Last updated: March 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
            <p>
              Welcome to <strong className="text-foreground">TechVyro</strong> ("we", "us", or "our"). We operate the website{' '}
              <a href="https://www.techvyro.in" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                www.techvyro.in
              </a>{' '}
              and related streaming discovery services. This Privacy Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website. Please read this policy carefully. If you disagree with its terms, please stop using our site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
            <p className="mb-3">We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-foreground">Usage Data:</strong> Pages visited, time spent, browser type, device type, IP address,
                and referring URLs — collected automatically via server logs and analytics tools.
              </li>
              <li>
                <strong className="text-foreground">Watchlist / Preferences:</strong> If you use the watchlist or history feature, this data
                is stored locally in your browser (localStorage) and is never sent to our servers.
              </li>
              <li>
                <strong className="text-foreground">Cookies:</strong> We and our advertising partners (including Google) use cookies to
                personalize content, show relevant ads, and analyze traffic. See Section 5 for details.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
            <p className="mb-3">We use the collected information to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Operate and improve our website and services</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Display relevant advertisements through Google AdSense</li>
              <li>Ensure the security and integrity of our platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Third-Party Services</h2>
            <p className="mb-3">Our website uses the following third-party services, each with their own privacy policies:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-foreground">The Movie Database (TMDB):</strong> We use the TMDB API to display movie and TV show
                information. TMDB's Privacy Policy applies to data fetched from their service.{' '}
                <a href="https://www.themoviedb.org/privacy-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  View TMDB Privacy Policy
                </a>
              </li>
              <li>
                <strong className="text-foreground">Google AdSense:</strong> We display advertisements through Google AdSense. Google may
                use cookies to serve ads based on your prior visits to our site or other websites.{' '}
                <a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  View Google Privacy Policy
                </a>
              </li>
              <li>
                <strong className="text-foreground">Google Analytics:</strong> We may use Google Analytics to understand how users interact
                with our site. This data is aggregated and anonymous.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Cookies Policy</h2>
            <p className="mb-3">
              Cookies are small text files stored on your device. We use cookies for the following purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>
                <strong className="text-foreground">Essential Cookies:</strong> Required for the website to function correctly
                (e.g., theme preferences, session management).
              </li>
              <li>
                <strong className="text-foreground">Advertising Cookies:</strong> Google AdSense and its partners use cookies to serve
                ads relevant to your interests. You can opt out of personalized advertising at{' '}
                <a href="https://www.google.com/settings/ads" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  Google Ad Settings
                </a>.
              </li>
              <li>
                <strong className="text-foreground">Analytics Cookies:</strong> Help us understand visitor behavior so we can improve our service.
              </li>
            </ul>
            <p className="mt-3">
              You can control or delete cookies through your browser settings. Note that disabling cookies may affect some functionality of the site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Sharing and Disclosure</h2>
            <p className="mb-3">We do not sell, trade, or rent your personal information. We may share data in these limited situations:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>With third-party service providers (Google AdSense, Analytics) as described above</li>
              <li>If required by law, regulation, or legal process</li>
              <li>To protect the rights, property, or safety of TechVyro, our users, or the public</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Data Security</h2>
            <p>
              We implement reasonable security measures to protect your information. However, no method of transmission over the internet
              is 100% secure. We cannot guarantee absolute security of data transmitted to or from our site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Children's Privacy</h2>
            <p>
              Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children.
              If you believe a child has provided us with personal information, please contact us and we will delete it immediately.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Your Rights</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>Access the personal data we hold about you</li>
              <li>Request correction or deletion of your data</li>
              <li>Opt out of personalized advertising</li>
              <li>Lodge a complaint with your local data protection authority</li>
            </ul>
            <p className="mt-3">To exercise these rights, contact us at the email below.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.
              Continued use of the site after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
            <div className="mt-3 space-y-1">
              <p>
                <strong className="text-foreground">Email:</strong>{' '}
                <a href="mailto:techvyro@gmail.com" className="text-primary hover:underline">
                  techvyro@gmail.com
                </a>
              </p>
              <p>
                <strong className="text-foreground">Website:</strong>{' '}
                <a href="https://www.techvyro.in" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  www.techvyro.in
                </a>
              </p>
            </div>
          </section>

        </div>
      </main>
    </>
  )
}
