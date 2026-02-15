export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-6">Last updated: February 15, 2026</p>

      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">Overview</h2>
          <p>
            PostOpp is a personal symptom tracking application designed for US
            veterans. Your privacy is our highest priority. This policy explains
            what data PostOpp collects, how it is stored, and your rights.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Data We Collect</h2>
          <p>When you use PostOpp, the following data is stored <strong>locally on your device only</strong>:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Symptom entries:</strong> Which symptom you logged and its pain level (1-10)</li>
            <li><strong>Timestamps:</strong> When each symptom was logged</li>
            <li><strong>GPS location:</strong> Your approximate location at the time of logging (if you grant permission)</li>
            <li><strong>Follow-up ratings:</strong> Updated pain levels from follow-up notifications</li>
            <li><strong>App preferences:</strong> Your selected symptoms, notification settings</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">How Data is Stored</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All data is stored <strong>locally in your browser&apos;s IndexedDB</strong> — it never leaves your device</li>
            <li>Data is encrypted using <strong>AES-256-GCM</strong> encryption via the Web Crypto API</li>
            <li>There are <strong>no user accounts</strong> — no email, no password, no personal identifiers are collected</li>
            <li>There is <strong>no cloud storage or synchronization</strong></li>
            <li>There are <strong>no servers</strong> that receive or process your health data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">GPS Location</h2>
          <p>
            PostOpp requests access to your device&apos;s GPS location to record where
            symptoms occur, which can be useful for identifying environmental
            triggers. Location access is <strong>optional</strong> — if you deny
            the browser&apos;s location permission, PostOpp will still work normally.
            GPS coordinates are stored only on your device and included in PDF
            exports if available.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Data Sharing</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>We <strong>do NOT sell, share, or monetize</strong> your health data</li>
            <li>We <strong>do NOT use analytics or tracking</strong> of any kind</li>
            <li>We <strong>do NOT transmit data</strong> to any server, third party, or cloud service</li>
            <li>The only way data leaves your device is when <strong>you choose to export a PDF</strong>, which downloads to your device</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">PDF Exports</h2>
          <p>
            When you export your symptom log to PDF, the file is generated
            entirely on your device and saved to your downloads folder. The PDF
            is marked as confidential and includes a privacy notice. We recommend
            sharing exported PDFs only with your healthcare providers.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Your Rights</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Access:</strong> All your data is visible in the History tab</li>
            <li><strong>Export:</strong> You can export all data to PDF at any time</li>
            <li><strong>Delete:</strong> You can delete all data from Settings &gt; Clear All Data</li>
            <li><strong>Uninstall:</strong> Removing the app deletes all stored data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Data Breach Notification</h2>
          <p>
            Because all data is stored locally on your device with no server
            component, a traditional data breach of PostOpp servers is not
            possible. However, in compliance with the FTC Health Breach
            Notification Rule, if we become aware of any vulnerability in the app
            that could compromise your data, we will notify affected users within
            60 calendar days through an in-app notification and on our website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Hosting</h2>
          <p>
            PostOpp is hosted on Vercel as a static website. Vercel serves the
            app files but <strong>does not receive, process, or store any of your
            health data</strong>. Standard web server logs (IP address, page
            requests) may be collected by Vercel per their privacy policy, but
            these do not contain any symptom or health information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Children</h2>
          <p>
            PostOpp is designed for adult US veterans and is not intended for use
            by individuals under the age of 18.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. Changes will be
            posted on this page with an updated revision date. Continued use of
            PostOpp after changes constitutes acceptance of the revised policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Contact</h2>
          <p>
            If you have questions about this privacy policy, contact us at the
            PostOpp GitHub repository:{" "}
            <a
              href="https://github.com/kateparkervale/postopp"
              className="text-blue-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/kateparkervale/postopp
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
