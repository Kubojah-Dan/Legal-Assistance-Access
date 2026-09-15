import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NyayaMitra — AI for Legal Assistance & Access (India)",
  description: "Accessible, verified legal assistance grounded in current Indian law (BNS/BNSS/BSA), official Tier-1 legal sources, structured document drafting, and human legal aid escalation.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="nm-header" role="banner">
          <div className="nm-header-inner">
            <a href="/" className="nm-brand" aria-label="NyayaMitra Home">
              <div className="nm-emblem" aria-hidden="true">न्या</div>
              <div className="nm-title-group">
                <h1>NyayaMitra</h1>
                <p>Legal Assistance & Access Platform • भारत</p>
              </div>
            </a>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span className="nm-badge-current-law">
                ● Current Law 2024 (BNS/BNSS)
              </span>
              <button className="nm-lang-toggle" aria-label="Switch Language (English / हिंदी)">
                हिंदी / English
              </button>
            </div>
          </div>
        </header>

        <main id="main-content">
          {children}
        </main>

        <footer className="nm-footer" role="contentinfo">
          <div className="nm-footer-inner">
            <div className="nm-footer-col" style={{ maxWidth: "360px" }}>
              <h5>NyayaMitra (न्यायमित्र)</h5>
              <p>
                An open-access legal empowerment initiative helping citizens navigate
                rights, understand legal documents, draft statutory notices, and connect
                with official NALSA / DLSA legal aid across India.
              </p>
            </div>
            <div className="nm-footer-col">
              <h5>Essential Helplines</h5>
              <ul>
                <li><strong>NALSA Legal Aid:</strong> 15100 (Toll Free, 24x7)</li>
                <li><strong>Tele-Law:</strong> tele-law.in</li>
                <li><strong>National Consumer Helpline:</strong> 1915</li>
                <li><strong>National Emergency:</strong> 112</li>
                <li><strong>Women Helpline:</strong> 181</li>
              </ul>
            </div>
            <div className="nm-footer-col">
              <h5>Authoritative Sources</h5>
              <ul>
                <li><a href="https://www.indiacode.nic.in" target="_blank" rel="noopener noreferrer">India Code (Legislation)</a></li>
                <li><a href="https://services.ecourts.gov.in" target="_blank" rel="noopener noreferrer">eCourts Services</a></li>
                <li><a href="https://nalsa.gov.in" target="_blank" rel="noopener noreferrer">NALSA Official Portal</a></li>
                <li><a href="https://consumerhelpline.gov.in" target="_blank" rel="noopener noreferrer">National Consumer Portal</a></li>
              </ul>
            </div>
          </div>
          <div className="nm-footer-bottom">
            <p>
              Disclaimer: NyayaMitra provides general legal information and procedural assistance based on verified Indian statutes.
              It does not offer legal representation or constitute an advocate-client relationship.
            </p>
            <p style={{ marginTop: "0.5rem" }}>
              © 2026 NyayaMitra Contributors • Open Access to Justice
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
