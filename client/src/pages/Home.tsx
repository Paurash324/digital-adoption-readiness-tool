import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronLeft,
  CircleHelp,
  ClipboardList,
  ExternalLink,
  IndianRupee,
  LaptopMinimal,
  MapPin,
  Megaphone,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  WalletCards,
} from "lucide-react";

type AnswerKey = "always" | "sometimes" | "rarely" | "never";
type Category = "payments" | "presence" | "records" | "marketing";
type Language = "en" | "hi" | "pa";

type Question = {
  id: string;
  category: Category;
  eyebrow: string;
  title: string;
  helper: string;
  icon: typeof WalletCards;
  options: { value: AnswerKey; label: string; detail: string; points: number }[];
};

type Recommendation = {
  name: string;
  category: Category;
  tag: string;
  why: string;
  action: string;
  icon: typeof WalletCards;
  color: string;
  url: string;
};

type QuestionTranslation = {
  eyebrow: string;
  title: string;
  helper: string;
  options: Record<AnswerKey, { label: string; detail: string }>;
};

const languageOptions: { value: Language; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "pa", label: "ਪੰਜਾਬੀ" },
];

const uiCopy = {
  en: {
    languageLabel: "Choose language",
    businessTop: "Built for small businesses · ₹0 to start",
    checkinKicker: "DIGITAL ADOPTION CHECK-IN",
    introTitle: "Make your next digital move",
    introTitleEm: "the right one.",
    introLead: "A simple 3-minute check-in for local businesses. Find your biggest opportunity, then get a practical roadmap of free tools to try first.",
    start: "Start the check-in",
    noSignup: "No sign-up. No jargon. No sales pitch.",
    questions: "plain-language\nquestions",
    areas: "business areas\nchecked",
    tools: "free tools\nin your roadmap",
    artLabel: "YOUR BUSINESS, MOVING FORWARD",
    discoverable: "more discoverable",
    nextWin: "next easy win",
    introFooter: "Designed around the real day-to-day of local shops, services, and home businesses.",
    back: "Back",
    question: "Question",
    of: "of",
    complete: "complete",
    honest: "ONE HONEST ANSWER IS ALL WE NEED",
    privacy: "Your answers stay in this browser.",
    nextQuestion: "Next question",
    roadmapButton: "See my roadmap",
    resultsKicker: "YOUR READINESS SNAPSHOT",
    resultsTitle: "You have a clear place to start.",
    resultsLead: "Here is what your answers tell us — and the small moves most likely to create momentum first.",
    retake: "Retake check-in",
    startingPoint: "YOUR DIGITAL STARTING POINT",
    scoreEarly: "Early steps, real upside.",
    scoreMid: "Good foundations to build on.",
    scoreHigh: "You are ready to go further.",
    scoreDesc: "Readiness is not a grade. It is simply a map of what to do next.",
    fourAreas: "THE FOUR AREAS",
    whereStands: "Where your business stands",
    stronger: "stronger",
    opportunity: "opportunity",
    biggest: "Your biggest opportunity",
    partial: "Partly in place",
    strong: "Strong foundation",
    roadmapKicker: "YOUR ZERO-COST ROADMAP",
    roadmapTitle: "Do these next, in this order.",
    roadmapLead: "Each recommendation responds to a gap in your answers. Start with step one — not all five at once.",
    practicalTools: "practical tools",
    freeToStart: "FREE TO START",
    nextStepTitle: "Start small. Make it stick.",
    nextStepLead: "Pick the first recommendation and spend 20 minutes on it today. Progress compounds when the next step is obvious.",
    takeStep: "Take step one",
    footerLine: "ready.local · Digital adoption, without the overwhelm.",
    footerNote: "Built with free tools for the businesses that keep communities moving.",
  },
  hi: {
    languageLabel: "भाषा चुनें",
    businessTop: "छोटे व्यवसायों के लिए · शुरुआत ₹0 से",
    checkinKicker: "डिजिटल अपनाने की जाँच",
    introTitle: "अपने व्यवसाय का अगला डिजिटल कदम",
    introTitleEm: "सही चुनें।",
    introLead: "स्थानीय व्यवसायों के लिए 3 मिनट की आसान जाँच। अपना सबसे बड़ा अवसर पहचानें और पहले आज़माने के लिए मुफ़्त टूल्स की व्यावहारिक योजना पाएँ।",
    start: "जाँच शुरू करें",
    noSignup: "साइन-अप नहीं। कठिन शब्द नहीं। कोई बिक्री संदेश नहीं।",
    questions: "सरल भाषा में\nसवाल",
    areas: "व्यवसाय के क्षेत्र\nजाँचे गए",
    tools: "मुफ़्त टूल्स\nआपकी योजना में",
    artLabel: "आपका व्यवसाय, आगे बढ़ता हुआ",
    discoverable: "ज़्यादा आसानी से मिलें",
    nextWin: "अगला आसान कदम",
    introFooter: "स्थानीय दुकानों, सेवाओं और घर से चलने वाले व्यवसायों की रोज़मर्रा की ज़रूरतों को ध्यान में रखकर बनाया गया।",
    back: "वापस",
    question: "सवाल",
    of: "में से",
    complete: "पूरा",
    honest: "हमें बस एक ईमानदार जवाब चाहिए",
    privacy: "आपके जवाब इसी ब्राउज़र में रहते हैं।",
    nextQuestion: "अगला सवाल",
    roadmapButton: "मेरी योजना देखें",
    resultsKicker: "आपकी डिजिटल तैयारी",
    resultsTitle: "अब आपको पता है कि शुरुआत कहाँ से करनी है।",
    resultsLead: "आपके जवाबों से यह समझ आता है कि पहले कौन-से छोटे कदम सबसे ज़्यादा गति ला सकते हैं।",
    retake: "जाँच फिर से करें",
    startingPoint: "आपकी डिजिटल शुरुआत",
    scoreEarly: "शुरुआत बाकी है, अवसर बड़ा है।",
    scoreMid: "अच्छी नींव है, अब इसे आगे बढ़ाएँ।",
    scoreHigh: "आप आगे बढ़ने के लिए तैयार हैं।",
    scoreDesc: "तैयारी कोई अंक नहीं है। यह केवल अगले कदम का नक्शा है।",
    fourAreas: "चार मुख्य क्षेत्र",
    whereStands: "आपका व्यवसाय कहाँ खड़ा है",
    stronger: "मज़बूत",
    opportunity: "अवसर",
    biggest: "आपका सबसे बड़ा अवसर",
    partial: "कुछ हद तक तैयार",
    strong: "मज़बूत आधार",
    roadmapKicker: "आपकी मुफ़्त डिजिटल योजना",
    roadmapTitle: "इन कदमों को इसी क्रम में करें।",
    roadmapLead: "हर सुझाव आपके जवाबों में दिखे एक अंतर से जुड़ा है। पहले कदम से शुरू करें — पाँचों एक साथ नहीं।",
    practicalTools: "काम के टूल्स",
    freeToStart: "शुरुआत मुफ़्त",
    nextStepTitle: "छोटा शुरू करें। लगातार करते रहें।",
    nextStepLead: "पहला सुझाव चुनें और आज उस पर 20 मिनट लगाएँ। जब अगला कदम साफ़ हो, तो प्रगति अपने-आप जुड़ती जाती है।",
    takeStep: "पहला कदम लें",
    footerLine: "ready.local · बिना उलझन के डिजिटल अपनाना।",
    footerNote: "उन व्यवसायों के लिए मुफ़्त टूल्स से बनाया गया जो हमारी स्थानीय ज़िंदगी को चलाते हैं।",
  },
  pa: {
    languageLabel: "ਭਾਸ਼ਾ ਚੁਣੋ",
    businessTop: "ਛੋਟੇ ਕਾਰੋਬਾਰਾਂ ਲਈ · ਸ਼ੁਰੂਆਤ ₹0 ਤੋਂ",
    checkinKicker: "ਡਿਜ਼ਿਟਲ ਅਪਣਾਉਣ ਦੀ ਜਾਂਚ",
    introTitle: "ਆਪਣੇ ਕਾਰੋਬਾਰ ਦਾ ਅਗਲਾ ਡਿਜ਼ਿਟਲ ਕਦਮ",
    introTitleEm: "ਸਹੀ ਚੁਣੋ।",
    introLead: "ਸਥਾਨਕ ਕਾਰੋਬਾਰਾਂ ਲਈ 3 ਮਿੰਟ ਦੀ ਸੌਖੀ ਜਾਂਚ। ਆਪਣਾ ਸਭ ਤੋਂ ਵੱਡਾ ਮੌਕਾ ਲੱਭੋ ਅਤੇ ਪਹਿਲਾਂ ਅਜ਼ਮਾਉਣ ਲਈ ਮੁਫ਼ਤ ਟੂਲਾਂ ਦੀ ਸੌਖੀ ਯੋਜਨਾ ਪਾਓ।",
    start: "ਜਾਂਚ ਸ਼ੁਰੂ ਕਰੋ",
    noSignup: "ਸਾਈਨ-ਅਪ ਨਹੀਂ। ਔਖੇ ਸ਼ਬਦ ਨਹੀਂ। ਕੋਈ ਵਿਕਰੀ ਸੁਨੇਹਾ ਨਹੀਂ।",
    questions: "ਸੌਖੀ ਭਾਸ਼ਾ ਵਿੱਚ\nਸਵਾਲ",
    areas: "ਕਾਰੋਬਾਰ ਦੇ ਖੇਤਰ\nਜਾਂਚੇ",
    tools: "ਮੁਫ਼ਤ ਟੂਲ\nਤੁਹਾਡੀ ਯੋਜਨਾ ਵਿੱਚ",
    artLabel: "ਤੁਹਾਡਾ ਕਾਰੋਬਾਰ, ਅੱਗੇ ਵਧਦਾ ਹੋਇਆ",
    discoverable: "ਹੋਰ ਆਸਾਨੀ ਨਾਲ ਲੱਭੋ",
    nextWin: "ਅਗਲਾ ਸੌਖਾ ਕਦਮ",
    introFooter: "ਸਥਾਨਕ ਦੁਕਾਨਾਂ, ਸੇਵਾਵਾਂ ਅਤੇ ਘਰੋਂ ਚੱਲਣ ਵਾਲੇ ਕਾਰੋਬਾਰਾਂ ਦੀ ਰੋਜ਼ਾਨਾ ਲੋੜ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖ ਕੇ ਬਣਾਇਆ ਗਿਆ।",
    back: "ਪਿੱਛੇ",
    question: "ਸਵਾਲ",
    of: "ਵਿੱਚੋਂ",
    complete: "ਪੂਰਾ",
    honest: "ਸਾਨੂੰ ਸਿਰਫ਼ ਇੱਕ ਸੱਚਾ ਜਵਾਬ ਚਾਹੀਦਾ ਹੈ",
    privacy: "ਤੁਹਾਡੇ ਜਵਾਬ ਇਸੇ ਬ੍ਰਾਊਜ਼ਰ ਵਿੱਚ ਰਹਿੰਦੇ ਹਨ।",
    nextQuestion: "ਅਗਲਾ ਸਵਾਲ",
    roadmapButton: "ਮੇਰੀ ਯੋਜਨਾ ਵੇਖੋ",
    resultsKicker: "ਤੁਹਾਡੀ ਡਿਜ਼ਿਟਲ ਤਿਆਰੀ",
    resultsTitle: "ਹੁਣ ਤੁਹਾਨੂੰ ਪਤਾ ਹੈ ਕਿ ਸ਼ੁਰੂਆਤ ਕਿੱਥੋਂ ਕਰਨੀ ਹੈ।",
    resultsLead: "ਤੁਹਾਡੇ ਜਵਾਬ ਦੱਸਦੇ ਹਨ ਕਿ ਪਹਿਲਾਂ ਕਿਹੜੇ ਛੋਟੇ ਕਦਮ ਸਭ ਤੋਂ ਵੱਧ ਤਰੱਕੀ ਲਿਆ ਸਕਦੇ ਹਨ।",
    retake: "ਜਾਂਚ ਦੁਬਾਰਾ ਕਰੋ",
    startingPoint: "ਤੁਹਾਡੀ ਡਿਜ਼ਿਟਲ ਸ਼ੁਰੂਆਤ",
    scoreEarly: "ਸ਼ੁਰੂਆਤ ਬਾਕੀ ਹੈ, ਮੌਕਾ ਵੱਡਾ ਹੈ।",
    scoreMid: "ਚੰਗੀ ਨੀਂਹ ਹੈ, ਹੁਣ ਇਸਨੂੰ ਅੱਗੇ ਵਧਾਓ।",
    scoreHigh: "ਤੁਸੀਂ ਅੱਗੇ ਵਧਣ ਲਈ ਤਿਆਰ ਹੋ।",
    scoreDesc: "ਤਿਆਰੀ ਕੋਈ ਗ੍ਰੇਡ ਨਹੀਂ। ਇਹ ਸਿਰਫ਼ ਅਗਲੇ ਕਦਮ ਦਾ ਨਕਸ਼ਾ ਹੈ।",
    fourAreas: "ਚਾਰ ਮੁੱਖ ਖੇਤਰ",
    whereStands: "ਤੁਹਾਡਾ ਕਾਰੋਬਾਰ ਕਿੱਥੇ ਖੜ੍ਹਾ ਹੈ",
    stronger: "ਮਜ਼ਬੂਤ",
    opportunity: "ਮੌਕਾ",
    biggest: "ਤੁਹਾਡਾ ਸਭ ਤੋਂ ਵੱਡਾ ਮੌਕਾ",
    partial: "ਕੁਝ ਹੱਦ ਤੱਕ ਤਿਆਰ",
    strong: "ਮਜ਼ਬੂਤ ਬੁਨਿਆਦ",
    roadmapKicker: "ਤੁਹਾਡੀ ਮੁਫ਼ਤ ਡਿਜ਼ਿਟਲ ਯੋਜਨਾ",
    roadmapTitle: "ਇਹ ਕਦਮ ਇਸੇ ਕ੍ਰਮ ਵਿੱਚ ਕਰੋ।",
    roadmapLead: "ਹਰ ਸੁਝਾਅ ਤੁਹਾਡੇ ਜਵਾਬਾਂ ਵਿੱਚ ਦਿਖੇ ਇੱਕ ਖਾਲੀਪਣ ਨਾਲ ਜੁੜਿਆ ਹੈ। ਪਹਿਲੇ ਕਦਮ ਤੋਂ ਸ਼ੁਰੂ ਕਰੋ — ਪੰਜੇ ਇਕੱਠੇ ਨਹੀਂ।",
    practicalTools: "ਕੰਮ ਦੇ ਟੂਲ",
    freeToStart: "ਸ਼ੁਰੂਆਤ ਮੁਫ਼ਤ",
    nextStepTitle: "ਛੋਟਾ ਸ਼ੁਰੂ ਕਰੋ। ਲਗਾਤਾਰ ਕਰਦੇ ਰਹੋ।",
    nextStepLead: "ਪਹਿਲਾ ਸੁਝਾਅ ਚੁਣੋ ਅਤੇ ਅੱਜ ਉਸ ਉੱਤੇ 20 ਮਿੰਟ ਲਗਾਓ। ਜਦੋਂ ਅਗਲਾ ਕਦਮ ਸਾਫ਼ ਹੋਵੇ, ਤਰੱਕੀ ਆਪਣੇ ਆਪ ਜੁੜਦੀ ਜਾਂਦੀ ਹੈ।",
    takeStep: "ਪਹਿਲਾ ਕਦਮ ਲਓ",
    footerLine: "ready.local · ਬਿਨਾਂ ਉਲਝਣ ਦੇ ਡਿਜ਼ਿਟਲ ਅਪਣਾਉਣਾ।",
    footerNote: "ਉਨ੍ਹਾਂ ਕਾਰੋਬਾਰਾਂ ਲਈ ਮੁਫ਼ਤ ਟੂਲਾਂ ਨਾਲ ਬਣਾਇਆ ਗਿਆ ਜੋ ਸਾਡੀਆਂ ਸਥਾਨਕ ਕਮਿਊਨਿਟੀਆਂ ਨੂੰ ਚਲਾਉਂਦੇ ਹਨ।",
  },
} as const;

const questions: Question[] = [
  {
    id: "payments",
    category: "payments",
    eyebrow: "Payments",
    title: "Do customers currently pay you digitally?",
    helper: "Think UPI, cards, QR codes, or a digital wallet.",
    icon: WalletCards,
    options: [
      { value: "always", label: "Yes, always", detail: "Digital payments are part of every day.", points: 3 },
      { value: "sometimes", label: "Sometimes", detail: "Some customers pay digitally, but it is inconsistent.", points: 2 },
      { value: "rarely", label: "Rarely", detail: "It happens only when a customer asks.", points: 1 },
      { value: "never", label: "Never — cash only", detail: "You currently accept cash only.", points: 0 },
    ],
  },
  {
    id: "listing",
    category: "presence",
    eyebrow: "Online presence",
    title: "Can a new customer find your business online?",
    helper: "A Google search, Maps listing, or social profile all count.",
    icon: MapPin,
    options: [
      { value: "always", label: "Yes, easily", detail: "Our details and location are up to date.", points: 3 },
      { value: "sometimes", label: "A little", detail: "We have a profile, but it needs attention.", points: 2 },
      { value: "rarely", label: "Only through word of mouth", detail: "Online information is incomplete.", points: 1 },
      { value: "never", label: "Not at all", detail: "We do not have a business listing yet.", points: 0 },
    ],
  },
  {
    id: "inventory",
    category: "records",
    eyebrow: "Records",
    title: "How do you keep track of sales and stock?",
    helper: "Choose the option closest to your current routine.",
    icon: ClipboardList,
    options: [
      { value: "always", label: "Digitally and regularly", detail: "A spreadsheet or app is updated as we go.", points: 3 },
      { value: "sometimes", label: "A mix of paper and phone", detail: "Some information is digital, some is not.", points: 2 },
      { value: "rarely", label: "Mostly on paper", detail: "Records exist but are hard to search.", points: 1 },
      { value: "never", label: "I keep it in my head", detail: "There is no consistent record yet.", points: 0 },
    ],
  },
  {
    id: "marketing",
    category: "marketing",
    eyebrow: "Marketing",
    title: "How often do you stay in touch with customers?",
    helper: "Consider WhatsApp updates, social posts, or a customer list.",
    icon: Megaphone,
    options: [
      { value: "always", label: "Every week", detail: "We share useful updates consistently.", points: 3 },
      { value: "sometimes", label: "Now and then", detail: "We post or message when there is time.", points: 2 },
      { value: "rarely", label: "Only for a sale", detail: "Communication is occasional.", points: 1 },
      { value: "never", label: "Not yet", detail: "We do not have a repeat-customer habit.", points: 0 },
    ],
  },
  {
    id: "customer-contact",
    category: "marketing",
    eyebrow: "Customer relationships",
    title: "Do you have an easy way to answer customer questions?",
    helper: "A dedicated WhatsApp Business profile or saved replies count.",
    icon: MessageCircle,
    options: [
      { value: "always", label: "Yes, it is organized", detail: "Customers know where to reach us.", points: 3 },
      { value: "sometimes", label: "Mostly", detail: "We reply, but details are scattered.", points: 2 },
      { value: "rarely", label: "It depends", detail: "People usually call whoever is available.", points: 1 },
      { value: "never", label: "No clear channel", detail: "There is no dedicated customer inbox.", points: 0 },
    ],
  },
  {
    id: "cashflow",
    category: "records",
    eyebrow: "Money basics",
    title: "Can you quickly see what came in and went out this month?",
    helper: "This is about visibility, not accounting expertise.",
    icon: BarChart3,
    options: [
      { value: "always", label: "Yes, at a glance", detail: "Income and expenses are easy to review.", points: 3 },
      { value: "sometimes", label: "With some effort", detail: "The information exists in a few places.", points: 2 },
      { value: "rarely", label: "Not reliably", detail: "I estimate from memory or receipts.", points: 1 },
      { value: "never", label: "No", detail: "I cannot confidently say yet.", points: 0 },
    ],
  },
  {
    id: "confidence",
    category: "presence",
    eyebrow: "Confidence",
    title: "How comfortable are you trying a new digital tool?",
    helper: "There are no wrong answers — this simply helps pace your roadmap.",
    icon: LaptopMinimal,
    options: [
      { value: "always", label: "Very comfortable", detail: "I enjoy trying new apps.", points: 3 },
      { value: "sometimes", label: "I can learn with help", detail: "A clear guide is all I need.", points: 2 },
      { value: "rarely", label: "A little nervous", detail: "I prefer one change at a time.", points: 1 },
      { value: "never", label: "Not comfortable yet", detail: "I need a very simple first step.", points: 0 },
    ],
  },
];

const questionCopy: Record<Exclude<Language, "en">, Record<string, QuestionTranslation>> = {
  hi: {
    payments: {
      eyebrow: "भुगतान",
      title: "क्या आपके ग्राहक अभी डिजिटल भुगतान करते हैं?",
      helper: "UPI, कार्ड, QR कोड या डिजिटल वॉलेट के बारे में सोचें।",
      options: {
        always: { label: "हाँ, हमेशा", detail: "डिजिटल भुगतान हर दिन का हिस्सा है।" },
        sometimes: { label: "कभी-कभी", detail: "कुछ ग्राहक डिजिटल भुगतान करते हैं, लेकिन यह नियमित नहीं है।" },
        rarely: { label: "बहुत कम", detail: "सिर्फ़ तब जब कोई ग्राहक कहे।" },
        never: { label: "कभी नहीं — केवल नकद", detail: "अभी आप केवल नकद लेते हैं।" },
      },
    },
    listing: {
      eyebrow: "ऑनलाइन मौजूदगी",
      title: "क्या कोई नया ग्राहक आपका व्यवसाय ऑनलाइन ढूँढ सकता है?",
      helper: "Google सर्च, Maps लिस्टिंग या सोशल प्रोफ़ाइल — इनमें से कोई भी चलेगा।",
      options: {
        always: { label: "हाँ, आसानी से", detail: "हमारी जानकारी और लोकेशन अपडेट रहती है।" },
        sometimes: { label: "थोड़ा-बहुत", detail: "प्रोफ़ाइल है, लेकिन उसमें सुधार की ज़रूरत है।" },
        rarely: { label: "सिर्फ़ पहचान से", detail: "ऑनलाइन जानकारी अधूरी है।" },
        never: { label: "बिल्कुल नहीं", detail: "अभी हमारी बिज़नेस लिस्टिंग नहीं है।" },
      },
    },
    inventory: {
      eyebrow: "रिकॉर्ड",
      title: "आप बिक्री और स्टॉक का हिसाब कैसे रखते हैं?",
      helper: "जो आपकी आज की दिनचर्या के सबसे करीब हो, वह चुनें।",
      options: {
        always: { label: "डिजिटल और नियमित रूप से", detail: "स्प्रेडशीट या ऐप समय-समय पर अपडेट होता है।" },
        sometimes: { label: "कागज़ और फोन दोनों", detail: "कुछ जानकारी डिजिटल है, कुछ नहीं।" },
        rarely: { label: "ज़्यादातर कागज़ पर", detail: "रिकॉर्ड हैं, लेकिन ढूँढना मुश्किल है।" },
        never: { label: "याददाश्त पर", detail: "अभी कोई नियमित रिकॉर्ड नहीं है।" },
      },
    },
    marketing: {
      eyebrow: "मार्केटिंग",
      title: "आप ग्राहकों के संपर्क में कितनी बार रहते हैं?",
      helper: "WhatsApp अपडेट, सोशल पोस्ट या ग्राहक सूची के बारे में सोचें।",
      options: {
        always: { label: "हर हफ़्ते", detail: "हम नियमित रूप से उपयोगी अपडेट साझा करते हैं।" },
        sometimes: { label: "कभी-कभी", detail: "समय मिलने पर पोस्ट या संदेश करते हैं।" },
        rarely: { label: "सिर्फ़ ऑफ़र के समय", detail: "संपर्क कभी-कभार ही होता है।" },
        never: { label: "अभी नहीं", detail: "बार-बार आने वाले ग्राहकों से जुड़ने की आदत नहीं है।" },
      },
    },
    "customer-contact": {
      eyebrow: "ग्राहक संबंध",
      title: "क्या आपके पास ग्राहकों के सवालों का जवाब देने का आसान तरीका है?",
      helper: "WhatsApp Business प्रोफ़ाइल या सेव किए हुए जवाब भी इसमें गिने जाते हैं।",
      options: {
        always: { label: "हाँ, व्यवस्थित है", detail: "ग्राहकों को पता है कि हमसे कहाँ संपर्क करना है।" },
        sometimes: { label: "ज़्यादातर", detail: "हम जवाब देते हैं, लेकिन जानकारी अलग-अलग जगह है।" },
        rarely: { label: "यह स्थिति पर निर्भर है", detail: "लोग आमतौर पर जो उपलब्ध हो उसे कॉल करते हैं।" },
        never: { label: "कोई तय माध्यम नहीं", detail: "ग्राहकों के लिए अलग इनबॉक्स नहीं है।" },
      },
    },
    cashflow: {
      eyebrow: "पैसों की बुनियाद",
      title: "क्या आप जल्दी से देख सकते हैं कि इस महीने कितना पैसा आया और गया?",
      helper: "यह जानकारी साफ़ दिखने के बारे में है, अकाउंटिंग विशेषज्ञता के बारे में नहीं।",
      options: {
        always: { label: "हाँ, एक नज़र में", detail: "आमदनी और खर्च आसानी से देखे जा सकते हैं।" },
        sometimes: { label: "थोड़ी मेहनत से", detail: "जानकारी कुछ अलग-अलग जगहों पर है।" },
        rarely: { label: "विश्वसनीय रूप से नहीं", detail: "मैं याददाश्त या रसीदों से अनुमान लगाता हूँ।" },
        never: { label: "नहीं", detail: "अभी मैं भरोसे से नहीं बता सकता।" },
      },
    },
    confidence: {
      eyebrow: "आत्मविश्वास",
      title: "नया डिजिटल टूल आज़माने में आप कितने सहज हैं?",
      helper: "कोई जवाब गलत नहीं है — इससे आपकी योजना की गति तय करने में मदद मिलेगी।",
      options: {
        always: { label: "बहुत सहज", detail: "मुझे नए ऐप्स आज़माना अच्छा लगता है।" },
        sometimes: { label: "मदद मिले तो सीख सकता हूँ", detail: "एक साफ़ गाइड ही मेरे लिए काफ़ी है।" },
        rarely: { label: "थोड़ा झिझकता हूँ", detail: "मैं एक समय में एक बदलाव पसंद करता हूँ।" },
        never: { label: "अभी सहज नहीं हूँ", detail: "मुझे बहुत आसान पहला कदम चाहिए।" },
      },
    },
  },
  pa: {
    payments: {
      eyebrow: "ਭੁਗਤਾਨ",
      title: "ਕੀ ਤੁਹਾਡੇ ਗਾਹਕ ਹੁਣ ਡਿਜ਼ਿਟਲ ਭੁਗਤਾਨ ਕਰਦੇ ਹਨ?",
      helper: "UPI, ਕਾਰਡ, QR ਕੋਡ ਜਾਂ ਡਿਜ਼ਿਟਲ ਵਾਲਿਟ ਬਾਰੇ ਸੋਚੋ।",
      options: {
        always: { label: "ਹਾਂ, ਹਮੇਸ਼ਾ", detail: "ਡਿਜ਼ਿਟਲ ਭੁਗਤਾਨ ਹਰ ਦਿਨ ਦਾ ਹਿੱਸਾ ਹੈ।" },
        sometimes: { label: "ਕਦੇ-ਕਦੇ", detail: "ਕੁਝ ਗਾਹਕ ਡਿਜ਼ਿਟਲ ਭੁਗਤਾਨ ਕਰਦੇ ਹਨ, ਪਰ ਇਹ ਨਿਯਮਤ ਨਹੀਂ।" },
        rarely: { label: "ਬਹੁਤ ਘੱਟ", detail: "ਸਿਰਫ਼ ਉਦੋਂ ਜਦੋਂ ਕੋਈ ਗਾਹਕ ਕਹੇ।" },
        never: { label: "ਕਦੇ ਨਹੀਂ — ਸਿਰਫ਼ ਨਕਦ", detail: "ਤੁਸੀਂ ਹੁਣ ਸਿਰਫ਼ ਨਕਦ ਲੈਂਦੇ ਹੋ।" },
      },
    },
    listing: {
      eyebrow: "ਆਨਲਾਈਨ ਮੌਜੂਦਗੀ",
      title: "ਕੀ ਕੋਈ ਨਵਾਂ ਗਾਹਕ ਤੁਹਾਡਾ ਕਾਰੋਬਾਰ ਆਨਲਾਈਨ ਲੱਭ ਸਕਦਾ ਹੈ?",
      helper: "Google ਸर्च, Maps ਲਿਸਟਿੰਗ ਜਾਂ ਸੋਸ਼ਲ ਪ੍ਰੋਫ਼ਾਈਲ — ਕੋਈ ਵੀ ਚੱਲੇਗਾ।",
      options: {
        always: { label: "ਹਾਂ, ਆਸਾਨੀ ਨਾਲ", detail: "ਸਾਡੀ ਜਾਣਕਾਰੀ ਅਤੇ ਟਿਕਾਣਾ ਅੱਪਡੇਟ ਰਹਿੰਦੇ ਹਨ।" },
        sometimes: { label: "ਥੋੜ੍ਹਾ-ਬਹੁਤ", detail: "ਪ੍ਰੋਫ਼ਾਈਲ ਹੈ, ਪਰ ਇਸ ਵਿੱਚ ਸੁਧਾਰ ਦੀ ਲੋੜ ਹੈ।" },
        rarely: { label: "ਸਿਰਫ਼ ਜਾਣ-ਪਛਾਣ ਰਾਹੀਂ", detail: "ਆਨਲਾਈਨ ਜਾਣਕਾਰੀ ਅਧੂਰੀ ਹੈ।" },
        never: { label: "ਬਿਲਕੁਲ ਨਹੀਂ", detail: "ਅਜੇ ਸਾਡੀ ਬਿਜ਼ਨਸ ਲਿਸਟਿੰਗ ਨਹੀਂ ਹੈ।" },
      },
    },
    inventory: {
      eyebrow: "ਰਿਕਾਰਡ",
      title: "ਤੁਸੀਂ ਵਿਕਰੀ ਅਤੇ ਸਟਾਕ ਦਾ ਹਿਸਾਬ ਕਿਵੇਂ ਰੱਖਦੇ ਹੋ?",
      helper: "ਜੋ ਤੁਹਾਡੀ ਅੱਜ ਦੀ ਰੁਟੀਨ ਦੇ ਸਭ ਤੋਂ ਨੇੜੇ ਹੈ, ਉਹ ਚੁਣੋ।",
      options: {
        always: { label: "ਡਿਜ਼ਿਟਲ ਅਤੇ ਨਿਯਮਤ", detail: "ਸਪ੍ਰੈਡਸ਼ੀਟ ਜਾਂ ਐਪ ਸਮੇਂ-ਸਮੇਂ ਤੇ ਅੱਪਡੇਟ ਹੁੰਦੀ ਹੈ।" },
        sometimes: { label: "ਕਾਗਜ਼ ਅਤੇ ਫੋਨ ਦੋਵੇਂ", detail: "ਕੁਝ ਜਾਣਕਾਰੀ ਡਿਜ਼ਿਟਲ ਹੈ, ਕੁਝ ਨਹੀਂ।" },
        rarely: { label: "ਜ਼ਿਆਦਾਤਰ ਕਾਗਜ਼ ਉੱਤੇ", detail: "ਰਿਕਾਰਡ ਹਨ, ਪਰ ਲੱਭਣੇ ਔਖੇ ਹਨ।" },
        never: { label: "ਯਾਦਦਾਸ਼ਤ ਉੱਤੇ", detail: "ਅਜੇ ਕੋਈ ਨਿਯਮਤ ਰਿਕਾਰਡ ਨਹੀਂ ਹੈ।" },
      },
    },
    marketing: {
      eyebrow: "ਮਾਰਕੀਟਿੰਗ",
      title: "ਤੁਸੀਂ ਗਾਹਕਾਂ ਨਾਲ ਕਿੰਨੀ ਵਾਰ ਸੰਪਰਕ ਵਿੱਚ ਰਹਿੰਦੇ ਹੋ?",
      helper: "WhatsApp ਅੱਪਡੇਟ, ਸੋਸ਼ਲ ਪੋਸਟ ਜਾਂ ਗਾਹਕਾਂ ਦੀ ਸੂਚੀ ਬਾਰੇ ਸੋਚੋ।",
      options: {
        always: { label: "ਹਰ ਹਫ਼ਤੇ", detail: "ਅਸੀਂ ਨਿਯਮਤ ਤੌਰ ਤੇ ਲਾਭਦਾਇਕ ਅੱਪਡੇਟ ਸਾਂਝੇ ਕਰਦੇ ਹਾਂ।" },
        sometimes: { label: "ਕਦੇ-ਕਦੇ", detail: "ਸਮਾਂ ਮਿਲਣ ਤੇ ਪੋਸਟ ਜਾਂ ਸੁਨੇਹਾ ਕਰਦੇ ਹਾਂ।" },
        rarely: { label: "ਸਿਰਫ਼ ਆਫ਼ਰ ਵੇਲੇ", detail: "ਸੰਪਰਕ ਕਦੇ-ਕਦਾਈਂ ਹੀ ਹੁੰਦਾ ਹੈ।" },
        never: { label: "ਅਜੇ ਨਹੀਂ", detail: "ਵਾਪਸ ਆਉਣ ਵਾਲੇ ਗਾਹਕਾਂ ਨਾਲ ਜੁੜਨ ਦੀ ਆਦਤ ਨਹੀਂ ਹੈ।" },
      },
    },
    "customer-contact": {
      eyebrow: "ਗਾਹਕਾਂ ਨਾਲ ਰਿਸ਼ਤਾ",
      title: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਗਾਹਕਾਂ ਦੇ ਸਵਾਲਾਂ ਦਾ ਜਵਾਬ ਦੇਣ ਦਾ ਸੌਖਾ ਤਰੀਕਾ ਹੈ?",
      helper: "WhatsApp Business ਪ੍ਰੋਫ਼ਾਈਲ ਜਾਂ ਸੇਵ ਕੀਤੇ ਜਵਾਬ ਵੀ ਗਿਣੇ ਜਾਂਦੇ ਹਨ।",
      options: {
        always: { label: "ਹਾਂ, ਢੰਗ ਨਾਲ ਹੈ", detail: "ਗਾਹਕਾਂ ਨੂੰ ਪਤਾ ਹੈ ਕਿ ਸਾਡੇ ਨਾਲ ਕਿੱਥੇ ਸੰਪਰਕ ਕਰਨਾ ਹੈ।" },
        sometimes: { label: "ਜ਼ਿਆਦਾਤਰ", detail: "ਅਸੀਂ ਜਵਾਬ ਦਿੰਦੇ ਹਾਂ, ਪਰ ਜਾਣਕਾਰੀ ਵੱਖ-ਵੱਖ ਥਾਵਾਂ ਤੇ ਹੈ।" },
        rarely: { label: "ਇਹ ਸਥਿਤੀ ਤੇ ਨਿਰਭਰ ਹੈ", detail: "ਲੋਕ ਆਮ ਤੌਰ ਤੇ ਜੋ ਉਪਲਬਧ ਹੋਵੇ ਉਸਨੂੰ ਫੋਨ ਕਰਦੇ ਹਨ।" },
        never: { label: "ਕੋਈ ਪੱਕਾ ਮਾਧਿਅਮ ਨਹੀਂ", detail: "ਗਾਹਕਾਂ ਲਈ ਵੱਖਰਾ ਇਨਬਾਕਸ ਨਹੀਂ ਹੈ।" },
      },
    },
    cashflow: {
      eyebrow: "ਪੈਸਿਆਂ ਦੀ ਬੁਨਿਆਦ",
      title: "ਕੀ ਤੁਸੀਂ ਜਲਦੀ ਦੇਖ ਸਕਦੇ ਹੋ ਕਿ ਇਸ ਮਹੀਨੇ ਕਿੰਨਾ ਪੈਸਾ ਆਇਆ ਅਤੇ ਗਿਆ?",
      helper: "ਇਹ ਜਾਣਕਾਰੀ ਸਾਫ਼ ਦਿਖਣ ਬਾਰੇ ਹੈ, ਅਕਾਊਂਟਿੰਗ ਮਾਹਰਤਾ ਬਾਰੇ ਨਹੀਂ।",
      options: {
        always: { label: "ਹਾਂ, ਇੱਕ ਨਜ਼ਰ ਵਿੱਚ", detail: "ਆਮਦਨ ਅਤੇ ਖਰਚੇ ਆਸਾਨੀ ਨਾਲ ਵੇਖੇ ਜਾ ਸਕਦੇ ਹਨ।" },
        sometimes: { label: "ਥੋੜ੍ਹੀ ਮਿਹਨਤ ਨਾਲ", detail: "ਜਾਣਕਾਰੀ ਕੁਝ ਵੱਖ-ਵੱਖ ਥਾਵਾਂ ਤੇ ਹੈ।" },
        rarely: { label: "ਭਰੋਸੇਯੋਗ ਤਰੀਕੇ ਨਾਲ ਨਹੀਂ", detail: "ਮੈਂ ਯਾਦਦਾਸ਼ਤ ਜਾਂ ਰਸੀਦਾਂ ਤੋਂ ਅੰਦਾਜ਼ਾ ਲਗਾਉਂਦਾ ਹਾਂ।" },
        never: { label: "ਨਹੀਂ", detail: "ਮੈਂ ਅਜੇ ਭਰੋਸੇ ਨਾਲ ਨਹੀਂ ਦੱਸ ਸਕਦਾ।" },
      },
    },
    confidence: {
      eyebrow: "ਭਰੋਸਾ",
      title: "ਨਵਾਂ ਡਿਜ਼ਿਟਲ ਟੂਲ ਅਜ਼ਮਾਉਣ ਵਿੱਚ ਤੁਸੀਂ ਕਿੰਨੇ ਸਹਿਜ ਹੋ?",
      helper: "ਕੋਈ ਜਵਾਬ ਗਲਤ ਨਹੀਂ — ਇਸ ਨਾਲ ਤੁਹਾਡੀ ਯੋਜਨਾ ਦੀ ਰਫ਼ਤਾਰ ਤੈਅ ਕਰਨ ਵਿੱਚ ਮਦਦ ਮਿਲੇਗੀ।",
      options: {
        always: { label: "ਬਹੁਤ ਸਹਿਜ", detail: "ਮੈਨੂੰ ਨਵੇਂ ਐਪ ਅਜ਼ਮਾਉਣੇ ਚੰਗੇ ਲੱਗਦੇ ਹਨ।" },
        sometimes: { label: "ਮਦਦ ਨਾਲ ਸਿੱਖ ਸਕਦਾ ਹਾਂ", detail: "ਇੱਕ ਸਾਫ਼ ਗਾਈਡ ਮੇਰੇ ਲਈ ਕਾਫ਼ੀ ਹੈ।" },
        rarely: { label: "ਥੋੜ੍ਹਾ ਝਿਜਕਦਾ ਹਾਂ", detail: "ਮੈਂ ਇੱਕ ਵਾਰ ਵਿੱਚ ਇੱਕ ਬਦਲਾਅ ਪਸੰਦ ਕਰਦਾ ਹਾਂ।" },
        never: { label: "ਅਜੇ ਸਹਿਜ ਨਹੀਂ", detail: "ਮੈਨੂੰ ਬਹੁਤ ਸੌਖਾ ਪਹਿਲਾ ਕਦਮ ਚਾਹੀਦਾ ਹੈ।" },
      },
    },
  },
};

function getQuestionTranslation(question: Question, language: Language): QuestionTranslation {
  if (language !== "en") return questionCopy[language][question.id];
  return {
    eyebrow: question.eyebrow,
    title: question.title,
    helper: question.helper,
    options: Object.fromEntries(question.options.map((option) => [option.value, { label: option.label, detail: option.detail }])) as QuestionTranslation["options"],
  };
}

const recommendations: Recommendation[] = [
  {
    name: "Google Pay for Business",
    category: "payments",
    tag: "Get paid digitally",
    why: "Start accepting UPI payments with a QR code, so customers can pay in seconds.",
    action: "Create a business QR code",
    icon: Smartphone,
    color: "teal",
    url: "https://pay.google.com/intl/en_in/about/business/",
  },
  {
    name: "Google Business Profile",
    category: "presence",
    tag: "Be discoverable",
    why: "Help nearby customers find your hours, location, phone number, and reviews on Search and Maps.",
    action: "Claim your free listing",
    icon: MapPin,
    color: "blue",
    url: "https://www.google.com/business/",
  },
  {
    name: "Google Sheets",
    category: "records",
    tag: "See your numbers",
    why: "Replace loose paper notes with a simple sales, expense, and stock tracker you can open on your phone.",
    action: "Open a free template",
    icon: BarChart3,
    color: "lime",
    url: "https://sheets.google.com/",
  },
  {
    name: "WhatsApp Business",
    category: "marketing",
    tag: "Stay connected",
    why: "Create a clear customer channel with a profile, catalogue, labels, and quick replies.",
    action: "Set up your profile",
    icon: MessageCircle,
    color: "violet",
    url: "https://business.whatsapp.com/",
  },
  {
    name: "Canva Free",
    category: "marketing",
    tag: "Look professional",
    why: "Make simple offer cards and social posts from ready-made templates, without design experience.",
    action: "Make your first post",
    icon: Sparkles,
    color: "coral",
    url: "https://www.canva.com/",
  },
];

const categoryMeta: Record<Category, { label: string; short: string; icon: typeof WalletCards; color: string }> = {
  payments: { label: "Digital payments", short: "Payments", icon: WalletCards, color: "teal" },
  presence: { label: "Online presence", short: "Presence", icon: MapPin, color: "blue" },
  records: { label: "Business records", short: "Records", icon: ClipboardList, color: "lime" },
  marketing: { label: "Customer connection", short: "Marketing", icon: Megaphone, color: "violet" },
};

const categoryCopy: Record<Category, Record<Language, { label: string; short: string }>> = {
  payments: {
    en: { label: "Digital payments", short: "Payments" },
    hi: { label: "डिजिटल भुगतान", short: "भुगतान" },
    pa: { label: "ਡਿਜ਼ਿਟਲ ਭੁਗਤਾਨ", short: "ਭੁਗਤਾਨ" },
  },
  presence: {
    en: { label: "Online presence", short: "Presence" },
    hi: { label: "ऑनलाइन मौजूदगी", short: "मौजूदगी" },
    pa: { label: "ਆਨਲਾਈਨ ਮੌਜੂਦਗੀ", short: "ਮੌਜੂਦਗੀ" },
  },
  records: {
    en: { label: "Business records", short: "Records" },
    hi: { label: "व्यवसाय के रिकॉर्ड", short: "रिकॉर्ड" },
    pa: { label: "ਕਾਰੋਬਾਰੀ ਰਿਕਾਰਡ", short: "ਰਿਕਾਰਡ" },
  },
  marketing: {
    en: { label: "Customer connection", short: "Marketing" },
    hi: { label: "ग्राहकों से जुड़ाव", short: "मार्केटिंग" },
    pa: { label: "ਗਾਹਕਾਂ ਨਾਲ ਜੁੜਾਅ", short: "ਮਾਰਕੀਟਿੰਗ" },
  },
};

const recommendationCopy: Record<string, Record<Language, { tag: string; why: string; action: string }>> = {
  "Google Pay for Business": {
    en: { tag: "Get paid digitally", why: "Start accepting UPI payments with a QR code, so customers can pay in seconds.", action: "Create a business QR code" },
    hi: { tag: "डिजिटल भुगतान लें", why: "QR कोड से UPI भुगतान लेना शुरू करें, ताकि ग्राहक कुछ ही सेकंड में भुगतान कर सकें।", action: "बिज़नेस QR कोड बनाएँ" },
    pa: { tag: "ਡਿਜ਼ਿਟਲ ਭੁਗਤਾਨ ਲਓ", why: "QR ਕੋਡ ਨਾਲ UPI ਭੁਗਤਾਨ ਲੈਣਾ ਸ਼ੁਰੂ ਕਰੋ, ਤਾਂ ਜੋ ਗਾਹਕ ਕੁਝ ਸਕਿੰਟਾਂ ਵਿੱਚ ਭੁਗਤਾਨ ਕਰ ਸਕਣ।", action: "ਬਿਜ਼ਨਸ QR ਕੋਡ ਬਣਾਓ" },
  },
  "Google Business Profile": {
    en: { tag: "Be discoverable", why: "Help nearby customers find your hours, location, phone number, and reviews on Search and Maps.", action: "Claim your free listing" },
    hi: { tag: "ऑनलाइन आसानी से मिलें", why: "नज़दीकी ग्राहकों को Search और Maps पर आपके समय, लोकेशन, फ़ोन नंबर और रिव्यू मिल सकें।", action: "अपनी मुफ़्त लिस्टिंग लें" },
    pa: { tag: "ਆਨਲਾਈਨ ਆਸਾਨੀ ਨਾਲ ਲੱਭੋ", why: "ਨੇੜਲੇ ਗਾਹਕਾਂ ਨੂੰ Search ਅਤੇ Maps ਉੱਤੇ ਤੁਹਾਡਾ ਸਮਾਂ, ਟਿਕਾਣਾ, ਫੋਨ ਨੰਬਰ ਅਤੇ ਰਿਵਿਊ ਮਿਲ ਸਕਣ।", action: "ਆਪਣੀ ਮੁਫ਼ਤ ਲਿਸਟਿੰਗ ਲਓ" },
  },
  "Google Sheets": {
    en: { tag: "See your numbers", why: "Replace loose paper notes with a simple sales, expense, and stock tracker you can open on your phone.", action: "Open a free template" },
    hi: { tag: "अपने आँकड़े देखें", why: "बिखरे हुए कागज़ी नोट्स की जगह बिक्री, खर्च और स्टॉक का आसान ट्रैकर रखें, जिसे फोन पर भी खोल सकें।", action: "मुफ़्त टेम्पलेट खोलें" },
    pa: { tag: "ਆਪਣੇ ਅੰਕੜੇ ਵੇਖੋ", why: "ਖਿੱਲਰੇ ਕਾਗਜ਼ੀ ਨੋਟਾਂ ਦੀ ਥਾਂ ਵਿਕਰੀ, ਖਰਚੇ ਅਤੇ ਸਟਾਕ ਦਾ ਸੌਖਾ ਟ੍ਰੈਕਰ ਰੱਖੋ, ਜੋ ਫੋਨ ਉੱਤੇ ਵੀ ਖੁੱਲ੍ਹ ਸਕੇ।", action: "ਮੁਫ਼ਤ ਟੈਂਪਲੇਟ ਖੋਲ੍ਹੋ" },
  },
  "WhatsApp Business": {
    en: { tag: "Stay connected", why: "Create a clear customer channel with a profile, catalogue, labels, and quick replies.", action: "Set up your profile" },
    hi: { tag: "ग्राहकों से जुड़े रहें", why: "प्रोफ़ाइल, कैटलॉग, लेबल और जल्दी जवाब देने की सुविधा के साथ ग्राहकों के लिए साफ़ संपर्क माध्यम बनाएँ।", action: "अपनी प्रोफ़ाइल बनाएँ" },
    pa: { tag: "ਗਾਹਕਾਂ ਨਾਲ ਜੁੜੇ ਰਹੋ", why: "ਪ੍ਰੋਫ਼ਾਈਲ, ਕੈਟਾਲਾਗ, ਲੇਬਲ ਅਤੇ ਜਲਦੀ ਜਵਾਬ ਦੀ ਸਹੂਲਤ ਨਾਲ ਗਾਹਕਾਂ ਲਈ ਸਾਫ਼ ਸੰਪਰਕ ਮਾਧਿਅਮ ਬਣਾਓ।", action: "ਆਪਣੀ ਪ੍ਰੋਫ਼ਾਈਲ ਬਣਾਓ" },
  },
  "Canva Free": {
    en: { tag: "Look professional", why: "Make simple offer cards and social posts from ready-made templates, without design experience.", action: "Make your first post" },
    hi: { tag: "पेशेवर दिखें", why: "बिना डिज़ाइन अनुभव के तैयार टेम्पलेट्स से आसान ऑफ़र कार्ड और सोशल पोस्ट बनाएँ।", action: "अपनी पहली पोस्ट बनाएँ" },
    pa: { tag: "ਪੇਸ਼ੇਵਰ ਦਿਖੋ", why: "ਬਿਨਾਂ ਡਿਜ਼ਾਈਨ ਤਜਰਬੇ ਦੇ ਤਿਆਰ ਟੈਂਪਲੇਟਾਂ ਨਾਲ ਸੌਖੇ ਆਫ਼ਰ ਕਾਰਡ ਅਤੇ ਸੋਸ਼ਲ ਪੋਸਟ ਬਣਾਓ।", action: "ਆਪਣੀ ਪਹਿਲੀ ਪੋਸਟ ਬਣਾਓ" },
  },
};

const answerLabels: Record<AnswerKey, string> = {
  always: "Strong foundation",
  sometimes: "Partly in place",
  rarely: "Early stage",
  never: "First opportunity",
};

export default function Home() {
  const [step, setStep] = useState<"intro" | "quiz" | "results">("intro");
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerKey>>({});
  const [language, setLanguage] = useState<Language>("en");

  const progress = step === "intro" ? 0 : step === "results" ? 100 : Math.round((current / questions.length) * 100);
  const question = questions[current];
  const copy = uiCopy[language];
  const localizedQuestion = getQuestionTranslation(question, language);

  useEffect(() => {
    document.documentElement.lang = language === "hi" ? "hi-IN" : language === "pa" ? "pa-IN" : "en-IN";
  }, [language]);

  const result = useMemo(() => {
    const categoryScores = (Object.keys(categoryMeta) as Category[]).map((category) => {
      const related = questions.filter((item) => item.category === category);
      const score = related.reduce((sum, item) => {
        const selected = item.options.find((option) => option.value === answers[item.id]);
        return sum + (selected?.points ?? 0);
      }, 0);
      const max = related.length * 3;
      return { category, score, max, percent: max ? Math.round((score / max) * 100) : 0 };
    });
    const total = categoryScores.reduce((sum, item) => sum + item.score, 0);
    const max = categoryScores.reduce((sum, item) => sum + item.max, 0);
    const gapCategories = [...categoryScores].sort((a, b) => a.percent - b.percent);
    const roadmap = [...recommendations].sort((a, b) => {
      const aScore = gapCategories.find((item) => item.category === a.category)?.percent ?? 100;
      const bScore = gapCategories.find((item) => item.category === b.category)?.percent ?? 100;
      return aScore - bScore;
    });
    return { categoryScores, total, max, percent: max ? Math.round((total / max) * 100) : 0, roadmap };
  }, [answers]);

  function startQuiz() {
    setStep("quiz");
    setCurrent(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function chooseAnswer(value: AnswerKey) {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  }

  function nextQuestion() {
    if (!answers[question.id]) return;
    if (current === questions.length - 1) {
      setStep("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setCurrent((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function previousQuestion() {
    if (current === 0) {
      setStep("intro");
    } else {
      setCurrent((prev) => prev - 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function restart() {
    setAnswers({});
    setStep("intro");
    setCurrent(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark">
          <span className="brand-symbol"><Store size={17} strokeWidth={2.4} /></span>
          <span>ready<span className="brand-dot">.</span>local</span>
        </div>
        <div className="topbar-actions">
          <div className="language-switcher" role="group" aria-label={copy.languageLabel}>
            {languageOptions.map((option) => <button type="button" key={option.value} className={`language-button ${language === option.value ? "active" : ""}`} aria-pressed={language === option.value} onClick={() => setLanguage(option.value)}>{option.label}</button>)}
          </div>
          <div className="topbar-note"><ShieldCheck size={15} /> {copy.businessTop}</div>
        </div>
      </header>

      {step === "intro" && (
        <section className="intro-page page-wrap">
          <div className="intro-grid">
            <div className="intro-copy">
              <div className="kicker"><span className="kicker-dot" /> {copy.checkinKicker}</div>
              <h1>{copy.introTitle} <em>{copy.introTitleEm}</em></h1>
              <p className="intro-lead">{copy.introLead}</p>
              <div className="intro-actions">
                <button className="primary-button" onClick={startQuiz}>{copy.start} <ArrowRight size={18} /></button>
                <span className="micro-note"><CircleHelp size={15} /> {copy.noSignup}</span>
              </div>
              <div className="proof-row">
                <div className="proof-item"><strong>07</strong><span>{copy.questions.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</span></div>
                <div className="proof-divider" />
                <div className="proof-item"><strong>04</strong><span>{copy.areas.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</span></div>
                <div className="proof-divider" />
                <div className="proof-item"><strong>05</strong><span>{copy.tools.split("\n").map((line) => <span key={line}>{line}<br /></span>)}</span></div>
              </div>
            </div>
            <div className="intro-art" aria-label={copy.artLabel}>
              <div className="sun-orb" />
              <div className="art-label art-label-top"><span className="label-pulse" /> {copy.artLabel}</div>
              <div className="shop-illustration">
                <div className="shop-roof" />
                <div className="shop-body">
                  <div className="shop-sign"><Store size={14} /> MANGO & MINT</div>
                  <div className="shop-windows"><div /><div /><div /></div>
                  <div className="shop-door"><div className="door-handle" /></div>
                </div>
                <div className="shop-base" />
                <div className="plant plant-left"><span /><i /><b /></div>
                <div className="plant plant-right"><span /><i /><b /></div>
              </div>
              <div className="floating-card card-up"><span className="mini-icon"><ArrowRight size={13} /></span><div><b>+24%</b><small>{copy.discoverable}</small></div></div>
              <div className="floating-card card-pay"><span className="mini-icon"><IndianRupee size={13} /></span><div><b>UPI ready</b><small>{copy.nextWin}</small></div></div>
              <div className="art-spark spark-one">✦</div><div className="art-spark spark-two">✦</div>
              <div className="art-ground" />
            </div>
          </div>
          <div className="intro-footer"><span>{copy.introFooter}</span><span className="footer-arrow">↘</span></div>
        </section>
      )}

      {step === "quiz" && question && (
        <section className="quiz-page page-wrap">
          <div className="quiz-progress-row"><button className="back-button" onClick={previousQuestion}><ChevronLeft size={17} /> {copy.back}</button><span>{copy.question} {String(current + 1).padStart(2, "0")} <i>{copy.of} {String(questions.length).padStart(2, "0")}</i></span><span className="progress-percent">{progress}% {copy.complete}</span></div>
          <div className="progress-track"><div style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
          <div className="quiz-content">
            <div className="question-meta"><span className={`category-chip ${categoryMeta[question.category].color}`}><question.icon size={15} /> {localizedQuestion.eyebrow}</span><span className="question-prompt">{copy.honest}</span></div>
            <h2>{localizedQuestion.title}</h2>
            <p className="question-helper">{localizedQuestion.helper}</p>
            <div className="answer-list">
              {question.options.map((option, index) => {
                const selected = answers[question.id] === option.value;
                const optionCopy = localizedQuestion.options[option.value];
                return <button key={option.value} className={`answer-card ${selected ? "selected" : ""}`} onClick={() => chooseAnswer(option.value)}><span className="answer-index">{String.fromCharCode(65 + index)}</span><span className="answer-text"><b>{optionCopy.label}</b><small>{optionCopy.detail}</small></span><span className="answer-check">{selected ? <Check size={17} /> : <span />}</span></button>;
              })}
            </div>
            <div className="quiz-bottom"><span className="privacy-note"><ShieldCheck size={15} /> {copy.privacy}</span><button className="primary-button" disabled={!answers[question.id]} onClick={nextQuestion}>{current === questions.length - 1 ? copy.roadmapButton : copy.nextQuestion} <ArrowRight size={18} /></button></div>
          </div>
        </section>
      )}

      {step === "results" && (
        <section className="results-page page-wrap">
          <div className="results-head"><div><div className="kicker"><span className="kicker-dot" /> {copy.resultsKicker}</div><h2>{copy.resultsTitle}</h2><p>{copy.resultsLead}</p></div><button className="restart-button" onClick={restart}><RefreshCcw size={15} /> {copy.retake}</button></div>
          <div className="score-layout">
            <div className="score-card">
              <div className="score-ring" style={{ "--score": `${result.percent * 3.6}deg` } as React.CSSProperties}><div><strong>{result.percent}</strong><span>/ 100</span></div></div>
              <p className="score-kicker">{copy.startingPoint}</p><h3>{result.percent < 40 ? copy.scoreEarly : result.percent < 70 ? copy.scoreMid : copy.scoreHigh}</h3><p>{copy.scoreDesc}</p>
            </div>
            <div className="category-panel"><div className="panel-heading"><div><span className="eyebrow">{copy.fourAreas}</span><h3>{copy.whereStands}</h3></div><span className="legend"><i className="legend-dot" /> {copy.stronger} <i className="legend-dot muted" /> {copy.opportunity}</span></div><div className="category-bars">{result.categoryScores.map((item) => { const meta = categoryMeta[item.category]; const localizedMeta = categoryCopy[item.category][language]; const Icon = meta.icon; return <div className="category-row" key={item.category}><div className={`category-icon ${meta.color}`}><Icon size={17} /></div><div className="category-name"><b>{localizedMeta.label}</b><small>{item.percent < 50 ? copy.biggest : item.percent < 80 ? copy.partial : copy.strong}</small></div><div className="bar-track"><div className={`bar-fill ${meta.color}`} style={{ width: `${Math.max(item.percent, 5)}%` }} /></div><strong className="category-score">{item.percent}</strong></div> })}</div></div>
          </div>
          <div className="roadmap-heading"><div><span className="eyebrow">{copy.roadmapKicker}</span><h2>{copy.roadmapTitle}</h2><p>{copy.roadmapLead}</p></div><span className="roadmap-count"><span>05</span> {copy.practicalTools}</span></div>
          <div className="roadmap-list">{result.roadmap.map((item, index) => { const Icon = item.icon; const meta = categoryMeta[item.category]; const localizedMeta = categoryCopy[item.category][language]; const localizedRecommendation = recommendationCopy[item.name][language]; return <article className="roadmap-card" key={item.name}><div className="step-number">{String(index + 1).padStart(2, "0")}</div><div className={`roadmap-icon ${item.color}`}><Icon size={20} /></div><div className="roadmap-copy"><div className="roadmap-tags"><span className={`category-tag ${item.color}`}>{localizedMeta.short}</span><span className="free-tag">{copy.freeToStart}</span></div><h3>{item.name}</h3><p>{localizedRecommendation.why}</p></div><a className="roadmap-action" href={item.url} target="_blank" rel="noreferrer">{localizedRecommendation.action}<ExternalLink size={15} /></a></article>; })}</div>
          <div className="next-step-banner"><div className="banner-icon"><Sparkles size={22} /></div><div><b>{copy.nextStepTitle}</b><p>{copy.nextStepLead}</p></div><button className="banner-button" onClick={() => window.open(result.roadmap[0].url, "_blank", "noopener,noreferrer")}>{copy.takeStep} <ArrowRight size={16} /></button></div>
          <footer className="results-footer"><span><Store size={15} /> {copy.footerLine}</span><span>{copy.footerNote}</span></footer>
        </section>
      )}
    </main>
  );
}
