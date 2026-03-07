import { useState, useEffect, useCallback, useRef } from "react";

/* ════════════════════════════════════════════
   SAFE PATH ONTARIO
   A guided support journey for GBV survivors
   ════════════════════════════════════════════ */

/* ════════════ design tokens ════════════ */
const C = {
  sage: "#6B8F71", sagePale: "#E8F0E9", sand: "#F5F0EB", sandWarm: "#E5DDD4",
  deep: "#2C3E2D", text: "#3A3A3A", textLight: "#7A7A7A", cream: "#FDFBF8",
  white: "#FFFFFF", emergency: "#C4453C", emergencyBg: "#FFF5F4", terracotta: "#C4756E",
};
const FONTS = { serif: "'Georgia', 'Times New Roman', serif", body: "system-ui, -apple-system, 'Segoe UI', sans-serif" };

/* ════════════ styles ════════════ */
const S = {
  root: { fontFamily: FONTS.body, background: C.cream, color: C.text, minHeight: "100vh", lineHeight: 1.65, WebkitFontSmoothing: "antialiased" },
  loadWrap: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" },
  loadDot: { width: 12, height: 12, borderRadius: "50%", background: C.sage, animation: "pulse 1.5s infinite" },

  quickExit: { position: "fixed", top: 12, right: 12, zIndex: 10000, background: C.emergency, color: "white", border: "none", padding: "10px 20px", fontFamily: FONTS.body, fontSize: 13, fontWeight: 700, borderRadius: 8, cursor: "pointer", letterSpacing: 0.5, boxShadow: "0 2px 12px rgba(196,69,60,0.35)" },
  safetyBanner: { background: C.deep, color: "rgba(255,255,255,0.8)", padding: "10px 80px 10px 16px", fontSize: 12, textAlign: "center", lineHeight: 1.5 },

  nav: { background: "rgba(253,251,248,0.95)", backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.sandWarm}`, position: "sticky", top: 0, zIndex: 100 },
  navInner: { maxWidth: 960, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 },
  logo: { display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", padding: 0 },
  logoIcon: { fontSize: 20 },
  logoText: { fontFamily: FONTS.serif, fontSize: 17, fontWeight: 700, color: C.deep, letterSpacing: -0.3 },
  navLinks: { display: "flex", gap: 4, alignItems: "center" },
  navLink: { background: "none", border: "none", padding: "6px 12px", fontSize: 13, color: C.textLight, cursor: "pointer", borderRadius: 6, fontFamily: FONTS.body, fontWeight: 500 },
  navLinkActive: { color: C.deep, background: C.sagePale },

  content: { minHeight: "calc(100vh - 200px)" },

  // Hero
  hero: { position: "relative", overflow: "hidden", padding: "72px 20px 56px", textAlign: "center" },
  heroBg: { position: "absolute", inset: 0, background: `linear-gradient(160deg, ${C.sagePale} 0%, ${C.sand} 45%, ${C.cream} 100%)`, zIndex: 0 },
  heroContent: { position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto" },
  heroBadge: { display: "inline-block", background: "rgba(107,143,113,0.12)", color: C.sage, fontSize: 11, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase", padding: "5px 14px", borderRadius: 20, marginBottom: 20 },
  heroTitle: { fontFamily: FONTS.serif, fontSize: "clamp(28px, 4.5vw, 42px)", fontWeight: 700, color: C.deep, lineHeight: 1.25, marginBottom: 16, letterSpacing: -0.5 },
  heroSub: { fontSize: 15, color: C.textLight, lineHeight: 1.8, marginBottom: 28, maxWidth: 500, margin: "0 auto 28px" },
  heroActions: { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
  primaryBtn: { background: C.sage, color: "white", border: "none", padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: FONTS.body, boxShadow: "0 2px 10px rgba(107,143,113,0.25)" },
  secondaryBtn: { background: "transparent", color: C.deep, border: `1.5px solid ${C.sandWarm}`, padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.body },

  // Emergency strip
  emergencyStrip: { background: C.emergencyBg, borderTop: "1.5px solid rgba(196,69,60,0.1)", borderBottom: "1.5px solid rgba(196,69,60,0.1)", padding: "16px 20px" },
  emergencyInner: { maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" },
  emergencyDot: { width: 8, height: 8, borderRadius: "50%", background: C.emergency, animation: "pulse 2s infinite" },
  emergencyLabel: { fontSize: 13, fontWeight: 600, color: C.emergency },
  emergencyPhone: { fontFamily: FONTS.serif, fontSize: 18, fontWeight: 700, color: C.deep, background: "white", padding: "6px 16px", borderRadius: 8, textDecoration: "none", border: "1px solid rgba(196,69,60,0.12)" },
  emergencyOr: { fontSize: 12, color: C.textLight },

  // Info section
  infoSection: { maxWidth: 960, margin: "0 auto", padding: "56px 20px" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20 },
  infoCard: { padding: 24, background: "white", borderRadius: 14, border: `1px solid ${C.sand}` },
  infoIcon: { fontSize: 24, display: "block", marginBottom: 12 },
  infoTitle: { fontFamily: FONTS.serif, fontSize: 16, fontWeight: 700, color: C.deep, marginBottom: 6 },
  infoDesc: { fontSize: 13, color: C.textLight, lineHeight: 1.65 },

  // Journey
  journeyWrap: { maxWidth: 720, margin: "0 auto", padding: "40px 20px 80px" },
  progressBar: { display: "flex", alignItems: "center", justifyContent: "center", gap: 0, marginBottom: 40, flexWrap: "wrap", padding: "0 8px" },
  progressStep: { display: "flex", alignItems: "center", gap: 4 },
  progressDot: { width: 8, height: 8, borderRadius: "50%", transition: "background 0.3s", flexShrink: 0 },
  progressLabel: { fontSize: 10, fontWeight: 600, letterSpacing: 0.3, transition: "color 0.3s", whiteSpace: "nowrap" },
  progressLine: { width: 20, height: 2, borderRadius: 1, margin: "0 3px", transition: "background 0.3s", flexShrink: 0 },
  stepWrap: { animation: "fadeUp 0.4s ease" },
  stepTitle: { fontFamily: FONTS.serif, fontSize: "clamp(22px, 3.5vw, 30px)", fontWeight: 700, color: C.deep, marginBottom: 6 },
  stepSub: { fontSize: 14, color: C.textLight, marginBottom: 28, lineHeight: 1.7, maxWidth: 500 },
  choicesGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 },
  choiceCard: { background: "white", border: `1.5px solid ${C.sand}`, borderRadius: 14, padding: "20px 20px", textAlign: "left", cursor: "pointer", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 4, fontFamily: FONTS.body },
  choiceCardSmall: { background: "white", border: `1.5px solid ${C.sand}`, borderRadius: 10, padding: "14px 18px", textAlign: "left", cursor: "pointer", transition: "all 0.2s", fontFamily: FONTS.body },
  choiceActive: { borderColor: C.sage, background: C.sagePale, boxShadow: `0 0 0 3px ${C.sage}22` },
  choiceIcon: { fontSize: 22, marginBottom: 2 },
  choiceLabel: { fontSize: 15, fontWeight: 600, color: C.deep, display: "block" },
  choiceSub: { fontSize: 13, color: C.textLight },
  skipBtn: { background: "none", border: "none", color: C.sage, fontSize: 13, fontWeight: 600, cursor: "pointer", marginTop: 16, fontFamily: FONTS.body, padding: "8px 0" },
  backBtn: { position: "fixed", bottom: 24, left: 24, background: "white", border: `1.5px solid ${C.sandWarm}`, borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.body, color: C.deep, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" },

  // Results
  resultsHeader: { marginBottom: 24 },
  resultsGrid: { display: "grid", gridTemplateColumns: "1fr", gap: 12 },
  resCard: { background: "white", borderRadius: 14, padding: "20px 24px", border: `1px solid ${C.sand}`, cursor: "pointer", transition: "all 0.2s" },
  resCardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" },
  resName: { fontFamily: FONTS.serif, fontSize: 17, fontWeight: 700, color: C.deep, marginBottom: 6 },
  resTags: { display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 },
  resTag: { background: C.sagePale, color: C.sage, fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6 },
  resHighlight: { fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 6, border: "1.5px solid", background: "white" },
  resDesc: { fontSize: 13, color: C.textLight, lineHeight: 1.65 },
  resPhoneBtn: { background: C.sage, color: "white", textDecoration: "none", padding: "8px 16px", borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: FONTS.serif, whiteSpace: "nowrap", flexShrink: 0 },
  resDetails: { marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.sand}`, display: "flex", flexDirection: "column", gap: 6 },
  resDetail: { fontSize: 13, color: C.text },
  resDetailLabel: { fontWeight: 600, color: C.deep, marginRight: 8, display: "inline-block", minWidth: 70 },

  // What to Expect
  expectWrap: { marginTop: 16, padding: "18px 20px", background: "linear-gradient(135deg, #f8f6f2 0%, #f0ede8 100%)", borderRadius: 12, border: `1px solid ${C.sandWarm}` },
  expectTitle: { fontFamily: FONTS.serif, fontSize: 15, fontWeight: 700, color: C.deep, marginBottom: 12 },
  expectBlock: { marginTop: 12 },
  expectLabel: { fontSize: 12, fontWeight: 700, color: C.sage, letterSpacing: 0.3, textTransform: "uppercase", display: "block", marginBottom: 3 },
  expectText: { fontSize: 13, color: C.text, lineHeight: 1.7, margin: 0 },
  expectPending: { marginTop: 14, padding: "12px 16px", background: C.sand, borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start" },
  emptyState: { padding: 40, textAlign: "center" },
  contextBox: { background: C.sagePale, borderRadius: 12, padding: "18px 22px", marginBottom: 20, borderLeft: `3px solid ${C.sage}` },
  contextText: { fontSize: 14, color: C.deep, lineHeight: 1.75 },

  // Directory
  dirWrap: { maxWidth: 960, margin: "0 auto", padding: "40px 20px 80px" },
  dirFilters: { display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" },
  searchInput: { padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${C.sandWarm}`, fontSize: 14, fontFamily: FONTS.body, flex: 1, minWidth: 180, outline: "none", background: "white" },
  selectInput: { padding: "10px 14px", borderRadius: 8, border: `1.5px solid ${C.sandWarm}`, fontSize: 13, fontFamily: FONTS.body, background: "white", outline: "none", cursor: "pointer" },

  // Admin
  adminLoginWrap: { maxWidth: 400, margin: "0 auto", padding: "80px 20px", textAlign: "center" },
  adminRow: { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "white", borderRadius: 10, border: `1px solid ${C.sand}`, flexWrap: "wrap" },
  adminBtn: { background: "none", border: `1px solid ${C.sandWarm}`, borderRadius: 6, padding: "5px 12px", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: FONTS.body, color: C.text },

  // Form
  formWrap: { background: "white", borderRadius: 14, padding: 24, border: `1.5px solid ${C.sage}44`, marginBottom: 24 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 16px" },
  formGroup: { display: "flex", flexDirection: "column", gap: 4 },
  formLabel: { fontSize: 12, fontWeight: 600, color: C.deep },
  formSectionHeader: { display: "flex", gap: 10, alignItems: "flex-start", padding: "12px 14px", background: C.sagePale, borderRadius: 10 },
  formInput: { padding: "9px 12px", borderRadius: 8, border: `1.5px solid ${C.sandWarm}`, fontSize: 14, fontFamily: FONTS.body, outline: "none" },

  // Footer
  footer: { textAlign: "center", padding: "48px 20px 32px", borderTop: `1px solid ${C.sand}`, background: C.sand },
};

const globalCSS = `
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  button:hover { filter: brightness(0.96); }
  select:focus, input:focus, textarea:focus { border-color: ${C.sage} !important; }
  @media (max-width: 600px) {
    .nav-links { gap: 0 !important; }
  }
`;


const ADMIN_PIN = "safepath2026";

const CATEGORIES = [
  { id: "crisis", label: "Crisis Lines", icon: "🆘" },
  { id: "medical", label: "Medical Care", icon: "🏥" },
  { id: "counselling", label: "Counselling", icon: "💬" },
  { id: "legal-info", label: "Legal Information", icon: "📖" },
  { id: "legal-advocate", label: "Legal Advocacy & Court Support", icon: "⚖️" },
  { id: "shelter", label: "Shelters & Housing", icon: "🏠" },
  { id: "children", label: "Children & Youth", icon: "🧒" },
  { id: "seniors", label: "Seniors", icon: "🤝" },
  { id: "indigenous", label: "Indigenous Services", icon: "🪶" },
  { id: "lgbtq", label: "2SLGBTQ+", icon: "🌈" },
  { id: "male", label: "Male Survivors", icon: "👤" },
  { id: "financial", label: "Financial Aid", icon: "💰" },
  { id: "trafficking", label: "Human Trafficking", icon: "🔗" },
  { id: "reporting", label: "Reporting & Child Protection", icon: "🚨" },
];

const REGIONS = [
  "All Ontario","Toronto / GTA","Ottawa / Eastern","Hamilton / Niagara",
  "London / Southwestern","Kitchener-Waterloo","Northern Ontario",
  "Thunder Bay / Northwestern","Kingston / Southeastern","Durham / York / Peel",
  "Sudbury / Northeastern","Windsor / Essex"
];

const SITUATIONS = [
  { id: "sa-recent", label: "I was recently sexually assaulted", sub: "Within the last few days or weeks", icon: "🕊️" },
  { id: "ipv-ongoing", label: "I'm experiencing abuse from a partner or family member", sub: "It's happening now and I need to plan my next steps", icon: "🌿" },
  { id: "past", label: "I'm processing something from the past", sub: "Sexual abuse, assault, or violence — months or years ago", icon: "🌱" },
  { id: "leaving", label: "I'm thinking about leaving a situation", sub: "I want to understand my options for safety and housing", icon: "🚪" },
  { id: "someone", label: "I'm supporting someone else", sub: "A friend, partner, family member, or someone I care about", icon: "💛" },
  { id: "child", label: "A child or young person needs help", sub: "Someone under 18 is affected", icon: "🧒" },
  { id: "other", label: "Something else", sub: "Harassment, trafficking, or something that doesn't fit the options above", icon: "🧭" },
];

// Needs are now functions of the situation — only show what's relevant
const NEEDS_BY_SITUATION = {
  "sa-recent": [
    { id: "talk", label: "I need to talk to someone right now", sub: "Crisis support, someone to listen", icon: "📞", categories: ["crisis","counselling"] },
    { id: "medical", label: "I need medical care", sub: "Physical health, evidence collection, STI/pregnancy concerns", icon: "🏥", categories: ["medical"] },
    { id: "counselling", label: "I want ongoing counselling", sub: "Longer-term emotional and mental health support", icon: "💬", categories: ["counselling"] },
    { id: "legal-info", label: "I want to understand my legal rights", sub: "Free legal information and advice", icon: "📖", categories: ["legal-info"], skipApproach: true },
    { id: "notsure", label: "I'm not sure yet", sub: "Show me what's available", icon: "🧭", categories: ["crisis","counselling","medical","legal-info","legal-advocate"] },
  ],
  "ipv-ongoing": [
    { id: "talk", label: "I need to talk to someone right now", sub: "Crisis support, safety planning, someone to listen", icon: "📞", categories: ["crisis","counselling"] },
    { id: "safety", label: "I need a safe place to stay", sub: "Emergency shelter, transitional housing", icon: "🏠", categories: ["shelter"] },
    { id: "legal-advocate", label: "I want help navigating the legal system", sub: "Family court support, protection orders, court accompaniment", icon: "⚖️", categories: ["legal-advocate"] },
    { id: "legal-info", label: "I want to understand my legal rights", sub: "Free legal information and advice", icon: "📖", categories: ["legal-info"], skipApproach: true },
    { id: "money", label: "I need financial help", sub: "Emergency funds, rent support", icon: "💰", categories: ["financial"] },
    { id: "counselling", label: "I want ongoing counselling", sub: "Longer-term emotional and mental health support", icon: "💬", categories: ["counselling"] },
    { id: "notsure", label: "I'm not sure yet", sub: "Show me what's available", icon: "🧭", categories: ["crisis","counselling","shelter","legal-info","legal-advocate","financial"] },
  ],
  "past": [
    { id: "talk", label: "I need to talk to someone", sub: "Crisis support, someone to listen", icon: "📞", categories: ["crisis","counselling"] },
    { id: "counselling", label: "I want ongoing counselling or therapy", sub: "Longer-term support for healing", icon: "💬", categories: ["counselling"] },
    { id: "legal-info", label: "I want to understand my legal options", sub: "There is no time limit for reporting in Ontario", icon: "📖", categories: ["legal-info","legal-advocate"], skipApproach: true },
    { id: "notsure", label: "I'm not sure yet", sub: "Show me what's available", icon: "🧭", categories: ["crisis","counselling","legal-info","legal-advocate"] },
  ],
  "leaving": [
    { id: "safety", label: "I need a safe place to stay", sub: "Emergency shelter, transitional housing", icon: "🏠", categories: ["shelter"] },
    { id: "talk", label: "I need to talk to someone about my plan", sub: "Safety planning, crisis support", icon: "📞", categories: ["crisis","counselling"] },
    { id: "legal-advocate", label: "I need help with the legal side", sub: "Protection orders, family court, custody", icon: "⚖️", categories: ["legal-advocate"] },
    { id: "money", label: "I need financial help to leave", sub: "Emergency funds, rent support", icon: "💰", categories: ["financial"] },
    { id: "notsure", label: "I'm not sure yet", sub: "Show me what's available", icon: "🧭", categories: ["crisis","counselling","shelter","legal-advocate","financial"] },
  ],
  "someone": [
    { id: "talk", label: "I want to talk to someone about how to help", sub: "Get guidance on supporting someone", icon: "📞", categories: ["crisis","counselling"] },
    { id: "counselling", label: "I want to find counselling for them", sub: "Help them connect with a counsellor", icon: "💬", categories: ["counselling"] },
    { id: "notsure", label: "I'm not sure what they need", sub: "Show me what's available", icon: "🧭", categories: ["crisis","counselling","shelter","legal-info","legal-advocate"] },
  ],
  "child": [
    { id: "child-report", label: "I need to report that a child is being harmed", sub: "Contact a Children's Aid Society", icon: "🚨", categories: ["reporting"] },
    { id: "talk", label: "A young person needs someone to talk to", sub: "Crisis lines and counselling for youth", icon: "📞", categories: ["crisis","counselling","children"] },
    { id: "counselling", label: "A young person needs ongoing counselling", sub: "Longer-term therapy for children and youth", icon: "💬", categories: ["counselling","children"] },
    { id: "safety", label: "A child needs a safe place", sub: "Emergency shelter for families", icon: "🏠", categories: ["shelter"] },
    { id: "legal-advocate", label: "I need legal help to protect a child", sub: "Family court support, custody, protection orders", icon: "⚖️", categories: ["legal-advocate"] },
    { id: "notsure", label: "I'm not sure what's needed", sub: "Show me all available supports", icon: "🧭", categories: ["crisis","counselling","children","legal-info","legal-advocate","shelter","reporting"] },
  ],
  "other": [
    { id: "talk", label: "I need to talk to someone", sub: "Crisis support, someone to listen", icon: "📞", categories: ["crisis","counselling"] },
    { id: "counselling", label: "I want ongoing counselling", sub: "Longer-term emotional and mental health support", icon: "💬", categories: ["counselling"] },
    { id: "legal-info", label: "I want to understand my rights", sub: "Free legal information", icon: "📖", categories: ["legal-info"], skipApproach: true },
    { id: "safety", label: "I need a safe place to stay", sub: "Emergency shelter", icon: "🏠", categories: ["shelter"] },
    { id: "notsure", label: "I'm not sure yet", sub: "Show me what's available", icon: "🧭", categories: ["crisis","counselling","medical","legal-info","legal-advocate","shelter","financial","trafficking"] },
  ],
};

const APPROACHES = [
  { id: "community", label: "Community-based support", sub: "Counselling, crisis lines, peer support — no police or courts involved", icon: "🤝" },
  { id: "system", label: "I may want to involve police or the legal system", sub: "Reporting, legal aid, court accompaniment, protection orders", icon: "⚖️" },
  { id: "both", label: "Show me all options", sub: "I want to see everything and decide for myself", icon: "🌿" },
];

// Highlights are visible badges on resource cards — NOT identity questions asked of the user
const HIGHLIGHTS = [
  { id: "indigenous-led", label: "Indigenous-led", color: "#8B6F47" },
  { id: "lgbtq-affirming", label: "2SLGBTQ+ affirming", color: "#6B8F71" },
  { id: "male-survivors", label: "For male survivors", color: "#5C7A5F" },
  { id: "francophone", label: "Francophone / French", color: "#7A8E9E" },
  { id: "newcomer-friendly", label: "Newcomer-friendly", color: "#8B6F47" },
  { id: "youth-specific", label: "Youth-specific", color: "#C4756E" },
  { id: "seniors", label: "For seniors", color: "#6B8F71" },
  { id: "multilingual", label: "Multilingual", color: "#7A8E9E" },
  { id: "no-police-required", label: "No police report required", color: "#6B8F71" },
  { id: "anonymous", label: "Anonymous", color: "#5C7A5F" },
];

const SEED = [
  { id:"r1", name:"Assaulted Women's Helpline (AWHL)", categories:["crisis"], region:"All Ontario", phone:"1-866-863-0511", tty:"1-866-863-7868", text:"#SAFE (#7233)", website:"https://www.awhl.org", hours:"24/7", languages:"200+ languages incl. 17 Indigenous", description:"Free, anonymous crisis counselling, safety planning, emotional support, information and referrals for all women who have experienced any form of abuse.", highlights:["multilingual","anonymous","no-police-required","newcomer-friendly"], verified:"", whatToExpect:"When you call, a trained counsellor picks up. You don't have to give your name or any personal details. You can share as much or as little as you want — there's no pressure to tell your whole story. They'll listen, help you think through your options, and can connect you to local services if you'd like.", servicesOffered:"Crisis counselling, emotional support, safety planning, information about your rights, and referrals to shelters, legal aid, counselling centres and other community services across Ontario.", intakeProcess:"There is no intake process — you just call. No ID needed, no forms, no waitlist. If you hang up and call back another time, you don't need to start over. Each call is independent and anonymous.", accessibility:"TTY line available (1-866-863-7868). Interpreters in 200+ languages including 17 Indigenous languages are available on the line at no cost to you.", goodToKnow:"You can also text #SAFE (#7233) if you're not able to make a phone call. This is not a police line — nothing you say will be reported to police without your consent." },
  { id:"r2", name:"Fem'aide", categories:["crisis"], region:"All Ontario", phone:"1-877-336-2433", tty:"1-866-860-7082", website:"https://www.femaide.ca", hours:"24/7", languages:"French", description:"French-language crisis counselling and referral service for women experiencing violence.", highlights:["francophone"], verified:"" },
  { id:"r3", name:"Talk4Healing", categories:["crisis","indigenous"], region:"All Ontario", phone:"1-855-554-HEAL (4325)", website:"https://www.talk4healing.com", hours:"24/7", languages:"English, Ojibway, Oji-Cree, Cree + 10 Indigenous languages", description:"Culturally safe crisis support for Indigenous women and their families, grounded in Indigenous culture, wisdom and tradition.", highlights:["indigenous-led","multilingual"], verified:"" },
  { id:"r4", name:"Kids Help Phone", categories:["children","crisis","counselling"], region:"All Ontario", phone:"1-800-668-6868", website:"https://kidshelpphone.ca", hours:"24/7", languages:"English, French", description:"Free, bilingual phone and web counselling for children and youth in crisis, including sexual assault and abuse.", highlights:["youth-specific"], verified:"" },
  { id:"r5", name:"Ontario Male Survivors of Sexual Abuse Crisis Line", categories:["male","crisis"], region:"All Ontario", phone:"1-866-887-0015", hours:"24/7", languages:"Multilingual", description:"Immediate crisis and referral services for male survivors of sexual abuse, both recent and historical.", highlights:["male-survivors","multilingual"], verified:"" },
  { id:"r6", name:"Victim Support Line", categories:["crisis","legal-info"], region:"All Ontario", phone:"1-888-579-2888", hours:"24/7", languages:"Multilingual", description:"Province-wide information and referrals for victims of crime, including connecting to support services in your community.", verified:"" },
  { id:"r7", name:"Canadian Human Trafficking Hotline", categories:["trafficking","crisis"], region:"All Ontario", phone:"1-833-900-1010", hours:"24/7", languages:"Multilingual", description:"Connects victims and survivors of human trafficking with social services, law enforcement and emergency services.", verified:"" },
  { id:"r8", name:"Seniors Safety Line", categories:["seniors","crisis"], region:"All Ontario", phone:"1-866-299-1011", hours:"24/7", languages:"Multilingual", description:"Confidential support line for older adults experiencing abuse or neglect.", highlights:["seniors","multilingual"], verified:"" },
  { id:"r9", name:"Trans Lifeline", categories:["lgbtq","crisis"], region:"All Ontario", phone:"1-877-330-6366", website:"https://translifeline.org", hours:"24/7", languages:"English, Spanish", description:"Peer support crisis hotline run by and for trans people.", highlights:["lgbtq-affirming"], verified:"" },
  { id:"r10", name:"LGBT Youth Line", categories:["lgbtq","children","counselling"], region:"All Ontario", phone:"1-800-268-9688", text:"647-694-4275", website:"https://www.youthline.ca", hours:"Various", languages:"English", description:"Peer support for 2SLGBTQ+ youth through phone, text, and chat.", highlights:["lgbtq-affirming","youth-specific"], verified:"" },
  { id:"r11", name:"Ontario Network of SA/DV Treatment Centres", categories:["medical"], region:"All Ontario", phone:"1-855-628-7238", website:"https://www.sadvtreatmentcentres.ca", hours:"24/7 Navigation Line", languages:"Various", description:"37 hospital-based treatment centres across Ontario providing comprehensive medical care, evidence collection, counselling and follow-up for survivors of sexual and domestic violence.", highlights:["no-police-required"], verified:"", whatToExpect:"You can go to any emergency department and ask for the Sexual Assault/Domestic Violence Treatment Centre team. You don't need a police report and you don't need to have reported anything. A specially trained nurse will see you in a private area, not the general waiting room.", servicesOffered:"Medical care and treatment for injuries, STI testing and prevention, emergency contraception, forensic evidence collection (if you choose), crisis counselling, follow-up care and referrals to community services.", intakeProcess:"At the hospital, tell the triage nurse you're there for the sexual assault program — you don't need to explain details to them. The SA/DV team will meet with you in a private space. Everything is explained step by step, and you can say no to any part of the process. You can bring a support person with you.", accessibility:"Hospital-based so wheelchair accessible. If you're not sure which hospital has a centre, call the Navigation Line (1-855-628-7238) and they'll direct you to the closest one.", goodToKnow:"Evidence can be collected up to 12 days after an assault. Even if you're not sure about reporting to police, evidence can be collected and stored for up to 6 months while you decide. You are in control the entire time." },
  { id:"r12", name:"Legal Aid Ontario — Domestic Violence", categories:["legal-info"], region:"All Ontario", phone:"1-800-668-8258", website:"https://www.legalaid.on.ca", hours:"Mon–Fri", languages:"Multilingual", description:"Free legal help for domestic violence survivors with family law matters. Call the contact centre for priority access.", verified:"" },
  { id:"r13", name:"Independent Legal Advice for Sexual Assault Survivors", categories:["legal-info"], region:"All Ontario", website:"https://www.ontario.ca/independent-legal-advice-survivors-sexual-assault", hours:"By appointment", languages:"English, French", description:"Up to 4 hours of free, confidential legal advice by phone or video for sexual assault survivors in Ontario. Available any time after an assault.", verified:"" },
  { id:"r14", name:"ShelterSafe Ontario", categories:["shelter"], region:"All Ontario", website:"https://sheltersafe.ca/ontario/", hours:"24/7 crisis lines", languages:"Various", description:"Find your nearest women's shelter and crisis line. Includes emergency shelters, second-stage housing and safe homes across Ontario.", verified:"" },
  { id:"r15", name:"211 Ontario", categories:["counselling","shelter","financial"], region:"All Ontario", phone:"2-1-1", website:"https://211ontario.ca", hours:"24/7", languages:"150+ languages", description:"Free helpline connecting people to social services across Ontario. Real people answer 24/7 and can provide tailored referrals for GBV support, shelter, counselling and more.", highlights:["multilingual","newcomer-friendly"], verified:"" },
  { id:"r16", name:"Ontario Works Emergency Assistance", categories:["financial"], region:"All Ontario", website:"https://www.ontario.ca/page/ontario-works", hours:"Office hours", languages:"English, French", description:"Emergency financial assistance for those leaving abusive relationships, including support for housing, healthcare and childcare.", verified:"" },
  { id:"r17", name:"Anduhyaun Shelter", categories:["shelter","indigenous"], region:"Toronto / GTA", phone:"416-920-1492", hours:"24/7", languages:"English, Indigenous languages", description:"Emergency shelter for Indigenous women and their children fleeing violence.", highlights:["indigenous-led"], verified:"" },
  { id:"r18", name:"YWCA Women's Shelter Toronto", categories:["shelter","counselling"], region:"Toronto / GTA", website:"https://www.ywcatoronto.org", hours:"24/7", languages:"Various", description:"Emergency shelter with counselling and support for women and their children fleeing abuse.", verified:"" },
  { id:"r19", name:"Sherbourne Health — Rainbow Health Ontario", categories:["lgbtq","medical","counselling"], region:"Toronto / GTA", phone:"416-324-4100", website:"https://sherbourne.on.ca", hours:"Office hours", languages:"English", description:"Health and wellness services for 2SLGBTQ+ communities including specialized programs for trans and non-binary people.", highlights:["lgbtq-affirming"], verified:"" },
  { id:"r20", name:"2-Spirited People of the First Nation", categories:["indigenous","lgbtq"], region:"Toronto / GTA", phone:"416-944-9300", hours:"Office hours", languages:"English", description:"Culturally specific support for Indigenous Two-Spirit communities.", highlights:["indigenous-led","lgbtq-affirming"], verified:"" },
  { id:"r21", name:"Family Court Support Worker Program (Province-wide)", categories:["legal-advocate"], region:"All Ontario", website:"https://www.ontario.ca/page/connect-supports-survivors-violence", hours:"Court hours", languages:"Various", description:"Direct support for victims of domestic violence involved in the family court process, available at courthouses across Ontario.", verified:"" },
  { id:"r22", name:"Victim Crisis Assistance Ontario (VCAO)", categories:["crisis","legal-advocate"], region:"All Ontario", hours:"24/7", languages:"Various", description:"On-site crisis intervention for victims of crime and tragic circumstances, plus referrals, safety planning and court accompaniment.", verified:"" },
  // ── OCRCC Member Sexual Assault Centres ──
  { id:"r23", name:"Amelia Rising Sexual Violence Support Centre", categories:["crisis","counselling"], region:"Northern Ontario", phone:"(705) 476-3355", website:"http://www.ameliarising.ca/", hours:"Crisis line 24/7", languages:"English", description:"Crisis support, counselling, information and advocacy for survivors of sexual violence in the North Bay/Nipissing area.", verified:"" },
  { id:"r24", name:"Anova (London)", categories:["crisis","counselling","shelter"], region:"London / Southwestern", phone:"(800) 265-1576", website:"https://www.anovafuture.org/", hours:"Crisis line 24/7", languages:"English", description:"Crisis line, counselling, shelter and advocacy for survivors of sexual and domestic violence in London-Middlesex.", verified:"" },
  { id:"r25", name:"Athena's Sexual Assault Counselling & Advocacy Centre", categories:["crisis","counselling"], region:"Northern Ontario", phone:"(800) 987-0799", hours:"Crisis line 24/7", languages:"English", description:"Crisis support and counselling for survivors of sexual violence in Barrie and Simcoe County.", verified:"" },
  { id:"r26", name:"Chatham-Kent Sexual Assault Crisis Centre", categories:["crisis","counselling"], region:"London / Southwestern", phone:"(519) 354-8688", website:"https://cksacc.org/", hours:"Crisis line 24/7", languages:"English", description:"Crisis intervention, counselling, advocacy and public education for sexual violence survivors in Chatham-Kent.", verified:"" },
  { id:"r27", name:"Durham Rape Crisis Centre", categories:["crisis","counselling"], region:"Durham / York / Peel", phone:"(905) 668-9200", website:"https://drcc.ca", hours:"Crisis line 24/7", languages:"English", description:"Crisis support, individual and group counselling, court accompaniment and advocacy for survivors in Durham Region.", verified:"" },
  { id:"r28", name:"Family Transition Place", categories:["crisis","counselling","shelter"], region:"Durham / York / Peel", phone:"(800) 265-9178", website:"https://familytransitionplace.ca/", hours:"Crisis line 24/7", languages:"English", description:"Crisis line, counselling, emergency shelter and transitional support for survivors in Dufferin County and Peel.", verified:"" },
  { id:"r29", name:"Faye Peterson House", categories:["crisis","counselling","shelter"], region:"Thunder Bay / Northwestern", phone:"(800) 465-6971", website:"https://fayepeterson.org/", hours:"Crisis line 24/7", languages:"English", description:"Emergency shelter, crisis line, counselling and advocacy for women and children fleeing violence in Thunder Bay.", verified:"" },
  { id:"r30", name:"Guelph-Wellington Women in Crisis", categories:["crisis","counselling","shelter"], region:"Kitchener-Waterloo", phone:"(800) 265-7233", website:"https://gwwomenincrisis.org/", hours:"Crisis line 24/7", languages:"English", description:"24-hour crisis line, emergency shelter, counselling and outreach for women and children in Guelph-Wellington.", verified:"" },
  { id:"r31", name:"Hope 24/7 (Peel)", categories:["crisis","counselling"], region:"Durham / York / Peel", phone:"(800) 810-0180", website:"https://www.hope247.ca/", hours:"Crisis line 24/7", languages:"English", description:"Crisis support, counselling, accompaniment and advocacy for sexual violence survivors in Peel Region.", verified:"" },
  { id:"r32", name:"Kawartha Sexual Assault Centre", categories:["crisis","counselling"], region:"Kingston / Southeastern", phone:"(705) 741-0260", website:"http://kawarthasexualassaultcentre.com/", hours:"Crisis line 24/7", languages:"English", description:"Crisis line, individual and group counselling, court and hospital accompaniment for survivors in Peterborough and area.", verified:"" },
  { id:"r33", name:"Kenora Sexual Assault Centre", categories:["crisis","counselling"], region:"Thunder Bay / Northwestern", phone:"(800) 565-6161", website:"https://www.kenorasexualassaultcentre.ca/", hours:"Crisis line 24/7", languages:"English", description:"Crisis support, counselling and advocacy for sexual violence survivors in Kenora and northwestern Ontario.", verified:"" },
  { id:"r34", name:"Muskoka Parry Sound Sexual Assault Services", categories:["crisis","counselling"], region:"Northern Ontario", phone:"(800) 461-2929", website:"https://www.mpssas.org/", hours:"Crisis line 24/7", languages:"English", description:"Crisis line, counselling, accompaniment and community education for survivors in Muskoka and Parry Sound.", verified:"" },
  { id:"r35", name:"Niagara Region Sexual Assault Centre", categories:["crisis","counselling"], region:"Hamilton / Niagara", phone:"(905) 682-4584", website:"https://www.niagarasexualassaultcentre.com/", hours:"Crisis line 24/7", languages:"English", description:"Crisis support, counselling, advocacy and accompaniment for sexual violence survivors across the Niagara region.", verified:"" },
  { id:"r36", name:"Ottawa Rape Crisis Centre", categories:["crisis","counselling"], region:"Ottawa / Eastern", phone:"(613) 562-2333", website:"https://orcc.net/", hours:"Crisis line 24/7", languages:"English", description:"24-hour crisis line, counselling, support groups and advocacy for survivors of sexual violence in Ottawa.", verified:"" },
  { id:"r37", name:"Sexual Assault & Violence Intervention Services of Halton (SAVIS)", categories:["crisis","counselling"], region:"Toronto / GTA", phone:"(905) 875-1555", website:"https://www.savisofhalton.org/", hours:"Crisis line 24/7", languages:"English", description:"Crisis support, counselling, accompaniment and public education for survivors in Halton Region (Oakville area).", verified:"" },
  { id:"r38", name:"Sexual Assault Centre for Quinte & District", categories:["crisis","counselling"], region:"Kingston / Southeastern", phone:"(877) 544-6424", website:"https://www.sacqd.com/", hours:"Crisis line 24/7", languages:"English", description:"Crisis line, counselling, accompaniment and advocacy for survivors in the Belleville-Quinte area.", verified:"" },
  { id:"r39", name:"Sexual Assault Centre Hamilton & Area (SACHA)", categories:["crisis","counselling"], region:"Hamilton / Niagara", phone:"(905) 525-4162", website:"https://sacha.ca/", hours:"Crisis line 24/7", languages:"English", description:"Crisis support, individual and group counselling, accompaniment and public education in Hamilton and area.", verified:"" },
  { id:"r40", name:"Sexual Assault Centre Kingston (SACK)", categories:["crisis","counselling"], region:"Kingston / Southeastern", phone:"(877) 544-6424", website:"https://www.sackingston.com/", hours:"Crisis line 24/7", languages:"English", description:"24-hour crisis line, counselling, peer support, advocacy and court accompaniment for survivors in Kingston.", verified:"" },
  { id:"r41", name:"Sexual Assault Centre of Brant", categories:["crisis","counselling"], region:"Hamilton / Niagara", phone:"(519) 751-3471", website:"https://sacbrant.ca/", hours:"Crisis line 24/7", languages:"English", description:"Crisis support, counselling and advocacy for sexual violence survivors in Brant County.", verified:"" },
  { id:"r42", name:"Sexual Assault Crisis Centre of Essex County", categories:["crisis","counselling"], region:"Windsor / Essex", phone:"(519) 253-9667", website:"https://saccwindsor.net/", hours:"Crisis line 24/7", languages:"English", description:"Crisis intervention, counselling, advocacy and community education for survivors of sexual violence in Windsor-Essex.", verified:"" },
  { id:"r43", name:"Sexual Assault Support Centre of Ottawa (SASC)", categories:["crisis","counselling"], region:"Ottawa / Eastern", phone:"(613) 234-2266", website:"https://sascottawa.com/", hours:"Crisis line 24/7", languages:"English", description:"Crisis line, counselling, support groups, accompaniment and public education for survivors in Ottawa.", verified:"" },
  { id:"r44", name:"Sexual Assault Support Centre of Waterloo Region", categories:["crisis","counselling"], region:"Kitchener-Waterloo", phone:"(519) 741-8633", website:"https://www.sascwr.org/", hours:"Crisis line 24/7", languages:"English", description:"Crisis support, counselling, advocacy and public education for sexual violence survivors in Waterloo Region.", verified:"" },
  { id:"r45", name:"Sexual Assault Support Services — Stormont, Dundas, Glengarry & Akwesasne", categories:["crisis","counselling"], region:"Ottawa / Eastern", phone:"(613) 932-1603", website:"https://www.sassforwomen.ca/", hours:"Crisis line 24/7", languages:"English", description:"Crisis line, counselling and accompaniment for survivors in Cornwall, SD&G and Akwesasne.", highlights:["indigenous-led"], verified:"" },
  { id:"r46", name:"Sexual Assault Survivors' Centre Sarnia-Lambton", categories:["crisis","counselling"], region:"London / Southwestern", phone:"(519) 337-3320", website:"http://www.sexualassaultsarnia.ca/", hours:"Crisis line 24/7", languages:"English", description:"Crisis support, counselling and community education for survivors of sexual violence in Sarnia-Lambton.", verified:"" },
  { id:"r47", name:"Timmins & Area Women in Crisis", categories:["crisis","counselling","shelter"], region:"Sudbury / Northeastern", phone:"(877) 268-8380", website:"http://tawc.ca", hours:"Crisis line 24/7", languages:"English", description:"24-hour crisis line, emergency shelter, counselling and outreach for women and children in the Timmins area.", verified:"" },
  { id:"r48", name:"Toronto Rape Crisis Centre / Multicultural Women Against Rape (TRCC/MWAR)", categories:["crisis","counselling"], region:"Toronto / GTA", phone:"(416) 597-8808", website:"https://trccmwar.ca/", hours:"Crisis line 24/7", languages:"English", description:"Grassroots crisis line, counselling, accompaniment and advocacy for survivors of sexual violence in Toronto.", highlights:["newcomer-friendly"], verified:"" },
  { id:"r49", name:"Voices for Women (Sudbury)", categories:["crisis","counselling"], region:"Sudbury / Northeastern", phone:"(705) 671-5495", website:"https://www.voicesforwomen.ca/", hours:"Crisis line 24/7", languages:"English", description:"Crisis support, counselling, accompaniment and public education for sexual violence survivors in Sudbury.", verified:"" },
  { id:"r50", name:"Women in Crisis Algoma (Sault Ste. Marie)", categories:["crisis","counselling","shelter"], region:"Sudbury / Northeastern", phone:"(877) 759-1230", website:"https://womenincrisis.ca/", hours:"Crisis line 24/7", languages:"English", description:"Crisis line, emergency shelter, counselling and advocacy for women and children in Algoma / Sault Ste. Marie.", verified:"" },
  { id:"r51", name:"Women's Sexual Assault Centre of Renfrew County", categories:["crisis","counselling"], region:"Ottawa / Eastern", phone:"(800) 663-3060", website:"http://www.rcsac.org", hours:"Crisis line 24/7", languages:"English", description:"Crisis support, counselling and advocacy for survivors of sexual violence in Renfrew County.", verified:"" },
  { id:"r52", name:"Women's House Serving Bruce & Grey — Sexual Assault Services", categories:["crisis","counselling"], region:"London / Southwestern", phone:"(866) 578-5566", website:"https://www.whsbg.on.ca/", hours:"Crisis line 24/7", languages:"English", description:"Crisis line, counselling and sexual assault support services in Bruce and Grey counties.", verified:"" },
  { id:"r53", name:"Women's Support Network of York Region", categories:["crisis","counselling"], region:"Durham / York / Peel", phone:"(800) 263-6734", website:"https://womenssupportnetwork.ca/", hours:"Crisis line 24/7", languages:"English", description:"Crisis line, individual counselling, support groups and accompaniment for sexual violence survivors in York Region.", verified:"" },
  { id:"r54", name:"Sioux Lookout Sexual Assault & Counselling Centre", categories:["crisis","counselling"], region:"Thunder Bay / Northwestern", phone:"(800) 987-0799", website:"http://www.fsws.ca/slsac", hours:"Crisis line 24/7", languages:"English", description:"Crisis support and counselling for survivors of sexual violence in the Sioux Lookout area.", highlights:["indigenous-led"], verified:"" },
  // ── Legal Information Resources ──
  { id:"r55", name:"Steps to Justice — Family Law", categories:["legal-info"], region:"All Ontario", website:"https://stepstojustice.ca/category/legal-topic/family-law", hours:"Online anytime", languages:"English, French + more", description:"Free, plain-language legal information about family law in Ontario, including separation, custody, support, and protection orders. Created by Community Legal Education Ontario (CLEO).", verified:"" },
  { id:"r56", name:"Ontario Women's Justice Network (OWJN)", categories:["legal-info"], region:"All Ontario", website:"https://owjn.org", hours:"Online anytime", languages:"English", description:"Accessible legal information for women and survivors of violence. Covers family law, criminal law, immigration, and your rights through the justice system in Ontario.", verified:"" },
  { id:"r57", name:"Family Law Education for Women (onefamilylaw.ca)", categories:["legal-info"], region:"All Ontario", website:"https://onefamilylaw.ca", hours:"Online anytime", languages:"14 languages", description:"Plain language legal information on women's rights under Ontario family law. Available in 14 languages including Arabic, Chinese, Hindi, Somali, Spanish, Tamil, and Urdu.", highlights:["multilingual","newcomer-friendly"], verified:"" },
  { id:"r58", name:"Luke's Place — Legal Support for Women", categories:["legal-info","legal-advocate"], region:"All Ontario", website:"https://lukesplace.ca", hours:"Office hours", languages:"English", description:"Virtual legal information, safety planning, and support for women experiencing domestic violence navigating family law. Provides help understanding court processes and your rights.", verified:"" },
  { id:"r59", name:"Barbra Schlifer Commemorative Clinic", categories:["legal-info","legal-advocate","counselling"], region:"Toronto / GTA", phone:"416-323-9149", website:"https://www.schliferclinic.com", hours:"Office hours", languages:"Multilingual", description:"Free legal advice, family court support, counselling, and interpretation for women who have experienced violence. Offers legal representation in some cases.", highlights:["multilingual","newcomer-friendly"], verified:"" },
  // ── Family Court Support Workers (all Ontario locations) ──
  { id:"fc01", name:"FCSW — Women & Children's Shelter of Barrie", categories:["legal-advocate"], region:"Northern Ontario", hours:"Office hours", languages:"English, French (FLS)", description:"Free Family Court Support Worker at Barrie courthouse via Women & Children's Shelter of Barrie. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc02", name:"FCSW — Three Oaks Foundation (Belleville)", categories:["legal-advocate"], region:"Kingston / Southeastern", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Belleville courthouse via Three Oaks Foundation. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc03", name:"FCSW — Muskoka Victim Services (Bracebridge)", categories:["legal-advocate"], region:"Northern Ontario", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Bracebridge courthouse via Muskoka Victim Services. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc04", name:"FCSW — Indus Community Services (Brampton)", categories:["legal-advocate"], region:"Durham / York / Peel", hours:"Office hours", languages:"English, French (FLS)", description:"Free Family Court Support Worker at Brampton courthouse via Indus Community Services. Helps DV survivors navigate family court, safety planning, court accompaniment.", highlights:["newcomer-friendly"], verified:"" },
  { id:"fc05", name:"FCSW — Haldimand & Norfolk Women's Services (Brantford / Simcoe / Cayuga)", categories:["legal-advocate"], region:"Hamilton / Niagara", hours:"Office hours", languages:"English", description:"Family Court Support Worker serving Brantford, Simcoe, and Cayuga courthouses, provided by Haldimand & Norfolk Women's Services.", verified:"" },
  { id:"fc06", name:"FCSW — Victim Services of Leeds & Grenville (Brockville)", categories:["legal-advocate"], region:"Kingston / Southeastern", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Brockville courthouse via Victim Services of Leeds & Grenville. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc07", name:"FCSW — Chatham Kent Women's Centre (Chatham)", categories:["legal-advocate"], region:"London / Southwestern", hours:"Office hours", languages:"English, French (FLS)", description:"Free Family Court Support Worker at Chatham courthouse via Chatham Kent Women's Centre. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc08", name:"FCSW — Cornerstone Family Violence Prevention Centre (Cobourg)", categories:["legal-advocate"], region:"Kingston / Southeastern", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Cobourg courthouse via Cornerstone Family Violence Prevention Centre. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc09", name:"FCSW — Timmins & Area Women in Crisis (Cochrane / Timmins)", categories:["legal-advocate"], region:"Sudbury / Northeastern", hours:"Office hours", languages:"English, French (FLS)", description:"Family Court Support Worker serving Cochrane and Timmins courthouses, provided by Timmins & Area Women in Crisis.", verified:"" },
  { id:"fc10", name:"FCSW — Victim Services of SD&G and Akwesasne (Cornwall / L'Orignal)", categories:["legal-advocate"], region:"Ottawa / Eastern", hours:"Office hours", languages:"English, French (FLS)", description:"Family Court Support Worker serving Cornwall and L'Orignal courthouses, provided by Victim Services of Stormont, Dundas, Glengarry and Akwesasne.", highlights:["francophone"], verified:"" },
  { id:"fc11", name:"FCSW — Hoshizaki House (Fort Frances / Dryden / Kenora)", categories:["legal-advocate"], region:"Thunder Bay / Northwestern", hours:"Office hours", languages:"English, French (FLS)", description:"Family Court Support Worker serving Fort Frances, Dryden, and Kenora courthouses, provided by Hoshizaki House.", verified:"" },
  { id:"fc12", name:"FCSW — Women's Shelter Huron (Goderich)", categories:["legal-advocate"], region:"London / Southwestern", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Goderich courthouse via Women's Shelter, Second Stage Housing and Counselling Services Huron. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc13", name:"FCSW — Guelph Wellington Women in Crisis (Guelph)", categories:["legal-advocate"], region:"Kitchener-Waterloo", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Guelph courthouse via Guelph Wellington Women in Crisis. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc14", name:"FCSW — Good Shepherd Centres (Hamilton)", categories:["legal-advocate"], region:"Hamilton / Niagara", hours:"Office hours", languages:"English, French (FLS)", description:"Free Family Court Support Worker at Hamilton courthouse via Good Shepherd Centres Hamilton. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc15", name:"FCSW — Resolve Counselling Services (Kingston / Napanee)", categories:["legal-advocate"], region:"Kingston / Southeastern", hours:"Office hours", languages:"English, French (FLS)", description:"Family Court Support Worker serving Kingston and Napanee courthouses, provided by Resolve Counselling Services Canada.", verified:"" },
  { id:"fc16", name:"FCSW — SASC Waterloo Region (Kitchener / Cambridge)", categories:["legal-advocate"], region:"Kitchener-Waterloo", phone:"519-571-0121", website:"https://www.sascwr.org/family-court-support-program.html", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Kitchener and Cambridge courthouse via the Sexual Assault Support Centre of Waterloo Region. Helps DV survivors navigate family court, safety planning, court accompaniment.", whatToExpect:"A trained support worker helps you understand the family court process, prepare for court, and plan for safety. They don't give legal advice but can accompany you to court and connect you with lawyers and other services.", verified:"" },
  { id:"fc17", name:"FCSW — Women's Resources of Kawartha Lakes (Lindsay)", categories:["legal-advocate"], region:"Kingston / Southeastern", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Lindsay courthouse via Women's Resources of Kawartha Lakes. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc18", name:"FCSW — Anova (London)", categories:["legal-advocate"], region:"London / Southwestern", phone:"519-642-3003 ext 2288", website:"https://www.anovafuture.org/support/family-court-support/", hours:"Office hours", languages:"English, French (FLS)", description:"Free Family Court Support Worker at London courthouse via Anova: A Future Without Violence. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc19", name:"FCSW — Halton Women's Place (Milton)", categories:["legal-advocate"], region:"Toronto / GTA", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Milton courthouse via Halton Women's Place. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc20", name:"FCSW — Yellow Brick House (Newmarket)", categories:["legal-advocate"], region:"Durham / York / Peel", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Newmarket courthouse via Yellow Brick House (Project Hostel). Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc21", name:"FCSW — Nipissing Transition House (North Bay)", categories:["legal-advocate"], region:"Northern Ontario", hours:"Office hours", languages:"English, French (FLS)", description:"Free Family Court Support Worker at North Bay courthouse via Nipissing Transition House. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc22", name:"FCSW — Family Transition Place (Orangeville)", categories:["legal-advocate"], region:"Durham / York / Peel", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Orangeville courthouse via Family Transition Place. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc23", name:"FCSW — Luke's Place (Oshawa)", categories:["legal-advocate"], region:"Durham / York / Peel", website:"https://lukesplace.ca", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Oshawa courthouse via Luke's Place Support and Resource Centre for Women and Children. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc24", name:"FCSW — Eastern Ottawa Resource Centre (Ottawa)", categories:["legal-advocate"], region:"Ottawa / Eastern", phone:"613-741-6025 ext 119", hours:"Office hours", languages:"English, French (FLS)", description:"Free Family Court Support Worker at Ottawa courthouse via Eastern Ottawa Resource Centre. Helps DV survivors navigate family court, safety planning, court accompaniment.", highlights:["francophone"], verified:"" },
  { id:"fc25", name:"FCSW — The Women's Centre Grey & Bruce (Owen Sound / Walkerton)", categories:["legal-advocate"], region:"London / Southwestern", hours:"Office hours", languages:"English", description:"Family Court Support Worker serving Owen Sound and Walkerton courthouses, provided by The Women's Centre (Grey and Bruce).", verified:"" },
  { id:"fc26", name:"FCSW — Victim Crisis Assistance Parry Sound", categories:["legal-advocate"], region:"Northern Ontario", hours:"Office hours", languages:"English, French (FLS)", description:"Free Family Court Support Worker at Parry Sound courthouse via District of Parry Sound Victim Crisis Assistance and Referral Service. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc27", name:"FCSW — Bernadette McCann House (Pembroke / Renfrew)", categories:["legal-advocate"], region:"Ottawa / Eastern", hours:"Office hours", languages:"English, French (FLS)", description:"Family Court Support Worker serving Pembroke and Renfrew courthouses, provided by Bernadette McCann House for Women Inc.", verified:"" },
  { id:"fc28", name:"FCSW — Lanark County Interval House (Perth)", categories:["legal-advocate"], region:"Ottawa / Eastern", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Perth courthouse via Lanark County Interval House. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc29", name:"FCSW — YWCA Peterborough Haliburton (Peterborough)", categories:["legal-advocate"], region:"Kingston / Southeastern", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Peterborough courthouse via YWCA of Peterborough Haliburton. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc30", name:"FCSW — Social Services Bureau Sarnia-Lambton (Sarnia)", categories:["legal-advocate"], region:"London / Southwestern", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Sarnia courthouse via Social Services Bureau of Sarnia Lambton. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc31", name:"FCSW — Women in Crisis Algoma (Sault Ste. Marie)", categories:["legal-advocate"], region:"Sudbury / Northeastern", hours:"Office hours", languages:"English, French (FLS)", description:"Family Court Support Worker at Sault Ste. Marie courthouse, provided by Women in Crisis Algoma Inc.", verified:"" },
  { id:"fc32", name:"FCSW — Gillian's Place (St. Catharines)", categories:["legal-advocate"], region:"Hamilton / Niagara", hours:"Office hours", languages:"English", description:"Family Court Support Worker at St. Catharines courthouse, provided by Woman's Place (Gillian's Place).", verified:"" },
  { id:"fc33", name:"FCSW — Violence Against Women Services Elgin County (St. Thomas)", categories:["legal-advocate"], region:"London / Southwestern", hours:"Office hours", languages:"English", description:"Family Court Support Worker at St. Thomas courthouse, provided by Violence Against Women Services Elgin County.", verified:"" },
  { id:"fc34", name:"FCSW — Optimism Place (Stratford)", categories:["legal-advocate"], region:"London / Southwestern", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Stratford courthouse via Perth County Transition Home for Women (Optimism Place). Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc35", name:"FCSW — Sudbury YWCA (Sudbury)", categories:["legal-advocate"], region:"Sudbury / Northeastern", hours:"Office hours", languages:"English, French (FLS)", description:"Free Family Court Support Worker at Sudbury courthouse via Sudbury YWCA. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc36", name:"FCSW — Faye Peterson Transition House (Thunder Bay)", categories:["legal-advocate"], region:"Thunder Bay / Northwestern", hours:"Office hours", languages:"English, French (FLS)", description:"Free Family Court Support Worker at Thunder Bay courthouse via Crisis Homes Inc. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc37", name:"FCSW — Barbra Schlifer Clinic (Toronto)", categories:["legal-advocate"], region:"Toronto / GTA", phone:"416-323-9149", website:"https://www.schliferclinic.com", hours:"Office hours", languages:"Multilingual, French (FLS)", description:"Free Family Court Support Worker at Toronto courthouse via Barbra Schlifer Commemorative Clinic. Helps DV survivors navigate family court, safety planning, court accompaniment.", highlights:["multilingual","newcomer-friendly","francophone"], verified:"" },
  { id:"fc38", name:"FCSW — Oasis Centre des Femmes (Toronto)", categories:["legal-advocate"], region:"Toronto / GTA", phone:"416-591-6565", hours:"Office hours", languages:"French", description:"Free Family Court Support Worker at Toronto courthouse via Oasis Centre des Femmes. Helps DV survivors navigate family court, safety planning, court accompaniment.", highlights:["francophone"], verified:"" },
  { id:"fc39", name:"FCSW — SASC Waterloo Region (Waterloo)", categories:["legal-advocate"], region:"Kitchener-Waterloo", phone:"519-571-0121", website:"https://www.sascwr.org/family-court-support-program.html", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Waterloo courthouse via the Sexual Assault Support Centre of Waterloo Region. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc40", name:"FCSW — Women's Place of South Niagara (Welland)", categories:["legal-advocate"], region:"Hamilton / Niagara", hours:"Office hours", languages:"English, French (FLS)", description:"Free Family Court Support Worker at Welland courthouse via Women's Place of South Niagara Inc. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  { id:"fc41", name:"FCSW — Hiatus House (Windsor / Leamington)", categories:["legal-advocate"], region:"Windsor / Essex", hours:"Office hours", languages:"English, French (FLS)", description:"Family Court Support Workers serving Windsor and Leamington courthouses, provided by Hiatus House.", verified:"" },
  { id:"fc42", name:"FCSW — CAS Oxford (Woodstock)", categories:["legal-advocate"], region:"London / Southwestern", hours:"Office hours", languages:"English", description:"Free Family Court Support Worker at Woodstock courthouse via CAS Oxford. Helps DV survivors navigate family court, safety planning, court accompaniment.", verified:"" },
  // ── Children's Aid Societies (regional) ──
  { id:"cas01", name:"Children's Aid Society of Toronto (CAST)", categories:["reporting","children"], region:"Toronto / GTA", phone:"416-924-4646", website:"https://www.torontocas.ca", hours:"24/7", languages:"Various", description:"Report concerns about a child's safety in Toronto. Available 24/7 by phone. You do not need proof — reasonable suspicion is enough. Reports can be made anonymously.", whatToExpect:"When you call, a screener will answer and ask about your concerns. You don't need to give your name. They'll ask what you've seen or heard, and whether the child is in immediate danger. They'll decide next steps — which may include an investigation, a referral for family support, or no further action. You won't necessarily know the outcome, but your call matters.", verified:"" },
  { id:"cas02", name:"Catholic Children's Aid Society of Toronto", categories:["reporting","children"], region:"Toronto / GTA", phone:"416-395-1500", hours:"24/7", languages:"English, French", description:"Report concerns about a child's safety to the Catholic CAS of Toronto. Available 24/7.", verified:"" },
  { id:"cas03", name:"Native Child & Family Services of Toronto", categories:["reporting","children"], region:"Toronto / GTA", phone:"416-969-8510", hours:"24/7", languages:"English, Indigenous languages", description:"Indigenous-led child and family services in Toronto. Report concerns or access culturally grounded family support.", highlights:["indigenous-led"], verified:"" },
  { id:"cas04", name:"Hamilton Child & Family Supports (CAS Hamilton)", categories:["reporting","children"], region:"Hamilton / Niagara", phone:"905-522-1121", website:"https://www.hamiltoncas.com", hours:"24/7", languages:"Various", description:"Report child safety concerns in Hamilton. 24/7. No proof needed — reasonable suspicion is enough.", verified:"" },
  { id:"cas05", name:"Catholic Children's Aid Society of Hamilton", categories:["reporting","children"], region:"Hamilton / Niagara", phone:"905-525-2012", hours:"24/7", languages:"English, French", description:"Report child safety concerns to Catholic CAS of Hamilton.", verified:"" },
  { id:"cas06", name:"Family & Children's Services Niagara", categories:["reporting","children"], region:"Hamilton / Niagara", phone:"888-937-7731", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in the Niagara region (St. Catharines, Niagara Falls, Welland area).", verified:"" },
  { id:"cas07", name:"CAS of Brant", categories:["reporting","children"], region:"Hamilton / Niagara", phone:"519-753-8681", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Brantford and Brant County.", verified:"" },
  { id:"cas08", name:"Children's Aid Society of Ottawa", categories:["reporting","children"], region:"Ottawa / Eastern", phone:"613-747-7800", website:"https://casott.on.ca", hours:"24/7", languages:"English, French", description:"Report child safety concerns in Ottawa. 24/7.", highlights:["francophone"], verified:"" },
  { id:"cas09", name:"CAS of Stormont, Dundas & Glengarry", categories:["reporting","children"], region:"Ottawa / Eastern", phone:"613-933-2292", hours:"24/7", languages:"English, French", description:"Report concerns about a child's safety in Cornwall, SD&G area.", highlights:["francophone"], verified:"" },
  { id:"cas10", name:"Family & Children's Services Renfrew County", categories:["reporting","children"], region:"Ottawa / Eastern", phone:"613-735-6866", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Pembroke and Renfrew County.", verified:"" },
  { id:"cas11", name:"CAS of London & Middlesex", categories:["reporting","children"], region:"London / Southwestern", phone:"519-455-9000", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in London and Middlesex County. Toll-free: 1-888-661-6167.", verified:"" },
  { id:"cas12", name:"Chatham-Kent Children's Services", categories:["reporting","children"], region:"London / Southwestern", phone:"519-352-0440", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Chatham-Kent.", verified:"" },
  { id:"cas13", name:"Windsor-Essex CAS", categories:["reporting","children"], region:"Windsor / Essex", phone:"519-252-1171", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Windsor and Essex County. Toll-free: 1-800-265-4844.", verified:"" },
  { id:"cas14", name:"Family & Children's Services Waterloo Region", categories:["reporting","children"], region:"Kitchener-Waterloo", phone:"519-576-0540", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Kitchener, Cambridge, and Waterloo Region.", verified:"" },
  { id:"cas15", name:"Family & Children's Services Guelph-Wellington", categories:["reporting","children"], region:"Kitchener-Waterloo", phone:"519-824-2410", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Guelph and Wellington County. Toll-free: 1-800-265-8300.", verified:"" },
  { id:"cas16", name:"Peel CAS", categories:["reporting","children"], region:"Durham / York / Peel", phone:"905-363-6131", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Mississauga, Brampton, and Peel Region. Toll-free: 1-888-700-0996.", verified:"" },
  { id:"cas17", name:"Durham CAS", categories:["reporting","children"], region:"Durham / York / Peel", phone:"905-433-1551", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Oshawa, Whitby, Ajax, and Durham Region.", verified:"" },
  { id:"cas18", name:"York Region CAS", categories:["reporting","children"], region:"Durham / York / Peel", phone:"905-895-2318", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Newmarket, Markham, Vaughan, and York Region. Toll-free: 1-800-718-3850.", verified:"" },
  { id:"cas19", name:"Halton CAS", categories:["reporting","children"], region:"Toronto / GTA", phone:"905-333-4441", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Burlington, Oakville, Milton, and Halton Region. Toll-free: 1-866-607-KIDS.", verified:"" },
  { id:"cas20", name:"CAS of Kingston & Frontenac", categories:["reporting","children"], region:"Kingston / Southeastern", phone:"613-542-7351", hours:"24/7", languages:"English, French", description:"Report concerns about a child's safety in Kingston and Frontenac County.", verified:"" },
  { id:"cas21", name:"Hastings CAS (Belleville)", categories:["reporting","children"], region:"Kingston / Southeastern", phone:"613-962-9291", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Belleville and Hastings County. Toll-free: 1-800-267-0570.", verified:"" },
  { id:"cas22", name:"CAS of Sudbury & Manitoulin", categories:["reporting","children"], region:"Sudbury / Northeastern", phone:"705-566-3113", website:"https://www.casdsm.on.ca", hours:"24/7", languages:"English, French", description:"Report concerns about a child's safety in Sudbury and Manitoulin. Toll-free: 1-877-272-4334.", verified:"" },
  { id:"cas23", name:"CAS of Thunder Bay", categories:["reporting","children"], region:"Thunder Bay / Northwestern", phone:"807-343-6100", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Thunder Bay and district.", verified:"" },
  { id:"cas24", name:"CAS of Nipissing & Parry Sound (North Bay)", categories:["reporting","children"], region:"Northern Ontario", phone:"705-472-0910", hours:"24/7", languages:"English, French", description:"Report concerns about a child's safety in North Bay, Nipissing, and Parry Sound.", verified:"" },
  { id:"cas25", name:"CAS of Simcoe County (Barrie)", categories:["reporting","children"], region:"Northern Ontario", phone:"705-726-6587", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Barrie and Simcoe County. Toll-free: 1-800-461-4236.", verified:"" },
  { id:"cas26", name:"CAS of Oxford County (Woodstock)", categories:["reporting","children"], region:"London / Southwestern", phone:"519-539-6176", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Woodstock and Oxford County. Toll-free: 1-800-250-7010.", verified:"" },
  { id:"cas27", name:"CAS of Bruce County (Walkerton)", categories:["reporting","children"], region:"London / Southwestern", phone:"519-881-1822", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Bruce County. Toll-free: 1-800-461-1993.", verified:"" },
  { id:"cas28", name:"CAS of Owen Sound & Grey County", categories:["reporting","children"], region:"London / Southwestern", phone:"519-376-7893", hours:"24/7", languages:"English", description:"Report concerns about a child's safety in Owen Sound and Grey County. Toll-free: 1-800-263-0806.", verified:"" },
];

const STORAGE_KEY = "safepath-resources-v13";

/* ════════════ helpers ════════════ */
function generateId() { return "r" + Date.now() + Math.random().toString(36).slice(2, 6); }
function daysSince(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Math.floor((Date.now() - d.getTime()) / 86400000);
}

/* ════════════ main app ════════════ */
export default function SafePathOntario() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("home"); // home | journey | directory | admin | admin-login
  const [journeyStep, setJourneyStep] = useState(0); // 0=situation, 1=need, 2=approach, 3=region, 4=results
  const [situation, setSituation] = useState(null);
  const [need, setNeed] = useState(null);
  const [approach, setApproach] = useState(null);
  const [resultFilters, setResultFilters] = useState([]); // optional highlight filters on results page
  const [region, setRegion] = useState("All Ontario");
  const [dirFilter, setDirFilter] = useState("all");
  const [dirRegion, setDirRegion] = useState("All Ontario");
  const [dirSearch, setDirSearch] = useState("");
  const [adminAuth, setAdminAuth] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const contentRef = useRef(null);

  /* load resources */
  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(STORAGE_KEY);
        if (result && result.value) {
          const parsed = JSON.parse(result.value);
          if (Array.isArray(parsed) && parsed.length > 0) { setResources(parsed); setLoading(false); return; }
        }
      } catch (e) { /* key doesn't exist yet */ }
      // seed
      await window.storage.set(STORAGE_KEY, JSON.stringify(SEED));
      setResources(SEED);
      setLoading(false);
    })();
  }, []);

  /* save resources */
  const saveResources = useCallback(async (data) => {
    setResources(data);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(data)); } catch (e) { console.error(e); }
  }, []);

  /* page transitions */
  const goTo = useCallback((p) => {
    setFadeIn(false);
    setTimeout(() => { setPage(p); setFadeIn(true); }, 200);
  }, []);

  /* quick exit */
  const quickExit = () => { window.open("https://www.google.ca", "_self"); };

  /* filter logic for journey results */
  const getJourneyResults = () => {
    const needObj = NEEDS.find(n => n.id === need) || CHILD_NEEDS.find(n => n.id === need);
    const needCats = needObj?.categories || [];
    const needHighlights = needObj?.highlights || [];

    // Build the STRICT set of categories this person is looking for
    let requiredCats = [...needCats];

    // "child" situation: also include "children" category resources
    if (situation === "child") requiredCats.push("children");

    // "leaving" situation: if they didn't specifically pick shelter, still include it
    if (situation === "leaving" && !requiredCats.includes("shelter")) requiredCats.push("shelter");

    return resources.filter(r => {
      // ── Category OR Highlight match ──
      // If need uses categories: resource must match one of those categories
      // If need uses highlights: resource must have one of those highlights
      // If need has neither (shouldn't happen): show all
      if (requiredCats.length > 0) {
        const matchesCat = r.categories.some(c => requiredCats.includes(c));
        if (!matchesCat) return false;
      }
      if (needHighlights.length > 0) {
        const matchesHighlight = r.highlights && needHighlights.some(h => r.highlights.includes(h));
        if (!matchesHighlight) return false;
      }

      // ── Approach filter ──
      if (approach === "community") {
        const hasNonLegal = r.categories.some(c => c !== "legal");
        if (!hasNonLegal) return false;
      }

      // ── Region match ──
      const matchesRegion = region === "All Ontario" || r.region === "All Ontario" || r.region === region;
      if (!matchesRegion) return false;

      // ── Optional highlight filters (applied on results page) ──
      if (resultFilters.length > 0) {
        const hasMatchingHighlight = r.highlights && resultFilters.some(f => r.highlights.includes(f));
        if (!hasMatchingHighlight) return false;
      }

      return true;
    }).sort((a, b) => {
      // Local resources before province-wide
      const aLocal = a.region !== "All Ontario" ? 1 : 0;
      const bLocal = b.region !== "All Ontario" ? 1 : 0;
      if (bLocal !== aLocal) return bLocal - aLocal;
      return a.name.localeCompare(b.name);
    });
  };

  /* filter for directory */
  const getDirResults = () => {
    return resources.filter(r => {
      const matchesCat = dirFilter === "all" || r.categories.includes(dirFilter);
      const matchesRegion = dirRegion === "All Ontario" || r.region === "All Ontario" || r.region === dirRegion;
      const matchesSearch = !dirSearch || r.name.toLowerCase().includes(dirSearch.toLowerCase()) || r.description.toLowerCase().includes(dirSearch.toLowerCase());
      return matchesCat && matchesRegion && matchesSearch;
    });
  };

  if (loading) return (
    <div style={S.loadWrap}>
      <div style={S.loadDot} />
      <p style={{ fontFamily: FONTS.body, color: C.textLight, marginTop: 16 }}>Loading resources...</p>
    </div>
  );

  return (
    <div style={S.root}>
      <style>{globalCSS}</style>

      {/* Quick Exit */}
      <button onClick={quickExit} style={S.quickExit} title="Leave this site immediately">
        ✕ Quick Exit
      </button>

      {/* Safety banner */}
      <div style={S.safetyBanner}>
        Your safety matters. Use a device others don't monitor. You can press "Quick Exit" at any time to leave instantly.
      </div>

      {/* Navigation */}
      <nav style={S.nav}>
        <div style={S.navInner}>
          <button onClick={() => goTo("home")} style={S.logo}>
            <span style={S.logoIcon}>🌿</span>
            <span style={S.logoText}>Safe Path Ontario</span>
          </button>
          <div style={S.navLinks}>
            <button onClick={() => goTo("home")} style={{...S.navLink, ...(page === "home" ? S.navLinkActive : {})}}>Home</button>
            <button onClick={() => { goTo("journey"); setJourneyStep(0); setSituation(null); setNeed(null); setApproach(null); setResultFilters([]); setRegion("All Ontario"); }} style={{...S.navLink, ...(page === "journey" ? S.navLinkActive : {})}}>Find Support</button>
            <button onClick={() => goTo("directory")} style={{...S.navLink, ...(page === "directory" ? S.navLinkActive : {})}}>Directory</button>
            <button onClick={() => goTo(adminAuth ? "admin" : "admin-login")} style={{...S.navLink, opacity: 0.5, fontSize: 12}}>Admin</button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div ref={contentRef} style={{...S.content, opacity: fadeIn ? 1 : 0, transition: "opacity 0.2s ease"}}>

        {/* ═══ HOME ═══ */}
        {page === "home" && (
          <div>
            <div style={S.hero}>
              <div style={S.heroBg} />
              <div style={S.heroContent}>
                <p style={S.heroBadge}>Ontario, Canada</p>
                <h1 style={S.heroTitle}>You're not alone.<br/>And you don't have to figure this out by yourself.</h1>
                <p style={S.heroSub}>
                  Safe Path Ontario gently walks you through the support available to you —
                  whether you're in crisis right now, healing from the past, or helping someone you care about.
                  Every resource here has been personally verified.
                </p>
                <div style={S.heroActions}>
                  <button onClick={() => { goTo("journey"); setJourneyStep(0); setSituation(null); setNeed(null); setApproach(null); setResultFilters([]); setRegion("All Ontario"); }} style={S.primaryBtn}>
                    Find support for my situation →
                  </button>
                  <button onClick={() => goTo("directory")} style={S.secondaryBtn}>
                    Browse all resources
                  </button>
                </div>
              </div>
            </div>

            {/* Emergency strip */}
            <div style={S.emergencyStrip}>
              <div style={S.emergencyInner}>
                <div style={S.emergencyDot} />
                <span style={S.emergencyLabel}>If you are in immediate danger</span>
                <a href="tel:911" style={S.emergencyPhone}>Call 911</a>
              </div>
            </div>

            {/* What this site does */}
            <div style={S.infoSection}>
              <div style={S.infoGrid}>
                {[
                  { icon: "🧭", title: "Guided, not overwhelming", desc: "Answer a few simple questions and we show you only the resources that match your situation. No walls of text." },
                  { icon: "📞", title: "Verified by a real person", desc: "Every listing here is personally verified by calling organizations directly. If something's wrong, we fix it." },
                  { icon: "🌱", title: "Every stage of healing", desc: "Whether it just happened, it was years ago, you're a child or a senior — there is support designed for you." },
                  { icon: "🔒", title: "Your safety is built in", desc: "Quick exit button, no tracking, no data collected. We also remind you to browse safely." },
                ].map((item, i) => (
                  <div key={i} style={S.infoCard}>
                    <span style={S.infoIcon}>{item.icon}</span>
                    <h3 style={S.infoTitle}>{item.title}</h3>
                    <p style={S.infoDesc}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ GUIDED JOURNEY ═══ */}
        {page === "journey" && (
          <div style={S.journeyWrap}>
            {/* Progress */}
            <div style={S.progressBar}>
              {["Situation", "What you need", "Your approach", "Location", "Resources"].map((label, i) => (
                <div key={i} style={S.progressStep}>
                  <div style={{...S.progressDot, background: i <= journeyStep ? C.sage : C.sandWarm}} />
                  <span style={{...S.progressLabel, color: i <= journeyStep ? C.deep : C.textLight}}>{label}</span>
                  {i < 4 && <div style={{...S.progressLine, background: i < journeyStep ? C.sage : C.sandWarm}} />}
                </div>
              ))}
            </div>

            {/* Step 0: Situation */}
            {journeyStep === 0 && (
              <div style={S.stepWrap}>
                <h2 style={S.stepTitle}>What brings you here?</h2>
                <p style={S.stepSub}>Take your time. There's no wrong answer, and you can go back at any point.</p>
                <div style={S.choicesGrid}>
                  {SITUATIONS.map(s => (
                    <button key={s.id} onClick={() => { setSituation(s.id); setTimeout(() => setJourneyStep(1), 300); }}
                      style={{...S.choiceCard, ...(situation === s.id ? S.choiceActive : {})}}>
                      <span style={S.choiceIcon}>{s.icon}</span>
                      <span style={S.choiceLabel}>{s.label}</span>
                      <span style={S.choiceSub}>{s.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: What kind of help */}
            {journeyStep === 1 && (
              <div style={S.stepWrap}>
                <h2 style={S.stepTitle}>What kind of support are you looking for?</h2>
                <p style={S.stepSub}>
                  {situation === "recent" && "After a recent experience, there are many kinds of support available. You don't have to do everything at once."}
                  {situation === "ongoing" && "When you're still in a situation, it helps to know all the options. Pick what feels most urgent to you right now."}
                  {situation === "past" && "Healing doesn't have a timeline. These supports are available to you whether it happened last year or decades ago."}
                  {situation === "someone" && "It can be hard to know how to help. These resources can guide you and the person you're supporting."}
                  {situation === "child" && "There are different kinds of help depending on what the child or young person needs right now."}
                  {situation === "leaving" && "Leaving takes planning and support. You don't have to do it alone, and you don't have to do it today."}
                </p>
                <div style={S.choicesGrid}>
                  {(situation === "child" ? CHILD_NEEDS : NEEDS).map(n => (
                    <button key={n.id} onClick={() => { setNeed(n.id); setTimeout(() => setJourneyStep(2), 300); }}
                      style={{...S.choiceCard, ...(need === n.id ? S.choiceActive : {})}}>
                      <span style={S.choiceIcon}>{n.icon}</span>
                      <span style={S.choiceLabel}>{n.label}</span>
                      <span style={S.choiceSub}>{n.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Approach */}
            {journeyStep === 2 && (
              <div style={S.stepWrap}>
                <h2 style={S.stepTitle}>How would you like to access support?</h2>
                <p style={S.stepSub}>
                  There's no pressure to involve police or the legal system. Many people find healing entirely through
                  community-based support like crisis lines, counselling, and peer groups. Others want to explore legal
                  options too. Both paths are valid — this is completely your choice.
                </p>
                <div style={S.choicesGrid}>
                  {APPROACHES.map(a => (
                    <button key={a.id} onClick={() => { setApproach(a.id); setTimeout(() => setJourneyStep(3), 300); }}
                      style={{...S.choiceCard, ...(approach === a.id ? S.choiceActive : {})}}>
                      <span style={S.choiceIcon}>{a.icon}</span>
                      <span style={S.choiceLabel}>{a.label}</span>
                      <span style={S.choiceSub}>{a.sub}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Region */}
            {journeyStep === 3 && (
              <div style={S.stepWrap}>
                <h2 style={S.stepTitle}>Where in Ontario are you?</h2>
                <p style={S.stepSub}>We'll show services near you first, plus province-wide resources you can access from anywhere.</p>
                <div style={S.choicesGrid}>
                  {REGIONS.map(r => (
                    <button key={r} onClick={() => { setRegion(r); setTimeout(() => setJourneyStep(4), 300); }}
                      style={{...S.choiceCardSmall, ...(region === r ? S.choiceActive : {})}}>
                      <span style={S.choiceLabel}>{r}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Results */}
            {journeyStep === 4 && (
              <div style={S.stepWrap}>
                <div style={S.resultsHeader}>
                  <h2 style={S.stepTitle}>Here's what's available to you</h2>
                  <p style={S.stepSub}>
                    {approach === "community" && "These are community-based resources — no police or court involvement required. You're in control of your own journey."}
                    {approach === "system" && "These include options for engaging with the legal system, along with community support to help you through the process."}
                    {approach === "both" && "Here's everything available to you. Community-based support and legal options are both included — you decide what's right for you."}
                    {!approach && "Based on what you've shared, here are the resources we'd recommend."}
                  </p>
                  <div style={{display:"flex", gap: 10, flexWrap:"wrap", marginTop: 8}}>
                    <button onClick={() => { setJourneyStep(0); setSituation(null); setNeed(null); setApproach(null); setResultFilters([]); setRegion("All Ontario"); }} style={S.skipBtn}>← Start over</button>
                    <button onClick={() => setJourneyStep(1)} style={S.skipBtn}>← Change what I need</button>
                  </div>
                </div>

                {/* Optional highlight filters */}
                {(() => {
                  const needObj = NEEDS.find(n => n.id === need) || CHILD_NEEDS.find(n => n.id === need);
                  const needCats = needObj?.categories || [];
                  const needHighlights = needObj?.highlights || [];
                  const allHighlightsPresent = new Set();
                  resources.filter(r => {
                    let reqCats = [...needCats];
                    if (situation === "child") reqCats.push("children");
                    if (situation === "leaving" && !reqCats.includes("shelter")) reqCats.push("shelter");
                    const matchesCat = reqCats.length === 0 || r.categories.some(c => reqCats.includes(c));
                    const matchesHL = needHighlights.length === 0 || (r.highlights && needHighlights.some(h => r.highlights.includes(h)));
                    const matchesRegion = region === "All Ontario" || r.region === "All Ontario" || r.region === region;
                    const matchesApproach = approach !== "community" || r.categories.some(c => c !== "legal");
                    return matchesCat && matchesHL && matchesRegion && matchesApproach;
                  }).forEach(r => {
                    if (r.highlights) r.highlights.forEach(h => allHighlightsPresent.add(h));
                  });
                  const availableFilters = HIGHLIGHTS.filter(h => allHighlightsPresent.has(h.id));
                  if (availableFilters.length === 0) return null;
                  return (
                    <div style={{marginBottom: 20}}>
                      <p style={{fontSize: 12, color: C.textLight, marginBottom: 8}}>Looking for something specific? Filter by:</p>
                      <div style={{display: "flex", flexWrap: "wrap", gap: 6}}>
                        {availableFilters.map(h => {
                          const active = resultFilters.includes(h.id);
                          return (
                            <button key={h.id}
                              onClick={(e) => { e.stopPropagation(); setResultFilters(prev => active ? prev.filter(f => f !== h.id) : [...prev, h.id]); }}
                              style={{
                                padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                                border: `1.5px solid ${active ? h.color : C.sandWarm}`,
                                background: active ? h.color : "white",
                                color: active ? "white" : C.text,
                                cursor: "pointer", fontFamily: FONTS.body, transition: "all 0.2s"
                              }}>
                              {h.label}
                            </button>
                          );
                        })}
                        {resultFilters.length > 0 && (
                          <button onClick={() => setResultFilters([])} style={{...S.skipBtn, fontSize: 11, margin: 0, padding: "4px 8px"}}>Clear filters</button>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {situation === "recent" && need === "medical" && (
                  <div style={S.contextBox}>
                    <p style={S.contextText}>
                      <strong>If the assault was within the last 12 days,</strong> you can go directly to any hospital emergency department and ask for the Sexual Assault/Domestic Violence Treatment Centre team.
                      You do not need a police report. You do not need to decide about reporting right away. Evidence can be collected and stored while you take time to decide.
                      Call the Ontario SA/DV Treatment Centre Navigation Line at <a href="tel:18556287238" style={{color: C.sage, fontWeight: 600}}>1-855-628-7238</a> for help finding the nearest centre.
                    </p>
                  </div>
                )}

                {need === "legal-info" && (
                  <div style={S.contextBox}>
                    <p style={S.contextText}>
                      <strong>You have options, and you don't have to figure them out alone.</strong> In Ontario, survivors of violence can access free legal information and in some cases free legal advice. You don't need to have reported to police to get legal help. Here's what's available:
                    </p>
                    <p style={{...S.contextText, marginTop: 6}}><strong>Free legal advice:</strong> Legal Aid Ontario can provide a lawyer for family law matters related to domestic violence. Sexual assault survivors can get up to 4 hours of free legal advice through the Independent Legal Advice program — no police report required.</p>
                    <p style={{...S.contextText, marginTop: 6}}><strong>Self-help tools:</strong> Sites like Steps to Justice and the Ontario Women's Justice Network offer plain-language guides on family law, protection orders, custody, and your rights.</p>
                  </div>
                )}

                {need === "legal-advocate" && (
                  <div style={S.contextBox}>
                    <p style={S.contextText}>
                      <strong>Family Court Support Workers</strong> are available free of charge in every court district in Ontario. They are trained professionals — usually based at local women's organizations or sexual assault centres — who help survivors of domestic violence navigate the family court system. They can:
                    </p>
                    <p style={{...S.contextText, marginTop: 6}}>Help you understand the family court process, prepare for court, create a safety plan for court attendance, accompany you to proceedings, and connect you with lawyers and community services. They do not give legal advice, but they make the process much less overwhelming.</p>
                    <p style={{...S.contextText, marginTop: 6}}>You do not need to provide proof of abuse. Services are confidential and free. Ask for the Family Court Support Worker at any of the organizations below.</p>
                  </div>
                )}

                {need === "child-report" && (
                  <div style={S.contextBox}>
                    <p style={S.contextText}>
                      <strong>In Ontario, everyone has a legal duty to report</strong> if they suspect a child under 16 is being abused or neglected, or is at risk of being harmed. You do not need proof — reasonable suspicion is enough. Reports can be made anonymously.
                    </p>
                    <p style={{...S.contextText, marginTop: 6}}>Contact your <strong>local Children's Aid Society (CAS)</strong> directly. If a child is in immediate danger, call 911. The CAS will investigate and determine what support the child and family need. Reporting is not about getting someone in trouble — it's about making sure a child is safe.</p>
                  </div>
                )}

                

                {situation === "child" && (
                  <div style={S.contextBox}>
                    <p style={S.contextText}>
                      <strong>If a child is in immediate danger,</strong> call 911. If you need to report suspected child abuse or neglect, contact your local Children's Aid Society.
                      Kids Help Phone (<a href="tel:18006686868" style={{color: C.sage, fontWeight: 600}}>1-800-668-6868</a>) is available 24/7 for young people to talk, text, or chat confidentially.
                    </p>
                  </div>
                )}

                {situation === "leaving" && (
                  <div style={S.contextBox}>
                    <p style={S.contextText}>
                      <strong>Safety planning is important.</strong> Before leaving, consider calling a crisis line to help you plan.
                      The Assaulted Women's Helpline (<a href="tel:18668630511" style={{color: C.sage, fontWeight: 600}}>1-866-863-0511</a>) can help with safety planning
                      even if you're not ready to leave yet. Shelters can also be reached by phone for advice without needing to move in.
                    </p>
                  </div>
                )}

                {(need === "indigenous" || need === "lgbtq" || need === "male-survivor" || need === "francophone" || need === "newcomer" || need === "seniors-need") && (
                  <div style={S.contextBox}>
                    <p style={S.contextText}>
                      {need === "indigenous" && <><strong>These are Indigenous-led organizations</strong> — services grounded in Indigenous culture, wisdom, and tradition. You can always also access any of the general services listed on this site. Every crisis line and counselling centre in Ontario will support you regardless of background.</>}
                      {need === "lgbtq" && <><strong>These services have been identified as 2SLGBTQ+ affirming</strong> — with knowledgeable, inclusive staff. You can always also access any of the general services on this site. If a service isn't listed here, it doesn't necessarily mean it isn't affirming — we just haven't confirmed it yet.</>}
                      {need === "male-survivor" && <><strong>These services are specifically designed for male survivors.</strong> You can always also access general crisis lines and counselling centres — they support people of all genders.</>}
                      {need === "francophone" && <><strong>Ces services sont disponibles en français.</strong> You can also access any general service and request a French interpreter — the Assaulted Women's Helpline (1-866-863-0511) has interpreters in 200+ languages including French.</>}
                      {need === "newcomer" && <><strong>These services have experience supporting newcomers to Canada</strong> — with multilingual staff, cultural sensitivity, and awareness of immigration-related concerns. General services are also available to you regardless of immigration status.</>}
                      {need === "seniors-need" && <><strong>These services are designed for older adults.</strong> You can always also access any general crisis line or counselling service — they support people of all ages.</>}
                    </p>
                    <p style={{...S.contextText, marginTop: 8}}>
                      <button onClick={() => { setNeed("notsure"); }} style={{...S.skipBtn, display:"inline", padding: 0, fontSize: 13}}>Show me all available services instead →</button>
                    </p>
                  </div>
                )}

                <div style={S.resultsGrid}>
                  {getJourneyResults().length === 0 ? (
                    <div style={S.emptyState}>
                      <p style={{fontSize: 16, color: C.textLight}}>
                        {resultFilters.length > 0
                          ? <>No resources match these filters. <button onClick={() => setResultFilters([])} style={{...S.skipBtn, display:"inline", padding: 0}}>Clear filters</button> to see all results.</>
                          : <>No resources match this exact combination yet. Try calling <strong style={{color: C.deep}}>211</strong> — real people answer 24/7 in 150+ languages and can connect you with the right service.
                            You can also <button onClick={() => setJourneyStep(1)} style={{...S.skipBtn, display:"inline", padding: 0}}>go back and adjust your selections</button>.</>
                        }
                      </p>
                    </div>
                  ) : getJourneyResults().map(r => <ResourceCard key={r.id} r={r} />)}
                </div>
              </div>
            )}

            {/* Back nav */}
            {journeyStep > 0 && journeyStep < 4 && (
              <button onClick={() => setJourneyStep(journeyStep - 1)} style={S.backBtn}>← Back</button>
            )}
          </div>
        )}

        {/* ═══ DIRECTORY ═══ */}
        {page === "directory" && (
          <div style={S.dirWrap}>
            <h2 style={{...S.stepTitle, marginBottom: 4}}>Full Resource Directory</h2>
            <p style={{...S.stepSub, marginBottom: 24}}>Browse all verified organizations. Use filters to narrow down.</p>

            <div style={S.dirFilters}>
              <input value={dirSearch} onChange={e => setDirSearch(e.target.value)} placeholder="Search by name or keyword..." style={S.searchInput} />
              <select value={dirFilter} onChange={e => setDirFilter(e.target.value)} style={S.selectInput}>
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
              <select value={dirRegion} onChange={e => setDirRegion(e.target.value)} style={S.selectInput}>
                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <p style={{fontSize: 13, color: C.textLight, marginBottom: 20}}>{getDirResults().length} resource{getDirResults().length !== 1 ? "s" : ""} found</p>

            <div style={S.resultsGrid}>
              {getDirResults().map(r => <ResourceCard key={r.id} r={r} />)}
            </div>
          </div>
        )}

        {/* ═══ ADMIN LOGIN ═══ */}
        {page === "admin-login" && (
          <div style={S.adminLoginWrap}>
            <h2 style={S.stepTitle}>Admin Access</h2>
            <p style={{...S.stepSub, marginBottom: 20}}>Enter the admin PIN to manage listings.</p>
            <div style={{display:"flex", gap: 10, alignItems:"center", flexWrap:"wrap"}}>
              <input type="password" value={pinInput} onChange={e => { setPinInput(e.target.value); setPinError(false); }}
                placeholder="Enter PIN" style={{...S.searchInput, maxWidth: 200}}
                onKeyDown={e => { if (e.key === "Enter") { if (pinInput === ADMIN_PIN) { setAdminAuth(true); goTo("admin"); } else { setPinError(true); } }}} />
              <button onClick={() => { if (pinInput === ADMIN_PIN) { setAdminAuth(true); goTo("admin"); } else { setPinError(true); } }} style={S.primaryBtn}>Enter</button>
            </div>
            {pinError && <p style={{color: C.emergency, fontSize: 13, marginTop: 8}}>Incorrect PIN. Try again.</p>}
          </div>
        )}

        {/* ═══ ADMIN PANEL ═══ */}
        {page === "admin" && adminAuth && (
          <div style={S.dirWrap}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap: 12, marginBottom: 24}}>
              <div>
                <h2 style={{...S.stepTitle, marginBottom: 4}}>Admin Panel</h2>
                <p style={{fontSize: 13, color: C.textLight}}>{resources.length} resources · <span style={{color: C.emergency, fontWeight: 600}}>{resources.filter(r => !r.verified).length} need verification</span></p>
              </div>
              <button onClick={() => { setEditingResource(null); setShowForm(true); }} style={S.primaryBtn}>+ Add Resource</button>
            </div>

            {showForm && (
              <AdminForm resource={editingResource} categories={CATEGORIES} regions={REGIONS}
                onSave={(data) => {
                  if (editingResource) {
                    saveResources(resources.map(r => r.id === editingResource.id ? {...data, id: editingResource.id} : r));
                  } else {
                    saveResources([...resources, {...data, id: generateId()}]);
                  }
                  setShowForm(false); setEditingResource(null);
                }}
                onCancel={() => { setShowForm(false); setEditingResource(null); }}
              />
            )}

            <div style={{display:"flex", flexDirection:"column", gap: 8}}>
              {[...resources].sort((a, b) => {
                if (!a.verified && b.verified) return -1;
                if (a.verified && !b.verified) return 1;
                return a.name.localeCompare(b.name);
              }).map(r => (
                <div key={r.id} style={{...S.adminRow, borderLeft: r.verified ? `3px solid ${C.sage}` : `3px solid ${C.emergency}`}}>
                  <div style={{flex: 1, minWidth: 0}}>
                    <p style={{fontWeight: 600, fontSize: 14, color: C.deep, marginBottom: 2}}>
                      {!r.verified && <span style={{color: C.emergency, marginRight: 6}}>⚠</span>}
                      {r.name}
                    </p>
                    <p style={{fontSize: 12, color: C.textLight}}>
                      {r.categories.map(c => CATEGORIES.find(cc => cc.id === c)?.label).join(", ")} · {r.region}
                      {r.verified ? <span style={{color: C.sage}}> · ✓ Verified {r.verified}</span> : <span style={{color: C.emergency}}> · Needs verification</span>}
                    </p>
                  </div>
                  <div style={{display:"flex", gap: 6, flexWrap:"wrap"}}>
                    <button onClick={() => { setEditingResource(r); setShowForm(true); }} style={S.adminBtn}>Edit</button>
                    <button onClick={() => {
                      if (confirm(`Remove "${r.name}"?`)) saveResources(resources.filter(x => x.id !== r.id));
                    }} style={{...S.adminBtn, color: C.emergency, borderColor: "#C4453C33"}}>Remove</button>
                    <button onClick={() => {
                      saveResources(resources.map(x => x.id === r.id ? {...x, verified: new Date().toISOString().split("T")[0]} : x));
                    }} style={{...S.adminBtn, color: "white", background: C.sage, borderColor: C.sage}}>✓ Mark Verified</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer style={S.footer}>
        <p style={{fontFamily: FONTS.serif, fontSize: 18, color: C.deep, marginBottom: 8}}>You deserve support. You deserve safety.</p>
        <p style={{fontSize: 13, color: C.textLight, maxWidth: 500, margin: "0 auto", lineHeight: 1.7}}>
          Safe Path Ontario is independently maintained and verified. If you notice outdated information, please reach out so we can update it.
        </p>
        <p style={{fontSize: 11, color: C.textLight, marginTop: 16, opacity: 0.6}}>This site does not collect any personal data.</p>
      </footer>
    </div>
  );
}

/* ═══ Resource Card Component ═══ */
function ResourceCard({ r }) {
  const [expanded, setExpanded] = useState(false);
  const hasExperience = r.whatToExpect || r.servicesOffered || r.intakeProcess || r.accessibility || r.goodToKnow;

  return (
    <div style={{...S.resCard, ...(expanded ? {borderColor: C.sage + "44"} : {})}} onClick={() => setExpanded(!expanded)}>
      <div style={S.resCardTop}>
        <div style={{flex: 1}}>
          <h3 style={S.resName}>{r.name}</h3>
          <div style={S.resTags}>
            {r.categories.map(c => {
              const cat = CATEGORIES.find(cc => cc.id === c);
              return cat ? <span key={c} style={S.resTag}>{cat.icon} {cat.label}</span> : null;
            })}
            {r.highlights && r.highlights.map(h => {
              const hl = HIGHLIGHTS.find(hh => hh.id === h);
              return hl ? <span key={h} style={{...S.resHighlight, borderColor: hl.color + "44", color: hl.color}}>{hl.label}</span> : null;
            })}
          </div>
        </div>
        {r.phone && (
          <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} style={S.resPhoneBtn} onClick={e => e.stopPropagation()}>
            📞 {r.phone}
          </a>
        )}
      </div>
      <p style={S.resDesc}>{r.description}</p>

      {expanded && (
        <div style={S.resDetails}>
          {/* Basic info */}
          {r.hours && <div style={S.resDetail}><span style={S.resDetailLabel}>Hours</span> {r.hours}</div>}
          {r.languages && <div style={S.resDetail}><span style={S.resDetailLabel}>Languages</span> {r.languages}</div>}
          {r.tty && <div style={S.resDetail}><span style={S.resDetailLabel}>TTY</span> {r.tty}</div>}
          {r.text && <div style={S.resDetail}><span style={S.resDetailLabel}>Text</span> {r.text}</div>}
          {r.website && <div style={S.resDetail}><span style={S.resDetailLabel}>Website</span> <a href={r.website.startsWith("http") ? r.website : "https://"+r.website} target="_blank" rel="noopener noreferrer" style={{color: C.sage, wordBreak:"break-all"}} onClick={e => e.stopPropagation()}>{r.website.replace(/^https?:\/\//, "")}</a></div>}
          {r.region && <div style={S.resDetail}><span style={S.resDetailLabel}>Region</span> {r.region}</div>}

          {/* ── What to Expect section ── */}
          {hasExperience && (
            <div style={S.expectWrap}>
              <h4 style={S.expectTitle}>💡 What to expect when you reach out</h4>

              {r.whatToExpect && (
                <p style={S.expectText}>{r.whatToExpect}</p>
              )}

              {r.servicesOffered && (
                <div style={S.expectBlock}>
                  <span style={S.expectLabel}>What they offer</span>
                  <p style={S.expectText}>{r.servicesOffered}</p>
                </div>
              )}

              {r.intakeProcess && (
                <div style={S.expectBlock}>
                  <span style={S.expectLabel}>What the first contact is like</span>
                  <p style={S.expectText}>{r.intakeProcess}</p>
                </div>
              )}

              {r.accessibility && (
                <div style={S.expectBlock}>
                  <span style={S.expectLabel}>Accessibility & accommodations</span>
                  <p style={S.expectText}>{r.accessibility}</p>
                </div>
              )}

              {r.goodToKnow && (
                <div style={S.expectBlock}>
                  <span style={S.expectLabel}>Good to know</span>
                  <p style={S.expectText}>{r.goodToKnow}</p>
                </div>
              )}
            </div>
          )}

          {!hasExperience && (
            <div style={S.expectPending}>
              <span style={{fontSize: 13}}>📋</span>
              <p style={{fontSize: 12, color: C.textLight, margin: 0}}>
                Detailed information about what to expect when contacting this organization is coming soon.
                In the meantime, don't hesitate to call — they're there to help, and you can ask any questions before committing to anything.
              </p>
            </div>
          )}

          {r.verified ? (
            <div style={{...S.resDetail, fontSize: 11, marginTop: 8, color: daysSince(r.verified) > 90 ? "#C4756E" : C.sage}}>✓ Verified {daysSince(r.verified) === 0 ? "today" : daysSince(r.verified) + " days ago"}</div>
          ) : (
            <div style={{...S.resDetail, fontSize: 11, marginTop: 8, color: "#C4756E"}}>⚠ Not yet verified — info may need updating</div>
          )}
        </div>
      )}
      <p style={{fontSize: 11, color: C.textLight, marginTop: 8, display: "flex", alignItems: "center", gap: 4}}>
        {expanded ? "▲ Tap to collapse" : (hasExperience ? "▼ Tap to learn what to expect" : "▼ Tap for details")}
      </p>
    </div>
  );
}

/* ═══ Admin Form Component ═══ */
function AdminForm({ resource, categories, regions, onSave, onCancel }) {
  const [form, setForm] = useState(resource || {
    name: "", description: "", categories: [], region: "All Ontario",
    phone: "", tty: "", text: "", website: "", hours: "", languages: "",
    forIdentities: ["any"], verified: new Date().toISOString().split("T")[0],
    whatToExpect: "", servicesOffered: "", intakeProcess: "", accessibility: "", goodToKnow: ""
  });
  const update = (k, v) => setForm(prev => ({...prev, [k]: v}));
  const toggleCat = (id) => {
    const cats = form.categories.includes(id) ? form.categories.filter(c => c !== id) : [...form.categories, id];
    update("categories", cats);
  };

  return (
    <div style={S.formWrap}>
      <h3 style={{fontFamily: FONTS.serif, fontSize: 20, color: C.deep, marginBottom: 16}}>{resource ? "Edit" : "Add"} Resource</h3>
      <div style={S.formGrid}>
        <div style={S.formGroup}>
          <label style={S.formLabel}>Organization Name *</label>
          <input value={form.name} onChange={e => update("name", e.target.value)} style={S.formInput} />
        </div>
        <div style={S.formGroup}>
          <label style={S.formLabel}>Region</label>
          <select value={form.region} onChange={e => update("region", e.target.value)} style={S.formInput}>
            {regions.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div style={{...S.formGroup, gridColumn: "1 / -1"}}>
          <label style={S.formLabel}>Description *</label>
          <textarea value={form.description} onChange={e => update("description", e.target.value)} rows={3} style={{...S.formInput, resize: "vertical"}} />
        </div>
        <div style={S.formGroup}>
          <label style={S.formLabel}>Phone</label>
          <input value={form.phone} onChange={e => update("phone", e.target.value)} style={S.formInput} />
        </div>
        <div style={S.formGroup}>
          <label style={S.formLabel}>TTY</label>
          <input value={form.tty} onChange={e => update("tty", e.target.value)} style={S.formInput} />
        </div>
        <div style={S.formGroup}>
          <label style={S.formLabel}>Text Line</label>
          <input value={form.text} onChange={e => update("text", e.target.value)} style={S.formInput} />
        </div>
        <div style={S.formGroup}>
          <label style={S.formLabel}>Website</label>
          <input value={form.website} onChange={e => update("website", e.target.value)} style={S.formInput} />
        </div>
        <div style={S.formGroup}>
          <label style={S.formLabel}>Hours</label>
          <input value={form.hours} onChange={e => update("hours", e.target.value)} style={S.formInput} placeholder="e.g. 24/7 or Mon-Fri 9-5" />
        </div>
        <div style={S.formGroup}>
          <label style={S.formLabel}>Languages</label>
          <input value={form.languages} onChange={e => update("languages", e.target.value)} style={S.formInput} />
        </div>
        <div style={{...S.formGroup, gridColumn: "1 / -1"}}>
          <label style={S.formLabel}>Categories *</label>
          <div style={{display:"flex", flexWrap:"wrap", gap: 6}}>
            {categories.map(c => (
              <button key={c.id} onClick={() => toggleCat(c.id)}
                style={{...S.resTag, background: form.categories.includes(c.id) ? C.sage : "#f5f0eb", color: form.categories.includes(c.id) ? "white" : C.text, cursor:"pointer", border:"none", padding:"6px 12px"}}>
                {c.icon} {c.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{...S.formGroup, gridColumn: "1 / -1"}}>
          <label style={S.formLabel}>Highlights / Identity Tags</label>
          <p style={{fontSize: 11, color: C.textLight, marginBottom: 6}}>These show as badges on the card so people can see at a glance if a service is relevant to them.</p>
          <div style={{display:"flex", flexWrap:"wrap", gap: 6}}>
            {HIGHLIGHTS.map(h => (
              <button key={h.id} onClick={() => {
                const cur = form.highlights || [];
                update("highlights", cur.includes(h.id) ? cur.filter(x => x !== h.id) : [...cur, h.id]);
              }}
                style={{
                  padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600,
                  border: `1.5px solid ${(form.highlights || []).includes(h.id) ? h.color : C.sandWarm}`,
                  background: (form.highlights || []).includes(h.id) ? h.color : "white",
                  color: (form.highlights || []).includes(h.id) ? "white" : C.text,
                  cursor: "pointer", fontFamily: FONTS.body
                }}>
                {h.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── What to Expect fields ── */}
        <div style={{...S.formGroup, gridColumn: "1 / -1", marginTop: 12}}>
          <div style={S.formSectionHeader}>
            <span style={{fontSize: 15}}>💡</span>
            <div>
              <label style={{...S.formLabel, fontSize: 14, marginBottom: 2}}>What to Expect (filled in after calling the org)</label>
              <p style={{fontSize: 11, color: C.textLight, lineHeight: 1.5, margin: 0}}>
                This is what makes Safe Path different — real info about what it's actually like to reach out. Fill these in as you call around.
              </p>
            </div>
          </div>
        </div>

        <div style={{...S.formGroup, gridColumn: "1 / -1"}}>
          <label style={S.formLabel}>Overview — What's it like to reach out?</label>
          <textarea value={form.whatToExpect || ""} onChange={e => update("whatToExpect", e.target.value)} rows={3} style={{...S.formInput, resize: "vertical"}}
            placeholder="e.g. When you call, a trained counsellor will answer. You don't have to give your name. They'll listen to whatever you want to share and help you figure out next steps. There's no pressure to make any decisions on the call." />
        </div>

        <div style={{...S.formGroup, gridColumn: "1 / -1"}}>
          <label style={S.formLabel}>Services offered</label>
          <textarea value={form.servicesOffered || ""} onChange={e => update("servicesOffered", e.target.value)} rows={3} style={{...S.formInput, resize: "vertical"}}
            placeholder="Ask: What specific services do you provide? e.g. crisis counselling, safety planning, court accompaniment, support groups, help finding housing, referrals to other services, accompaniment to hospital" />
        </div>

        <div style={{...S.formGroup, gridColumn: "1 / -1"}}>
          <label style={S.formLabel}>What the first contact / intake is like</label>
          <textarea value={form.intakeProcess || ""} onChange={e => update("intakeProcess", e.target.value)} rows={3} style={{...S.formInput, resize: "vertical"}}
            placeholder="Ask: What happens when someone calls or walks in for the first time? Do they need to tell the whole story? Is there a waitlist? Do they need ID or a police report? Is it anonymous? What questions will they be asked?" />
        </div>

        <div style={{...S.formGroup, gridColumn: "1 / -1"}}>
          <label style={S.formLabel}>Accessibility & accommodations</label>
          <textarea value={form.accessibility || ""} onChange={e => update("accessibility", e.target.value)} rows={2} style={{...S.formInput, resize: "vertical"}}
            placeholder="Ask: Is the space wheelchair accessible? Are there accommodations for Deaf/hard of hearing, visual impairments? Can services be provided remotely (phone/video)? Are there childcare options during appointments?" />
        </div>

        <div style={{...S.formGroup, gridColumn: "1 / -1"}}>
          <label style={S.formLabel}>Good to know</label>
          <textarea value={form.goodToKnow || ""} onChange={e => update("goodToKnow", e.target.value)} rows={2} style={{...S.formInput, resize: "vertical"}}
            placeholder="Anything else helpful — e.g. They welcome walk-ins. They can help with transit costs. No police report needed. They serve all genders. Pets are welcome in the shelter. They have a waitlist of ~2 weeks for counselling." />
        </div>
      </div>
      <div style={{display:"flex", gap: 10, marginTop: 16}}>
        <button onClick={() => { if (form.name && form.description && form.categories.length) onSave(form); }} style={S.primaryBtn}>Save Resource</button>
        <button onClick={onCancel} style={S.secondaryBtn}>Cancel</button>
      </div>
    </div>
  );
}

