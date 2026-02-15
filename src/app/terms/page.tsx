export default function TermsPage() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-6">Last updated: February 15, 2026</p>

      <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white mb-2">Acceptance of Terms</h2>
          <p>
            By using PostOpp, you agree to these Terms of Service. If you do not
            agree, do not use the application.
          </p>
        </section>

        <section className="bg-red-900/20 rounded-xl p-4 border border-red-800/50">
          <h2 className="text-lg font-bold text-red-300 mb-2">Medical Disclaimer</h2>
          <p className="text-red-200">
            <strong>PostOpp is NOT a medical device.</strong> It is not approved
            or cleared by the FDA for any medical purpose. PostOpp does not:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-red-200">
            <li>Diagnose any medical condition</li>
            <li>Provide medical advice or treatment recommendations</li>
            <li>Replace consultation with healthcare professionals</li>
            <li>Treat, cure, or prevent any disease</li>
            <li>Provide emergency medical services</li>
          </ul>
          <p className="mt-3 text-red-200">
            PostOpp is a personal symptom tracking tool only. The information you
            enter is for your own record-keeping and to share with your
            healthcare providers at your discretion.
          </p>
          <p className="mt-3 text-red-200 font-bold">
            If you are experiencing a medical emergency, call 911 immediately.
            For the Veterans Crisis Line, dial 988 and press 1.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Description of Service</h2>
          <p>
            PostOpp is a free, open-source Progressive Web Application (PWA) that
            allows users to log symptoms, rate pain levels, and export their
            symptom history to PDF format. All data is stored locally on the
            user&apos;s device.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Data Ownership</h2>
          <p>
            <strong>You own all data you enter into PostOpp.</strong> Your symptom
            logs, pain ratings, location data, and any other information you
            input belong entirely to you. We do not claim any rights to your
            data. You may export or delete your data at any time.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Local Storage</h2>
          <p>
            PostOpp stores all data locally on your device using encrypted
            browser storage (IndexedDB with AES-256-GCM encryption). Because
            data is stored locally:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Clearing your browser data will delete all PostOpp logs</li>
            <li>Uninstalling the app will delete all stored data</li>
            <li>Data does not sync between devices</li>
            <li>We cannot recover lost data — there is no backup</li>
          </ul>
          <p className="mt-2">
            We recommend regularly exporting your data to PDF as a backup.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">GPS Location</h2>
          <p>
            PostOpp may request access to your device&apos;s location. This is used
            solely to log the location where symptoms occur. Location permission
            is optional and can be denied without affecting core app
            functionality. Location data is stored only on your device.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">No Warranty</h2>
          <p>
            PostOpp is provided &quot;as is&quot; without warranty of any kind, express or
            implied. We do not guarantee that the application will be error-free,
            uninterrupted, or suitable for any particular purpose. Use PostOpp at
            your own risk.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, PostOpp and its creators
            shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages arising from your use of the
            application, including but not limited to loss of data, medical
            complications, or reliance on information provided by the app.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Intended Users</h2>
          <p>
            PostOpp is designed for adult US veterans seeking a simple way to
            track symptoms for personal use and to share with their VA medical
            team or healthcare providers. The app is not intended for use by
            individuals under 18 years of age.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Open Source</h2>
          <p>
            PostOpp is open-source software available at{" "}
            <a
              href="https://github.com/kateparkervale/postopp"
              className="text-blue-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              github.com/kateparkervale/postopp
            </a>
            . You may review, fork, and modify the source code in accordance
            with the repository&apos;s license.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Changes to Terms</h2>
          <p>
            We may update these terms from time to time. Changes will be posted
            on this page with an updated date. Continued use of PostOpp after
            changes constitutes acceptance of the revised terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white mb-2">Contact</h2>
          <p>
            For questions about these terms, visit the PostOpp GitHub repository:{" "}
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
