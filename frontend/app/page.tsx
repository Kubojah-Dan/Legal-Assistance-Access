"use client";

import React, { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  return (
    <div className="nm-container">
      {/* Persistent Legal Disclaimer Banner */}
      <aside className="nm-disclaimer-banner" role="alert" aria-label="Legal Disclaimer">
        <span style={{ fontSize: "1.2rem" }}>⚖️</span>
        <div>
          <strong>Official Legal Information Notice:</strong> NyayaMitra provides statutory guidance,
          rights explanations, and template drafting based on verified Indian law. We are <em>not</em> an advocate firm
          and do not provide formal court representation. For urgent matters, please contact NALSA at <strong>15100</strong>.
        </div>
      </aside>

      {/* Hero Section */}
      <section className="nm-hero">
        <h2>Legal Access & Guidance for Every Indian Citizen</h2>
        <p>
          Understand your rights under current Indian law, calculate crucial deadlines,
          draft dispute notices, and connect directly with official legal aid services.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span className="nm-badge-current-law">
            ✓ Updated for Bharatiya Nyaya Sanhita (BNS 2023)
          </span>
          <span className="nm-badge-current-law" style={{ background: "#eff6ff", color: "#1d4ed8", borderColor: "#bfdbfe" }}>
            ✓ Tier-1 India Code Citations Only
          </span>
          <span className="nm-badge-current-law" style={{ background: "#fef3c7", color: "#b45309", borderColor: "#fde68a" }}>
            ✓ Bilingual (Hindi & English)
          </span>
        </div>
      </section>

      {/* 3 Core Jobs Grid */}
      <section aria-labelledby="core-services-heading">
        <h3 id="core-services-heading" style={{ fontSize: "1.2rem", color: "var(--text-muted)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Choose How NyayaMitra Can Help You Today
        </h3>
        
        <div className="nm-core-jobs-grid">
          {/* Job 1: Samjho Mera Problem */}
          <article className="nm-job-card">
            <div>
              <span className="nm-job-card-tag nm-tag-intake">1. Guided Intake</span>
              <h3>Samjho Mera Problem</h3>
              <p>
                Explain your problem in plain words or voice (Hindi or English).
                NyayaMitra clarifies the key facts, detects your legal domain,
                and verifies everything with you before proceeding.
              </p>
            </div>
            <button className="nm-btn nm-btn-primary" style={{ width: "100%" }}>
              <span>🎙️ Tell My Problem</span>
            </button>
          </article>

          {/* Job 2: Mere Adhikaar */}
          <article className="nm-job-card">
            <div>
              <span className="nm-job-card-tag nm-tag-rights">2. Rights & Timeline</span>
              <h3>Mere Adhikaar</h3>
              <p>
                Get plain-language explanations of your legal rights (Grade 6–8 level)
                grounded in current Indian statutes, complete with official citations
                and a step-by-step action timeline.
              </p>
            </div>
            <button className="nm-btn nm-btn-primary" style={{ width: "100%" }}>
              <span>📖 Understand My Rights</span>
            </button>
          </article>

          {/* Job 3: Mera Document */}
          <article className="nm-job-card">
            <div>
              <span className="nm-job-card-tag nm-tag-doc">3. Controlled Drafting</span>
              <h3>Mera Document</h3>
              <p>
                Generate ready-to-use, legally formatted documents (RTI Applications,
                Consumer Forum Grievances, Tenant Dispute Replies) from verified templates
                without AI hallucinations.
              </p>
            </div>
            <button className="nm-btn nm-btn-primary" style={{ width: "100%" }}>
              <span>📝 Make a Document</span>
            </button>
          </article>
        </div>
      </section>

      {/* Secondary Citizen Services */}
      <section className="nm-secondary-section" aria-labelledby="secondary-services-heading">
        <h3 id="secondary-services-heading">Additional Essential Services</h3>
        <div className="nm-secondary-grid">
          <div className="nm-service-item">
            <h4>📅 Notice / Deadline Guardian</h4>
            <p>Upload a court order, summons, or legal notice to extract critical hearing and reply deadlines into plain language.</p>
          </div>
          <div className="nm-service-item">
            <h4>⚖️ eCourts Case Lookup</h4>
            <p>Guided search assistance for CNR numbers and case statuses across District and High Courts in India.</p>
          </div>
          <div className="nm-service-item">
            <h4>🤝 Human Legal Aid Escalation</h4>
            <p>Instant access to free legal services under Section 12 LSAA: connect with your local DLSA or Tele-Law panel lawyers.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
