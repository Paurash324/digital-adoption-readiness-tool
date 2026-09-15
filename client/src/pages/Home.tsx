import { useMemo, useState } from "react";
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

  const progress = step === "intro" ? 0 : step === "results" ? 100 : Math.round((current / questions.length) * 100);
  const question = questions[current];

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
        <div className="topbar-note"><ShieldCheck size={15} /> Built for small businesses · ₹0 to start</div>
      </header>

      {step === "intro" && (
        <section className="intro-page page-wrap">
          <div className="intro-grid">
            <div className="intro-copy">
              <div className="kicker"><span className="kicker-dot" /> DIGITAL ADOPTION CHECK-IN</div>
              <h1>Make your next digital move <em>the right one.</em></h1>
              <p className="intro-lead">A simple 3-minute check-in for local businesses. Find your biggest opportunity, then get a practical roadmap of free tools to try first.</p>
              <div className="intro-actions">
                <button className="primary-button" onClick={startQuiz}>Start the check-in <ArrowRight size={18} /></button>
                <span className="micro-note"><CircleHelp size={15} /> No sign-up. No jargon. No sales pitch.</span>
              </div>
              <div className="proof-row">
                <div className="proof-item"><strong>07</strong><span>plain-language<br />questions</span></div>
                <div className="proof-divider" />
                <div className="proof-item"><strong>04</strong><span>business areas<br />checked</span></div>
                <div className="proof-divider" />
                <div className="proof-item"><strong>05</strong><span>free tools<br />in your roadmap</span></div>
              </div>
            </div>
            <div className="intro-art" aria-label="Illustration of a local shop with digital growth indicators">
              <div className="sun-orb" />
              <div className="art-label art-label-top"><span className="label-pulse" /> YOUR BUSINESS, MOVING FORWARD</div>
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
              <div className="floating-card card-up"><span className="mini-icon"><ArrowRight size={13} /></span><div><b>+24%</b><small>more discoverable</small></div></div>
              <div className="floating-card card-pay"><span className="mini-icon"><IndianRupee size={13} /></span><div><b>UPI ready</b><small>next easy win</small></div></div>
              <div className="art-spark spark-one">✦</div><div className="art-spark spark-two">✦</div>
              <div className="art-ground" />
            </div>
          </div>
          <div className="intro-footer"><span>Designed around the real day-to-day of local shops, services, and home businesses.</span><span className="footer-arrow">↘</span></div>
        </section>
      )}

      {step === "quiz" && question && (
        <section className="quiz-page page-wrap">
          <div className="quiz-progress-row"><button className="back-button" onClick={previousQuestion}><ChevronLeft size={17} /> Back</button><span>Question {String(current + 1).padStart(2, "0")} <i>of {String(questions.length).padStart(2, "0")}</i></span><span className="progress-percent">{progress}% complete</span></div>
          <div className="progress-track"><div style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
          <div className="quiz-content">
            <div className="question-meta"><span className={`category-chip ${categoryMeta[question.category].color}`}><question.icon size={15} /> {question.eyebrow}</span><span className="question-prompt">ONE HONEST ANSWER IS ALL WE NEED</span></div>
            <h2>{question.title}</h2>
            <p className="question-helper">{question.helper}</p>
            <div className="answer-list">
              {question.options.map((option, index) => {
                const selected = answers[question.id] === option.value;
                return <button key={option.value} className={`answer-card ${selected ? "selected" : ""}`} onClick={() => chooseAnswer(option.value)}><span className="answer-index">{String.fromCharCode(65 + index)}</span><span className="answer-text"><b>{option.label}</b><small>{option.detail}</small></span><span className="answer-check">{selected ? <Check size={17} /> : <span />}</span></button>;
              })}
            </div>
            <div className="quiz-bottom"><span className="privacy-note"><ShieldCheck size={15} /> Your answers stay in this browser.</span><button className="primary-button" disabled={!answers[question.id]} onClick={nextQuestion}>{current === questions.length - 1 ? "See my roadmap" : "Next question"} <ArrowRight size={18} /></button></div>
          </div>
        </section>
      )}

      {step === "results" && (
        <section className="results-page page-wrap">
          <div className="results-head"><div><div className="kicker"><span className="kicker-dot" /> YOUR READINESS SNAPSHOT</div><h2>You have a clear place to start.</h2><p>Here is what your answers tell us — and the small moves most likely to create momentum first.</p></div><button className="restart-button" onClick={restart}><RefreshCcw size={15} /> Retake check-in</button></div>
          <div className="score-layout">
            <div className="score-card">
              <div className="score-ring" style={{ "--score": `${result.percent * 3.6}deg` } as React.CSSProperties}><div><strong>{result.percent}</strong><span>/ 100</span></div></div>
              <p className="score-kicker">YOUR DIGITAL STARTING POINT</p><h3>{result.percent < 40 ? "Early steps, real upside." : result.percent < 70 ? "Good foundations to build on." : "You are ready to go further."}</h3><p>Readiness is not a grade. It is simply a map of what to do next.</p>
            </div>
            <div className="category-panel"><div className="panel-heading"><div><span className="eyebrow">THE FOUR AREAS</span><h3>Where your business stands</h3></div><span className="legend"><i className="legend-dot" /> stronger <i className="legend-dot muted" /> opportunity</span></div><div className="category-bars">{result.categoryScores.map((item) => { const meta = categoryMeta[item.category]; const Icon = meta.icon; return <div className="category-row" key={item.category}><div className={`category-icon ${meta.color}`}><Icon size={17} /></div><div className="category-name"><b>{meta.label}</b><small>{item.percent < 50 ? "Your biggest opportunity" : item.percent < 80 ? "Partly in place" : "Strong foundation"}</small></div><div className="bar-track"><div className={`bar-fill ${meta.color}`} style={{ width: `${Math.max(item.percent, 5)}%` }} /></div><strong className="category-score">{item.percent}</strong></div> })}</div></div>
          </div>
          <div className="roadmap-heading"><div><span className="eyebrow">YOUR ZERO-COST ROADMAP</span><h2>Do these next, in this order.</h2><p>Each recommendation responds to a gap in your answers. Start with step one — not all five at once.</p></div><span className="roadmap-count"><span>05</span> practical tools</span></div>
          <div className="roadmap-list">{result.roadmap.map((item, index) => { const Icon = item.icon; const meta = categoryMeta[item.category]; return <article className="roadmap-card" key={item.name}><div className="step-number">{String(index + 1).padStart(2, "0")}</div><div className={`roadmap-icon ${item.color}`}><Icon size={20} /></div><div className="roadmap-copy"><div className="roadmap-tags"><span className={`category-tag ${item.color}`}>{meta.short}</span><span className="free-tag">FREE TO START</span></div><h3>{item.name}</h3><p>{item.why}</p></div><a className="roadmap-action" href={item.url} target="_blank" rel="noreferrer">{item.action}<ExternalLink size={15} /></a></article>; })}</div>
          <div className="next-step-banner"><div className="banner-icon"><Sparkles size={22} /></div><div><b>Start small. Make it stick.</b><p>Pick the first recommendation and spend 20 minutes on it today. Progress compounds when the next step is obvious.</p></div><button className="banner-button" onClick={() => window.open(result.roadmap[0].url, "_blank", "noopener,noreferrer")}>Take step one <ArrowRight size={16} /></button></div>
          <footer className="results-footer"><span><Store size={15} /> ready.local · Digital adoption, without the overwhelm.</span><span>Built with free tools for the businesses that keep communities moving.</span></footer>
        </section>
      )}
    </main>
  );
}
