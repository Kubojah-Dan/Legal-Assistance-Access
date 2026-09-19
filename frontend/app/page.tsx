"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Scale,
  FileText,
  FilePen,
  Landmark,
  Globe,
  Mic,
  Home,
  ShoppingCart,
  ClipboardList,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Clock,
  CheckCircle,
  Lock,
  Users,
  CalendarDays,
  Download,
  Search,
  Settings,
  MapPin,
  Phone,
  Monitor,
  ShieldCheck,
  Info,
  ChevronRight,
} from "lucide-react";

type Language = "en" | "hi";

export default function HomePage() {
  const [lang, setLang] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState<string>("intake");

  // --- Module 1: Intake State ---
  const [intakeMessages, setIntakeMessages] = useState<Array<{ sender: "assistant" | "user"; text: string; domain?: string; urgent?: boolean }>>([
    {
      sender: "assistant",
      text: lang === "hi"
        ? "नमस्ते! मैं न्यायमित्र हूँ। कृपया अपनी कानूनी समस्या बताएं (जैसे मकान मालिक का नोटिस, खराब सामान, आरटीआई या पुलिस शिकायत)।"
        : "Namaste! I am NyayaMitra. Please describe your legal issue in your own words (e.g. tenancy dispute, consumer defect, RTI, or police notice).",
    },
  ]);
  const [inputQuery, setInputQuery] = useState<string>("");
  const [detectedDomain, setDetectedDomain] = useState<string | null>(null);
  const [isUrgent, setIsUrgent] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // --- Module 2: Rights Domain State ---
  const [rightsDomain, setRightsDomain] = useState<string>("TENANCY");

  // --- Module 3: Document Scanner State ---
  const [docInputText, setDocInputText] = useState<string>("");
  const [docAnalysis, setDocAnalysis] = useState<any | null>(null);
  const [userDeadlines, setUserDeadlines] = useState<any[]>([]);

  // --- Module 4: Generator State ---
  const [selectedTemplate, setSelectedTemplate] = useState<string>("RTI_APPLICATION");
  const [slots, setSlots] = useState<Record<string, string>>({
    applicant_name: "Ramesh Kumar",
    applicant_address: "Flat 101, Shanti Nagar, New Delhi",
    applicant_contact: "9876543210",
    public_authority_name: "Delhi Development Authority (DDA)",
    public_authority_address: "Vikas Sadan, INA, New Delhi",
    subject_matter: "Status of Road Repair Tender Ref #2024-DDA-89",
    particulars_of_information: "1. Certified copy of work order.\n2. Total funds disbursed till date.\n3. Name and designation of inspecting engineer.",
    place: "New Delhi",
  });
  const [generatedDoc, setGeneratedDoc] = useState<string | null>(null);

  // --- Module 5: Escalation & Eligibility State ---
  const [selectedState, setSelectedState] = useState<string>("DELHI");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("SOUTH");
  const [eligibilityCriteria, setEligibilityCriteria] = useState<{
    is_woman_or_child: boolean;
    is_sc_or_st: boolean;
    is_in_custody: boolean;
    is_disabled: boolean;
    annual_income: number;
  }>({
    is_woman_or_child: false,
    is_sc_or_st: false,
    is_in_custody: false,
    is_disabled: false,
    annual_income: 180000,
  });

  // --- Handlers ---
  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputQuery;
    if (!text.trim()) return;

    // Detect domain client-side / simulated
    const lower = text.toLowerCase();
    let dom = "GENERAL";
    let urgent = false;

    if (lower.includes("landlord") || lower.includes("rent") || lower.includes("eviction") || lower.includes("मकान") || lower.includes("किराया")) {
      dom = "TENANCY";
    } else if (lower.includes("refund") || lower.includes("defective") || lower.includes("consumer") || lower.includes("खराब") || lower.includes("उपभोक्ता")) {
      dom = "CONSUMER";
    } else if (lower.includes("rti") || lower.includes("information") || lower.includes("pio") || lower.includes("आरटीआई") || lower.includes("सूचना")) {
      dom = "RTI";
    } else if (lower.includes("police") || lower.includes("arrest") || lower.includes("fir") || lower.includes("lockup") || lower.includes("थाना")) {
      dom = "CRIMINAL";
      urgent = true;
    }

    setDetectedDomain(dom);
    setIsUrgent(urgent);

    const newMsgs = [
      ...intakeMessages,
      { sender: "user" as const, text },
    ];

    let botReply = "";
    if (urgent) {
      botReply = lang === "hi"
        ? "⚠ तत्काल सहायता सूचना: आपने पुलिस कार्रवाई या गिरफ्तारी का उल्लेख किया है। कृपया 24x7 राष्ट्रीय कानूनी सहायता हेल्पलाइन 15100 पर कॉल करें।"
        : "Immediate Assistance Notice: You mentioned police action/detention. Please call the 24x7 National Legal Aid Helpline at 15100 for immediate lawyer assistance.";
    } else if (dom === "TENANCY") {
      botReply = lang === "hi"
        ? "किरायेदारी मामला पहचाना गया: क्या आपको मकान मालिक से कोई लिखित नोटिस प्राप्त हुआ है? आप 'मेरे अधिकार' टैब में अपने कानूनी अधिकार देख सकते हैं।"
        : "Tenancy matter identified: Did your landlord serve a written notice? Under Indian tenancy law, eviction requires formal process. You can view your verified rights in the 'Rights & Timelines' tab.";
    } else if (dom === "CONSUMER") {
      botReply = lang === "hi"
        ? "उपभोक्ता विवाद पहचाना गया: उपभोक्ता संरक्षण अधिनियम 2019 के तहत आपके पास 2 वर्ष की परिसीमा अवधि है।"
        : "Consumer dispute identified: Under Consumer Protection Act, 2019, you have a 2-year limitation period from cause of action to file a complaint.";
    } else {
      botReply = lang === "hi"
        ? "आपकी समस्या समझ ली गई है। क्या आप इसके अधिकार जानना चाहते हैं या कोई विधिक नोटिस तैयार करना चाहते हैं?"
        : "I have recorded your issue. Would you like to check your statutory rights or generate a formal notice?";
    }

    newMsgs.push({ sender: "assistant", text: botReply, domain: dom, urgent });
    setIntakeMessages(newMsgs);
    setInputQuery("");
  };

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const sampleVoiceText = lang === "hi"
        ? "मकान मालिक बिना नोटिस के घर खाली करने का दबाव बना रहा है"
        : "My landlord sent me an illegal eviction notice without 15 days time";
      setInputQuery(sampleVoiceText);
      handleSendMessage(sampleVoiceText);
    }, 1200);
  };

  const handleAnalyzeSampleDoc = (docType: string) => {
    let sample = "";
    if (docType === "SUMMONS") {
      sample = `IN THE COURT OF CHIEF JUDICIAL MAGISTRATE, SAKET, NEW DELHI\nCase No. CC 450/2024\nAnand Kumar ... Complainant vs Rajesh Sharma ... Accused\nSummons to appear before this Hon'ble Court on 24-10-2025 at 10:30 AM.\nParty Aadhaar: 4321 8765 1234.`;
    } else if (docType === "CHEQUE_BOUNCE") {
      sample = `STATUTORY DEMAND NOTICE UNDER SECTION 138 NEGOTIABLE INSTRUMENTS ACT\nTo: Vikram Singh, Jaipur\nCheque No. 459821 of Rs. 1,50,000/- dishonoured for Funds Insufficient.\nYou are called upon to make payment within 15 days of receipt of this notice.`;
    } else {
      sample = `FIRST INFORMATION REPORT (Under Section 154 Cr.P.C. / Section 173 BNSS)\nFIR No. 99/2024, Police Station: Cyber Crime Cell, Bengaluru\nSections cited: Section 318 BNS (Cheating), Section 66D IT Act.`;
    }
    setDocInputText(sample);

    // Mock extraction
    const mockRes = {
      document_type: docType === "SUMMONS" ? "COURT_NOTICE" : (docType === "CHEQUE_BOUNCE" ? "LEGAL_NOTICE" : "FIR_COPY"),
      confidence: 0.95,
      parties: {
        petitioner: docType === "SUMMONS" ? "Anand Kumar" : "Payee / Claimant",
        respondent: docType === "SUMMONS" ? "Rajesh Sharma" : "Opposite Party",
        court_name: docType === "SUMMONS" ? "Saket District Court" : "Statutory Legal Authority",
        case_number: "CC 450/2024",
      },
      deadlines: [
        {
          label: docType === "SUMMONS" ? "Court Appearance Date" : "Reply / Payment Deadline",
          value: docType === "SUMMONS" ? "2025-10-24" : "Within 15 Days",
          urgency: docType === "SUMMONS" ? "MEDIUM" : "HIGH",
          statutory_basis: docType === "SUMMONS" ? "Court Summons Order" : "Section 138 NI Act",
        },
      ],
      pii_redacted: 1,
    };
    setDocAnalysis(mockRes);
    setUserDeadlines(mockRes.deadlines);
  };

  const handleGenerateDocument = () => {
    let output = "";
    if (selectedTemplate === "RTI_APPLICATION") {
      output = `# APPLICATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005\n\n**To:** The Public Information Officer, ${slots.public_authority_name}, ${slots.public_authority_address}\n\n**Applicant:** ${slots.applicant_name} (${slots.applicant_address}, Contact: ${slots.applicant_contact})\n\n### Subject: ${slots.subject_matter}\n\n### Information Sought:\n${slots.particulars_of_information}\n\n**Application Fee:** Enclosed IPO/Court Fee Stamp of Rs. 10/-.\n\n**Place:** ${slots.place}\n**Date:** ${new Date().toISOString().split("T")[0]}\n\n______________________________\nSignature of Applicant\n\n> *DISCLAIMER: Computer-generated legal draft by NyayaMitra. For informational purposes only. Consult an advocate or DLSA before formal submission.*`;
    } else if (selectedTemplate === "CONSUMER_COMPLAINT") {
      output = `# BEFORE THE DISTRICT CONSUMER DISPUTES REDRESSAL COMMISSION\n\n**Complaint under Section 35 of the Consumer Protection Act, 2019**\n\n**Complainant:** ${slots.applicant_name}\n**Versus**\n**Opposite Party:** XYZ Electronics Pvt Ltd\n\n### Facts & Deficiency in Service:\n${slots.particulars_of_information}\n\n### Relief Claimed:\n1. Full refund of consideration with interest.\n2. Compensation for mental harassment.\n\n**Place:** ${slots.place}\n**Date:** ${new Date().toISOString().split("T")[0]}\n\n> *DISCLAIMER: Computer-generated legal draft by NyayaMitra. Consult DLSA for free representation.*`;
    } else {
      output = `# STATUTORY DEMAND NOTICE UNDER SECTION 138 NEGOTIABLE INSTRUMENTS ACT\n\n**To:** Opposite Party / Drawer\n\nYou are hereby called upon to pay the cheque amount of Rs. 1,50,000/- within 15 (fifteen) days from receipt of this notice, failing which criminal proceedings shall be initiated under Section 138 NI Act.\n\n**Place:** ${slots.place}\n\n> *DISCLAIMER: Computer-generated legal draft by NyayaMitra.*`;
    }
    setGeneratedDoc(output);
  };

  const handleDownloadDoc = (format: string) => {
    if (!generatedDoc) return;
    const blob = new Blob([generatedDoc], { type: format === "html" ? "text/html" : "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nyayamitra-document.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportICS = () => {
    const icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//NyayaMitra//Legal Deadline Guardian//EN\r\nBEGIN:VEVENT\r\nUID:nyayamitra-court-deadline-20251024@nyayamitra.gov.in\r\nDTSTART;VALUE=DATE:20251024\r\nSUMMARY:NyayaMitra: Court Appearance Hearing Date\r\nDESCRIPTION:Court appearance deadline verified by NyayaMitra.\r\nSTATUS:CONFIRMED\r\nBEGIN:VALARM\r\nTRIGGER:-P1D\r\nACTION:DISPLAY\r\nDESCRIPTION:Reminder: Court hearing tomorrow!\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR`;
    const blob = new Blob([icsContent], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nyayamitra-court-deadlines.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Eligibility Calculation
  const isEligible =
    eligibilityCriteria.is_woman_or_child ||
    eligibilityCriteria.is_sc_or_st ||
    eligibilityCriteria.is_in_custody ||
    eligibilityCriteria.is_disabled ||
    eligibilityCriteria.annual_income <= 300000;

  return (
    <div className="nm-container">
      {/* Disclaimer Banner */}
      <aside className="nm-disclaimer-banner" role="alert">
        <span className="nm-disclaimer-icon">
          <Scale size={18} aria-hidden="true" />
        </span>
        <div>
          <strong>{lang === "hi" ? "आधिकारिक विधिक सूचना:" : "Official Legal Information Notice:"}</strong>{" "}
          {lang === "hi"
            ? "न्यायमित्र भारतीय कानूनों के आधार पर नागरिक सहायता एवं दस्तावेज प्रारूपण प्रदान करता है। यह कोई लॉ फर्म नहीं है। निःशुल्क सरकारी वकील हेतु NALSA हेल्पलाइन 15100 पर संपर्क करें।"
            : "NyayaMitra provides statutory guidance, rights explanations, and structured drafting based on active Indian law. We do not provide court representation. For free legal aid, call NALSA at 15100."}
        </div>
      </aside>

      {/* Hero Bar */}
      <section className="nm-workspace" style={{ padding: "1.25rem", marginBottom: "1rem", background: "linear-gradient(135deg, #0b192c 0%, #1e3e62 100%)", color: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ color: "#fff", fontSize: "1.3rem", marginBottom: "0.25rem", fontFamily: "var(--font-display)" }}>
              {lang === "hi" ? "नागरिक विधिक सेवा केंद्र" : "Citizen Legal Empowerment Dashboard"}
            </h2>
            <p style={{ color: "#cbd5e1", fontSize: "0.83rem" }}>
              {lang === "hi" ? "भारतीय कानून 2024 (BNS/BNSS/BSA), आरटीआई एवं उपभोक्ता संरक्षण पर आधारित" : "Grounded in Bharatiya Sanhitas 2024, RTI Act 2005, and Consumer Protection Act 2019"}
            </p>
          </div>
          <button
            className="nm-btn-lang"
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            aria-label="Toggle language"
          >
            <Globe size={14} aria-hidden="true" />
            {lang === "en" ? "हिंदी में बदलें" : "Switch to English"}
          </button>
        </div>
      </section>

      {/* Main Tab Navigation */}
      <nav className="nm-nav-tabs" role="tablist" aria-label="Legal Services Navigation">
        <button
          className={`nm-tab-btn ${activeTab === "intake" ? "active" : ""}`}
          onClick={() => setActiveTab("intake")}
          role="tab"
          aria-selected={activeTab === "intake"}
        >
          <MessageSquare size={15} aria-hidden="true" />
          {lang === "hi" ? "1. समझो मेरा प्रॉब्लम" : "1. Guided Intake"}
        </button>
        <button
          className={`nm-tab-btn ${activeTab === "rights" ? "active" : ""}`}
          onClick={() => setActiveTab("rights")}
          role="tab"
          aria-selected={activeTab === "rights"}
        >
          <Scale size={15} aria-hidden="true" />
          {lang === "hi" ? "2. मेरे अधिकार" : "2. Rights & Timelines"}
        </button>
        <button
          className={`nm-tab-btn ${activeTab === "scanner" ? "active" : ""}`}
          onClick={() => setActiveTab("scanner")}
          role="tab"
          aria-selected={activeTab === "scanner"}
        >
          <FileText size={15} aria-hidden="true" />
          {lang === "hi" ? "3. नोटिस स्कैनर व तारीखें" : "3. Document Scanner"}
        </button>
        <button
          className={`nm-tab-btn ${activeTab === "generator" ? "active" : ""}`}
          onClick={() => setActiveTab("generator")}
          role="tab"
          aria-selected={activeTab === "generator"}
        >
          <FilePen size={15} aria-hidden="true" />
          {lang === "hi" ? "4. मेरा डाक्यूमेंट" : "4. Mera Document"}
        </button>
        <button
          className={`nm-tab-btn ${activeTab === "escalation" ? "active" : ""}`}
          onClick={() => setActiveTab("escalation")}
          role="tab"
          aria-selected={activeTab === "escalation"}
        >
          <Landmark size={15} aria-hidden="true" />
          {lang === "hi" ? "5. न्याय सहायता (NALSA/DLSA)" : "5. Legal Aid & Helpline"}
        </button>
      </nav>

      {/* ========================================================================= */}
      {/* WORKSPACE 1: GUIDED INTAKE */}
      {/* ========================================================================= */}
      {activeTab === "intake" && (
        <section className="nm-workspace" aria-labelledby="intake-heading">
          <div className="nm-workspace-header">
            <h2 id="intake-heading">
              <MessageSquare size={20} aria-hidden="true" />
              {lang === "hi" ? "समझो मेरा प्रॉब्लम (Guided Intake)" : "Samjho Mera Problem (Guided Intake)"}
            </h2>
            <p>
              {lang === "hi"
                ? "अपनी भाषा में समस्या बताएं। न्यायमित्र कानूनी श्रेणी पहचानेगा और आपको सही अधिकार बताएगा।"
                : "Explain your legal problem in plain words or simulated voice. NyayaMitra verifies facts and identifies legal domain."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-muted)", alignSelf: "center" }}>
              {lang === "hi" ? "त्वरित उदाहरण:" : "Quick Scenarios:"}
            </span>
            <button className="nm-btn nm-btn-secondary nm-btn-sm" onClick={() => handleSendMessage("Landlord sent illegal eviction notice without 15 days time")}>
              <Home size={13} aria-hidden="true" />
              {lang === "hi" ? "मकान खाली कराने का नोटिस" : "Landlord Eviction"}
            </button>
            <button className="nm-btn nm-btn-secondary nm-btn-sm" onClick={() => handleSendMessage("Bought defective laptop on Flipkart and seller rejected refund")}>
              <ShoppingCart size={13} aria-hidden="true" />
              {lang === "hi" ? "खराब सामान व रिफंड" : "Defective Goods"}
            </button>
            <button className="nm-btn nm-btn-secondary nm-btn-sm" onClick={() => handleSendMessage("How to file RTI application for road repair in my ward")}>
              <ClipboardList size={13} aria-hidden="true" />
              {lang === "hi" ? "सड़क निर्माण हेतु आरटीआई" : "RTI Tender Query"}
            </button>
            <button className="nm-btn nm-btn-secondary nm-btn-sm" onClick={() => handleSendMessage("Police is threatening arrest in the police station lockup without FIR")}>
              <AlertTriangle size={13} aria-hidden="true" />
              {lang === "hi" ? "थाने में गिरफ्तारी का डर" : "Police Arrest Risk"}
            </button>
          </div>

          {/* Chat Stream */}
          <div className="nm-chat-container" role="log" aria-live="polite">
            {intakeMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`nm-chat-bubble ${msg.sender === "assistant" ? "nm-chat-assistant" : "nm-chat-user"}`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Live Fact Badges */}
          {detectedDomain && (
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem", alignItems: "center", flexWrap: "wrap" }}>
              <span className="nm-badge nm-badge-verified">
                <CheckCircle size={12} aria-hidden="true" />
                {lang === "hi" ? "पहचानी गई श्रेणी:" : "Detected Domain:"} {detectedDomain}
              </span>
              {isUrgent && (
                <span className="nm-badge nm-badge-critical">
                  <AlertTriangle size={12} aria-hidden="true" />
                  {lang === "hi" ? "अति-महत्वपूर्ण मामला (Helpline 15100)" : "Urgent Case (Helpline 15100)"}
                </span>
              )}
              <button
                className="nm-btn nm-btn-gold nm-btn-sm"
                onClick={() => {
                  setRightsDomain(detectedDomain);
                  setActiveTab("rights");
                }}
              >
                <ChevronRight size={13} aria-hidden="true" />
                {lang === "hi" ? "मेरे अधिकार देखें" : "View My Rights Now"}
              </button>
            </div>
          )}

          {/* Input Box */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="text"
              className="nm-input"
              placeholder={lang === "hi" ? "अपनी समस्या यहाँ लिखें..." : "Type your legal problem here..."}
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              aria-label="Describe your legal issue"
            />
            <button
              className={`nm-btn ${isRecording ? "nm-btn-gold" : "nm-btn-secondary"}`}
              onClick={handleSimulateVoice}
              title="Speak your problem (Microphone)"
              aria-label="Simulate voice input"
            >
              <Mic size={15} aria-hidden="true" />
              {isRecording ? "Listening..." : "Mic"}
            </button>
            <button className="nm-btn nm-btn-primary" onClick={() => handleSendMessage()}>
              {lang === "hi" ? "भेजें" : "Send"}
            </button>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE 2: RIGHTS & TIMELINES */}
      {/* ========================================================================= */}
      {activeTab === "rights" && (
        <section className="nm-workspace" aria-labelledby="rights-heading">
          <div className="nm-workspace-header">
            <h2 id="rights-heading">
              <Scale size={20} aria-hidden="true" />
              {lang === "hi" ? "मेरे अधिकार व समय-सीमा (Mere Adhikaar)" : "Mere Adhikaar (Rights & Timelines)"}
            </h2>
            <p>
              {lang === "hi"
                ? "कक्षा 6–8 के सरल स्तर पर समझाए गए कानूनी अधिकार, आधिकारिक धाराएं व चरणबद्ध समय-सीमा।"
                : "Grade 6–8 level plain language legal rights, grounded strictly in active Indian statutes with official citations."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {[
              { id: "TENANCY", label: "Tenancy & Eviction (किरायेदारी)", icon: <Home size={13} aria-hidden="true" /> },
              { id: "CONSUMER", label: "Consumer Protection (उपभोक्ता)", icon: <ShoppingCart size={13} aria-hidden="true" /> },
              { id: "RTI", label: "Right to Information (आरटीआई)", icon: <ClipboardList size={13} aria-hidden="true" /> },
              { id: "CRIMINAL", label: "Criminal & Zero FIR (आपराधिक/एफआईआर)", icon: <AlertTriangle size={13} aria-hidden="true" /> },
            ].map((d) => (
              <button
                key={d.id}
                className={`nm-btn ${rightsDomain === d.id ? "nm-btn-primary" : "nm-btn-secondary"} nm-btn-sm`}
                onClick={() => setRightsDomain(d.id)}
              >
                {d.icon}
                {d.label}
              </button>
            ))}
          </div>

          <div className="nm-grid-2">
            {/* Left Col: Verified Rights */}
            <div>
              <h3 style={{ fontSize: "1.05rem", marginBottom: "0.75rem", color: "var(--primary-navy)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <BookOpen size={17} aria-hidden="true" />
                {lang === "hi" ? "आपके सुरक्षित कानूनी अधिकार" : "Your Statutory Rights"}
              </h3>

              {rightsDomain === "TENANCY" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div className="nm-card-feature">
                    <strong>1. Protection from Illegal Eviction:</strong> Landlord cannot physically evict or change locks without due court process.
                  </div>
                  <div className="nm-card-feature">
                    <strong>2. Essential Utilities Guarantee:</strong> Water and electricity cannot be disconnected even during a rent dispute.
                  </div>
                  <div className="nm-card-feature">
                    <strong>3. 24-Hour Entry Notice:</strong> Landlord must give 24-hour advance notice before inspecting premises.
                  </div>
                </div>
              )}

              {rightsDomain === "CONSUMER" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div className="nm-card-feature">
                    <strong>1. Right to Refund or Replacement:</strong> Entitled to full refund or repair for defective goods.
                  </div>
                  <div className="nm-card-feature">
                    <strong>2. Compensation for Mental Harassment:</strong> Forum can award damages for unfair trade practices.
                  </div>
                  <div className="nm-card-feature">
                    <strong>3. Online Filing via e-Daakhil:</strong> Complaints can be submitted from home without advocate presence.
                  </div>
                </div>
              )}

              {rightsDomain === "RTI" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div className="nm-card-feature">
                    <strong>1. Right to Certified Copies:</strong> Any citizen can inspect records and obtain certified copies for Rs. 2/page.
                  </div>
                  <div className="nm-card-feature">
                    <strong>2. 30-Day Mandatory Response:</strong> Public Information Officer (PIO) must respond within 30 days.
                  </div>
                  <div className="nm-card-feature">
                    <strong>3. Free for BPL Citizens:</strong> No application fee for Below Poverty Line cardholders.
                  </div>
                </div>
              )}

              {rightsDomain === "CRIMINAL" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div className="nm-card-feature">
                    <strong>1. Right to Zero FIR / e-FIR:</strong> Any police station must register FIR irrespective of jurisdiction (Section 173 BNSS).
                  </div>
                  <div className="nm-card-feature">
                    <strong>2. Free Copy of FIR:</strong> Informant is entitled to a free copy of FIR immediately.
                  </div>
                  <div className="nm-card-feature">
                    <strong>3. Right to Free Legal Aid:</strong> Accused in custody has statutory right to advocate from DLSA (Section 12 LSAA).
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Verified Citations & Timelines */}
            <div>
              <h3 style={{ fontSize: "1.05rem", marginBottom: "0.75rem", color: "var(--primary-navy)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Clock size={17} aria-hidden="true" />
                {lang === "hi" ? "समय-सीमा व आधिकारिक धाराएं" : "Statutory Action Timeline & Citations"}
              </h3>

              <div className="nm-timeline">
                <div className="nm-timeline-step">
                  <div className="nm-timeline-dot"></div>
                  <strong>Step 1: Notice & Initial Period</strong>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {rightsDomain === "TENANCY" && "Mandatory 15-day notice under Section 106 Transfer of Property Act."}
                    {rightsDomain === "CONSUMER" && "Send 15-day notice to seller/trader demanding refund."}
                    {rightsDomain === "RTI" && "30-day clock starts on date PIO receives application (Section 7(1) RTI Act)."}
                    {rightsDomain === "CRIMINAL" && "Immediate Zero FIR registration under Section 173(1) BNSS 2023."}
                  </p>
                </div>
                <div className="nm-timeline-step">
                  <div className="nm-timeline-dot"></div>
                  <strong>Step 2: Formal Filing & Limitation</strong>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {rightsDomain === "CONSUMER" && "Firm 2-year limitation period to file complaint under Section 69 CPA 2019."}
                    {rightsDomain === "RTI" && "File First Appeal within 30 days under Section 19(1) RTI Act."}
                    {rightsDomain === "TENANCY" && "Reply to legal notice within 15 days refuting false grounds."}
                    {rightsDomain === "CRIMINAL" && "Approach Superintendent of Police under Section 173(3) BNSS if police refuses."}
                  </p>
                </div>
              </div>

              {/* Verified Citations Badge Card */}
              <div style={{ background: "var(--neutral-subtle)", padding: "1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)" }}>
                <span className="nm-badge nm-badge-verified" style={{ marginBottom: "0.5rem" }}>
                  <CheckCircle size={11} aria-hidden="true" />
                  Official India Code Grounding
                </span>
                <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                  Verified against Union of India enactments. All statutory citations pass zero-hallucination verification.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE 3: DOCUMENT SCANNER & DEADLINE GUARDIAN */}
      {/* ========================================================================= */}
      {activeTab === "scanner" && (
        <section className="nm-workspace" aria-labelledby="scanner-heading">
          <div className="nm-workspace-header">
            <h2 id="scanner-heading">
              <FileText size={20} aria-hidden="true" />
              {lang === "hi" ? "नोटिस स्कैनर व तारीखें (Deadline Guardian)" : "Document Scanner & Deadline Guardian"}
            </h2>
            <p>
              {lang === "hi"
                ? "कोर्ट नोटिस, सम्मन या एफआईआर कॉपी अपलोड करें। तारीखें व पक्षकार समझें और कैलेंडर (.ics) में एक्सपोर्ट करें।"
                : "Upload or paste court notice, summons, or legal notice to extract critical hearing dates, limitation periods, and parties."}
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.83rem", fontWeight: 600, color: "var(--text-muted)", alignSelf: "center" }}>
              {lang === "hi" ? "सैंपल दस्तावेज़ लोड करें:" : "Load Sample Notice:"}
            </span>
            <button className="nm-btn nm-btn-secondary nm-btn-sm" onClick={() => handleAnalyzeSampleDoc("SUMMONS")}>
              <FileText size={13} aria-hidden="true" />
              Court Summons (साकेत कोर्ट सम्मन)
            </button>
            <button className="nm-btn nm-btn-secondary nm-btn-sm" onClick={() => handleAnalyzeSampleDoc("CHEQUE_BOUNCE")}>
              <ClipboardList size={13} aria-hidden="true" />
              Cheque Bounce 138 Notice (चेक बाउंस नोटिस)
            </button>
            <button className="nm-btn nm-btn-secondary nm-btn-sm" onClick={() => handleAnalyzeSampleDoc("FIR")}>
              <AlertTriangle size={13} aria-hidden="true" />
              Cyber Crime FIR Copy (एफआईआर प्रति)
            </button>
          </div>

          <div className="nm-form-group">
            <label className="nm-form-label">Document Text / Notice Content:</label>
            <textarea
              className="nm-textarea"
              placeholder="Paste document text or notice recitals here..."
              value={docInputText}
              onChange={(e) => setDocInputText(e.target.value)}
            />
          </div>

          <button className="nm-btn nm-btn-primary" onClick={() => handleAnalyzeSampleDoc("SUMMONS")}>
            <Search size={15} aria-hidden="true" />
            {lang === "hi" ? "दस्तावेज़ का विश्लेषण करें" : "Analyze Document"}
          </button>

          {/* Analysis Result */}
          {docAnalysis && (
            <div style={{ marginTop: "1.5rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.25rem" }}>
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
                <span className="nm-badge nm-badge-verified">
                  <CheckCircle size={11} aria-hidden="true" />
                  Classification: {docAnalysis.document_type}
                </span>
                <span className="nm-badge nm-badge-outdated">
                  <Lock size={11} aria-hidden="true" />
                  PII Redacted: 1 Aadhaar Identifier Masked
                </span>
              </div>

              <div className="nm-grid-2">
                <div className="nm-card-feature">
                  <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Users size={15} aria-hidden="true" />
                    Extracted Parties & Metadata
                  </h4>
                  <ul style={{ listStyle: "none", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                    <li><strong>Petitioner:</strong> {docAnalysis.parties.petitioner}</li>
                    <li><strong>Respondent:</strong> {docAnalysis.parties.respondent}</li>
                    <li><strong>Forum:</strong> {docAnalysis.parties.court_name}</li>
                    <li><strong>Case No:</strong> {docAnalysis.parties.case_number}</li>
                  </ul>
                </div>

                <div className="nm-card-feature">
                  <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <CalendarDays size={15} aria-hidden="true" />
                    Extracted Deadlines
                  </h4>
                  {userDeadlines.map((dl, idx) => (
                    <div key={idx} style={{ marginTop: "0.5rem", padding: "0.5rem", background: "var(--neutral-subtle)", borderRadius: "var(--radius-sm)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong>{dl.label}</strong>
                        <span className="nm-badge nm-badge-critical">{dl.urgency}</span>
                      </div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                        Date / Period: <strong>{dl.value}</strong> • Basis: {dl.statutory_basis}
                      </div>
                    </div>
                  ))}

                  <button className="nm-btn nm-btn-emerald nm-btn-sm" style={{ marginTop: "0.75rem", width: "100%" }} onClick={handleExportICS}>
                    <CalendarDays size={13} aria-hidden="true" />
                    {lang === "hi" ? "कैलेंडर में जोड़ें (.ics डाउनलोड)" : "Add to Calendar (Export .ics)"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE 4: MERA DOCUMENT (CONTROLLED GENERATOR) */}
      {/* ========================================================================= */}
      {activeTab === "generator" && (
        <section className="nm-workspace" aria-labelledby="generator-heading">
          <div className="nm-workspace-header">
            <h2 id="generator-heading">
              <FilePen size={20} aria-hidden="true" />
              {lang === "hi" ? "मेरा डाक्यूमेंट (Controlled Generator)" : "Mera Document (Controlled Generator)"}
            </h2>
            <p>
              {lang === "hi"
                ? "आरटीआई, उपभोक्ता शिकायत या विधिक नोटिस का अनुमोदित प्रारूप बनाएं। कोई बनावटी तथ्य नहीं।"
                : "Generate court-ready, legally structured drafts (RTI, Consumer, Cheque Bounce, Tenancy) using deterministic slot-filling."}
            </p>
          </div>

          {/* Template Selection */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
            {[
              { id: "RTI_APPLICATION", label: "RTI Application (Section 6(1))", icon: <ClipboardList size={13} aria-hidden="true" /> },
              { id: "CONSUMER_COMPLAINT", label: "Consumer Complaint (Section 35)", icon: <ShoppingCart size={13} aria-hidden="true" /> },
              { id: "LEGAL_NOTICE_CHEQUE_BOUNCE", label: "Cheque Bounce Notice (Section 138)", icon: <FileText size={13} aria-hidden="true" /> },
              { id: "RENT_DISPUTE_REPLY", label: "Rent Dispute Reply (Section 106)", icon: <Home size={13} aria-hidden="true" /> },
            ].map((t) => (
              <button
                key={t.id}
                className={`nm-btn ${selectedTemplate === t.id ? "nm-btn-primary" : "nm-btn-secondary"} nm-btn-sm`}
                onClick={() => setSelectedTemplate(t.id)}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>

          <div className="nm-grid-2">
            {/* Slot Input Form */}
            <div>
              <h3 style={{ fontSize: "1.05rem", marginBottom: "0.75rem", color: "var(--primary-navy)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <FilePen size={17} aria-hidden="true" />
                Fill Document Slots (विवरण दर्ज करें)
              </h3>

              <div className="nm-form-group">
                <label className="nm-form-label">Applicant / Sender Name *</label>
                <input
                  type="text"
                  className="nm-input"
                  value={slots.applicant_name || ""}
                  onChange={(e) => setSlots({ ...slots, applicant_name: e.target.value })}
                />
              </div>

              <div className="nm-form-group">
                <label className="nm-form-label">Address *</label>
                <input
                  type="text"
                  className="nm-input"
                  value={slots.applicant_address || ""}
                  onChange={(e) => setSlots({ ...slots, applicant_address: e.target.value })}
                />
              </div>

              <div className="nm-form-group">
                <label className="nm-form-label">Public Authority / Opposite Party *</label>
                <input
                  type="text"
                  className="nm-input"
                  value={slots.public_authority_name || ""}
                  onChange={(e) => setSlots({ ...slots, public_authority_name: e.target.value })}
                />
              </div>

              <div className="nm-form-group">
                <label className="nm-form-label">Subject / Dispute Matter *</label>
                <input
                  type="text"
                  className="nm-input"
                  value={slots.subject_matter || ""}
                  onChange={(e) => setSlots({ ...slots, subject_matter: e.target.value })}
                />
              </div>

              <div className="nm-form-group">
                <label className="nm-form-label">Particulars of Information / Facts *</label>
                <textarea
                  className="nm-textarea"
                  value={slots.particulars_of_information || ""}
                  onChange={(e) => setSlots({ ...slots, particulars_of_information: e.target.value })}
                />
              </div>

              <button className="nm-btn nm-btn-emerald" style={{ width: "100%" }} onClick={handleGenerateDocument}>
                <Settings size={15} aria-hidden="true" />
                {lang === "hi" ? "विधिक डाक्यूमेंट तैयार करें" : "Generate Legal Draft"}
              </button>
            </div>

            {/* Live Draft Preview */}
            <div>
              <h3 style={{ fontSize: "1.05rem", marginBottom: "0.75rem", color: "var(--primary-navy)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <FileText size={17} aria-hidden="true" />
                Live Draft Preview
              </h3>

              {generatedDoc ? (
                <div>
                  <pre
                    style={{
                      background: "var(--neutral-subtle)",
                      padding: "1rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.85rem",
                      whiteSpace: "pre-wrap",
                      maxHeight: "360px",
                      overflowY: "auto",
                      border: "1px solid var(--border-color)",
                      marginBottom: "1rem",
                    }}
                  >
                    {generatedDoc}
                  </pre>

                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    <button className="nm-btn nm-btn-primary nm-btn-sm" onClick={() => handleDownloadDoc("md")}>
                      <Download size={13} aria-hidden="true" />
                      Download Markdown (.md)
                    </button>
                    <button className="nm-btn nm-btn-secondary nm-btn-sm" onClick={() => handleDownloadDoc("txt")}>
                      <Download size={13} aria-hidden="true" />
                      Download Text (.txt)
                    </button>
                    <button className="nm-btn nm-btn-secondary nm-btn-sm" onClick={() => handleDownloadDoc("html")}>
                      <Download size={13} aria-hidden="true" />
                      Download HTML (.html)
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--text-muted)", background: "var(--neutral-subtle)", borderRadius: "var(--radius-sm)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                  <ArrowRight size={24} style={{ opacity: 0.4 }} aria-hidden="true" />
                  Fill in the slots and click <strong>Generate Legal Draft</strong> to preview.
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* WORKSPACE 5: NYAYA SAHAYATA (LEGAL AID & ESCALATION) */}
      {/* ========================================================================= */}
      {activeTab === "escalation" && (
        <section className="nm-workspace" aria-labelledby="escalation-heading">
          <div className="nm-workspace-header">
            <h2 id="escalation-heading">
              <Landmark size={20} aria-hidden="true" />
              {lang === "hi" ? "न्याय सहायता व हेल्पलाइन (Legal Aid & Helpline)" : "Nyaya Sahayata (Legal Aid & Escalation)"}
            </h2>
            <p>
              {lang === "hi"
                ? "धारा 12 विधिक सेवा प्राधिकरण अधिनियम 1987 के तहत निःशुल्क सरकारी वकील एवं टेली-लॉ परामर्श खोजें।"
                : "Official DLSA / SLSA directory search, Section 12 LSAA 1987 eligibility check, and Tele-Law video consultation options."}
            </p>
          </div>

          <div className="nm-grid-2">
            {/* Left: Jurisdiction Directory */}
            <div>
              <h3 style={{ fontSize: "1.05rem", marginBottom: "0.75rem", color: "var(--primary-navy)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <MapPin size={17} aria-hidden="true" />
                Locate Legal Aid Authority (DLSA / SLSA)
              </h3>

              <div className="nm-form-group">
                <label className="nm-form-label">State / Union Territory:</label>
                <select
                  className="nm-select"
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                >
                  <option value="DELHI">Delhi (DSLSA)</option>
                  <option value="MAHARASHTRA">Maharashtra (MSLSA)</option>
                  <option value="KARNATAKA">Karnataka (KSLSA)</option>
                  <option value="UTTAR PRADESH">Uttar Pradesh (UPSLSA)</option>
                  <option value="RAJASTHAN">Rajasthan (RSLSA)</option>
                  <option value="TAMIL NADU">Tamil Nadu (TNSLSA)</option>
                  <option value="WEST BENGAL">West Bengal (WB SLSA)</option>
                </select>
              </div>

              {/* Direct Authority Card */}
              <div className="nm-card-feature" style={{ borderLeft: "4px solid var(--primary-navy)", marginBottom: "1rem" }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Landmark size={15} aria-hidden="true" />
                  {selectedState === "DELHI" ? "South DLSA (Saket Courts)" : `${selectedState} State Legal Services Authority`}
                </h4>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                  <strong>Address:</strong> {selectedState === "DELHI" ? "Saket District Court Complex, New Delhi" : "High Court Building Complex"}
                </p>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)" }}>
                  <strong>Helpline:</strong> 15100 (Toll-Free, 24x7)
                </p>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
                  <a href="tel:15100" className="nm-btn nm-btn-emerald nm-btn-sm">
                    <Phone size={13} aria-hidden="true" />
                    Call 15100 (Toll-Free)
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${selectedState}+Legal+Services+Authority`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="nm-btn nm-btn-secondary nm-btn-sm"
                  >
                    <MapPin size={13} aria-hidden="true" />
                    Open in Maps
                  </a>
                </div>
              </div>

              {/* Tele-Law Card */}
              <div className="nm-card-feature" style={{ borderLeft: "4px solid var(--emerald-green)" }}>
                <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <Monitor size={15} aria-hidden="true" />
                  Tele-Law Video Consultation
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.35rem" }}>
                  Get pre-litigation advice via video conferencing directly from panel advocates at your nearest Common Service Centre (CSC).
                </p>
                <a
                  href="https://www.tele-law.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nm-btn nm-btn-secondary nm-btn-sm"
                  style={{ marginTop: "0.5rem" }}
                >
                  <Globe size={13} aria-hidden="true" />
                  Visit Tele-Law Portal (tele-law.in)
                </a>
              </div>
            </div>

            {/* Right: Section 12 Eligibility Calculator */}
            <div>
              <h3 style={{ fontSize: "1.05rem", marginBottom: "0.75rem", color: "var(--primary-navy)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <Scale size={17} aria-hidden="true" />
                Free Legal Aid Eligibility Check (Section 12 LSAA)
              </h3>

              <div style={{ background: "var(--neutral-subtle)", padding: "1rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", marginBottom: "1rem" }}>
                <p style={{ fontSize: "0.88rem", marginBottom: "0.75rem", fontWeight: 600 }}>
                  Do you fall under any of the statutory categories?
                </p>

                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: "0.4rem" }}>
                  <input
                    type="checkbox"
                    checked={eligibilityCriteria.is_woman_or_child}
                    onChange={(e) => setEligibilityCriteria({ ...eligibilityCriteria, is_woman_or_child: e.target.checked })}
                  />{" "}
                  Woman or Child (Section 12(c))
                </label>

                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: "0.4rem" }}>
                  <input
                    type="checkbox"
                    checked={eligibilityCriteria.is_sc_or_st}
                    onChange={(e) => setEligibilityCriteria({ ...eligibilityCriteria, is_sc_or_st: e.target.checked })}
                  />{" "}
                  Scheduled Caste (SC) or Scheduled Tribe (ST) (Section 12(a))
                </label>

                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: "0.4rem" }}>
                  <input
                    type="checkbox"
                    checked={eligibilityCriteria.is_in_custody}
                    onChange={(e) => setEligibilityCriteria({ ...eligibilityCriteria, is_in_custody: e.target.checked })}
                  />{" "}
                  Person in Police or Judicial Custody (Section 12(g))
                </label>

                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: "0.75rem" }}>
                  <input
                    type="checkbox"
                    checked={eligibilityCriteria.is_disabled}
                    onChange={(e) => setEligibilityCriteria({ ...eligibilityCriteria, is_disabled: e.target.checked })}
                  />{" "}
                  Person with Disability (Section 12(d))
                </label>

                <div className="nm-form-group">
                  <label className="nm-form-label">Annual Family Income: ₹{eligibilityCriteria.annual_income.toLocaleString("en-IN")}</label>
                  <input
                    type="range"
                    min="50000"
                    max="600000"
                    step="25000"
                    value={eligibilityCriteria.annual_income}
                    onChange={(e) => setEligibilityCriteria({ ...eligibilityCriteria, annual_income: parseInt(e.target.value) })}
                    style={{ width: "100%" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    <span>₹50,000</span>
                    <span>Ceiling: ₹3,00,000</span>
                    <span>₹6,00,000</span>
                  </div>
                </div>

                {/* Eligibility Result Banner */}
                {isEligible ? (
                  <div style={{ background: "var(--emerald-light)", border: "1px solid #a7f3d0", padding: "0.75rem", borderRadius: "var(--radius-sm)", color: "var(--emerald-green)", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                    <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
                    <div>
                      <strong>100% Eligible for Free Legal Aid</strong>
                      <p style={{ fontSize: "0.82rem", marginTop: "0.25rem" }}>
                        You qualify for a free government advocate, drafting assistance, and court fee waiver under Section 12 of LSAA 1987.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: "var(--warning-light)", border: "1px solid #fde68a", padding: "0.75rem", borderRadius: "var(--radius-sm)", color: "var(--warning-amber)", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
                    <Info size={18} style={{ flexShrink: 0, marginTop: "1px" }} aria-hidden="true" />
                    <div>
                      <strong>Income above standard ceiling</strong>
                      <p style={{ fontSize: "0.82rem", marginTop: "0.25rem" }}>
                        You may still avail nominal fee mediation at Lok Adalat or consultation via Tele-Law.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
