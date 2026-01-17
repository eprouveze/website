# 5 Content Pieces: AI Experimentation from a Business Leader

**Persona**: Client Managing Director at Salesforce Japan, 20+ years enterprise sales (NTT as main account), hands-on AI hobbyist

**Frame**: Personal curiosity and weekend experiments. Complement Salesforce direction, don't contradict it.

---

## 1. "I'm 50. I Started Coding AI Projects. Here's What I Learned."

**Type**: LinkedIn post (600-800 words)
**Audience**: Executives curious about AI, leaders who "understand" but don't "build"

### The Story
A sales executive with 20+ years of enterprise relationships decides to actually build AI projects in his spare time. Not to solve work problems—out of curiosity. What changes when you go from reading about AI to writing code?

### Key Points
- The gap between "understanding AI" and "building AI" is enormous
- Building changes how you evaluate vendors, talk to engineers, think about adoption
- Most executives talk AI strategy; few write a single line of code
- Specific failures: first prompt that produced garbage, first architecture that didn't scale, first model that hallucinated
- What surprised you: how much iteration matters, how prompts need testing, how "simple" features aren't

### Hook
"My job is relationships. My evenings became Python. Here's what 6 months of hobby coding taught me about AI that no strategy deck could."

### Salesforce Alignment
"Salesforce is betting big on Agentforce—AI that acts, not just answers. I wanted to understand what that actually takes to build. Now when I talk to engineers about AI projects, I speak from experience, not just understanding."

### Structure
1. Opening: "I'm 50. Most of my peers read about AI. I decided to build."
2. The decision: Why start coding? (Curiosity, not necessity)
3. What I built: Quick mentions of projects (forecasting experiment, HealthPulse, translator)
4. What surprised me: 3-4 specific learnings
5. What changed: How I think about AI adoption differently now
6. Closing: "You don't need to build to have AI opinions. But building changed mine."

---

## 2. "Claude as Health Coach: What I Learned Building HealthPulse"

**Type**: Longer blog piece (1200-1500 words)
**Audience**: Health-curious professionals, AI adopters interested in personal applications

### The Story
Built a personal health dashboard called HealthPulse that uses Claude to synthesize health data and provide daily guidance. Not a medical tool—a personal experiment in AI as advisor.

### Key Points
- The problem: Health data is scattered (Apple Watch, blood tests, sleep trackers). I wanted synthesis, not another app.
- The design: AI doesn't just answer questions—it proactively tells you what matters today
- The challenge: Context management. How do you give AI enough history without overwhelming it?
- The surprise: AI as coach works differently than AI as search. The framing matters.
- Privacy choices: Why this runs locally, what data stays where

### Hook
"I didn't want to query my health data. I wanted an AI that looked at everything and told me what to focus on. So I built one."

### Salesforce Alignment
"This is what Agentforce aims to do for sales teams—proactive guidance, not just reactive answers. Instead of asking 'what should I do?' the system tells you 'here's what matters today.' I wanted to understand that pattern with my own data before I see it in enterprise tools."

### Structure
1. Opening: The frustration (data everywhere, synthesis nowhere)
2. What HealthPulse does: Daily synthesis, proactive recommendations
3. Technical choices: Claude, local-first, data sources
4. What I learned about AI as advisor vs. AI as search
5. Limitations: What it can't do, what I don't trust it for
6. Broader pattern: From personal health to enterprise productivity

### Screenshots/Visuals (if possible)
- Dashboard overview (anonymized)
- Example of daily synthesis
- Before/after comparison (scattered data vs. synthesized view)

---

## 3. "What Japanese Enterprise Taught Me About AI Adoption"

**Type**: LinkedIn post (600-800 words)
**Audience**: Japan market professionals, enterprise tech leaders, cross-cultural business folks

### The Story
20 years selling to NTT and Japanese enterprises. Observations about how Japan approaches technology differently—and what that means for AI adoption.

### Key Points
- Japanese enterprises don't "move fast and break things." They move deliberately and trust slowly.
- Consensus decision-making: AI decisions require broader buy-in
- Data privacy: Japan has strong cultural (not just regulatory) privacy expectations
- Trust requirements: "AI recommended this" isn't enough; explainability matters
- Pilot culture: Small, controlled experiments before scale
- What works: Showing AI as assistant to experts, not replacement

### Hook
"Japanese enterprises don't move fast and break things. They move deliberately and trust slowly. Here's what that means for AI adoption."

### Salesforce Alignment
"Salesforce Japan understands this. Trust Layer, data residency, gradual adoption—these aren't just features, they're requirements. My personal AI experiments helped me appreciate why 'enterprise-ready' means something different in Japan."

### Structure
1. Opening: "I've sold technology to Japanese enterprises for 20 years."
2. The pattern: Deliberate adoption, trust-first
3. AI-specific observations: What I see happening now
4. What doesn't work: US-style "just try it" approaches
5. What does work: Expert-augmentation framing, controlled pilots, explainability
6. Closing: The opportunity for AI that respects this culture

### Cultural Notes
- Don't position Japan as "behind"—position as "different"
- Respect consensus culture without condescension
- Specific examples from NTT or similar (anonymized if needed)

---

## 4. "From Empty Repo to Working AI in 6 Months: The Journey Nobody Shows"

**Type**: Longer blog piece (1500-2000 words)
**Audience**: Builders, curious executives, anyone who romanticizes "clean" development

### The Story
June 30: empty repository. January 17: working AI application with multi-turn conversations, dynamic UI generation, multi-source data processing. But the path wasn't straight. 4 AI providers tried (3 abandoned), 2 architecture rewrites, 9 prompt template versions, and countless pivots.

### Key Points
- Day 1: Just a README. What was the original vision?
- First pivot: SQLite to DuckDB (week 2). Why embedded databases matter.
- Second pivot: Flask to FastAPI (week 12). When the old architecture can't support new needs.
- Third pivot: Claude to OpenAI to Llama to Gemini. What each taught me.
- The template evolution: v1.0 → v1.9. Why prompts need versioning.
- Abandoned features: What I built and removed (and why that's fine)
- The real timeline: Not linear. Messy. Full of backtracking.

### Hook
"4 AI providers tried, 3 abandoned. 2 architecture rewrites. 9 prompt versions. One working project. Here's the journey nobody posts about."

### Salesforce Alignment
"This is why platforms matter. Salesforce absorbs this complexity—the provider selection, the architecture decisions, the iteration—so users don't have to reinvent it. But experiencing it firsthand helps me appreciate what 'enterprise-ready' actually means."

### Structure
1. Opening: The destination (what it looks like now)
2. Day 1: Empty repo, big ideas
3. The timeline: Key pivots with specific weeks
4. What I abandoned: Features that didn't survive
5. What I rewrote: Architectures that couldn't scale
6. What I learned: 3-4 meta-lessons about building with AI
7. Closing: "The journey is the learning. The product is the proof."

### Specific Data Points to Include
- 1,383 commits over 6.5 months
- 4 AI providers
- 2 major architecture rewrites
- 9 prompt template versions
- Lines of code (if meaningful)
- Time invested (rough estimate)

---

## 5. "Building My Digital Twin: How I Taught Gemini to Write Like Me"

**Type**: Blog piece with LinkedIn summary (1200-1500 words)
**Audience**: Content creators, multilingual professionals, AI power users

### The Story
Built a Gemini GEM that writes in your personal voice—across languages (English, Japanese, French) and contexts (LinkedIn posts, emails, technical docs). Not a generic "writing assistant." A digital twin that sounds like you.

### Key Points
- The problem: AI writes generic. It doesn't know your sentence rhythms, your word choices, your cultural code-switching.
- The approach: Feed it examples of your actual writing across contexts and languages
- The technical how: Gemini GEMs, system prompts, few-shot examples, iterative refinement
- The multilingual challenge: Voice isn't just words—it's cultural framing. "Direct" in English, "contextual" in Japanese.
- What worked: Specific examples beat abstract descriptions. "Write like this" > "be concise and direct"
- What didn't: First versions were uncanny valley—almost-me but wrong. Iteration required.
- The result: A writing partner that drafts in your voice, which you then refine

### Hook
"AI writes generic. I wanted it to write like me—in English, Japanese, and French. Here's how I built a digital twin that actually sounds like me."

### Salesforce Alignment
"Personalization is the next frontier of AI assistants. Agentforce isn't just about actions—it's about understanding context and adapting. My experiment with voice personalization helped me see how hard (and valuable) that is."

### Structure
1. Opening: "ChatGPT writes like ChatGPT. I wanted an AI that writes like me."
2. The problem: Generic AI voice, cultural mismatches across languages
3. What I built: Gemini GEM with voice training
4. The process: Collecting examples, defining voice characteristics, iterating
5. Multilingual considerations: How voice changes across English/Japanese/French
6. What I learned: Examples > instructions, iteration is essential
7. Limitations: It's a draft partner, not a replacement
8. Closing: "My digital twin drafts. I refine. Together we're faster."

### Technical Details to Include
- Gemini GEM setup process
- Example of system prompt structure
- How many examples needed (rough number)
- Before/after comparison of AI output
- Specific voice characteristics you defined (e.g., "short paragraphs, concrete examples, no corporate jargon")

### Multilingual Angle
This is unique to your situation:
- English: Direct, specific, punchy
- Japanese: Context-aware, relationship-acknowledging, appropriate formality levels
- French: (Your native—what's distinctive about your French voice?)
- The challenge: Same "you" expressed differently across languages
- The insight: Voice isn't vocabulary—it's thinking patterns

### Screenshots/Examples (if possible)
- GEM configuration screenshot
- Side-by-side: generic AI output vs. your-voice output
- Example of same message in two languages, both sounding like you

---

## Publishing Strategy

### Suggested Order
1. **#1 (I'm 50, Started Coding)** — establishes your unique position
2. **#3 (Japanese Enterprise)** — differentiates you in Japan market
3. **#5 (Digital Twin Voice)** — practical, shareable, multilingual hook
4. **#2 (HealthPulse)** — shows breadth beyond work-related tools
5. **#4 (6-Month Journey)** — deep dive for engaged audience

### Format Notes
- #1 and #3: LinkedIn-native, shorter, punchy
- #2, #4, and #5: Blog pieces with cross-post summary to LinkedIn
- #5 especially: High shareability—"how to make AI write like you" is universally appealing
- All: First-person, specific, honest about failures

---

## Framing Guidelines

**Always include**:
- "Personal project" / "weekend experiment" / "hobby coding"
- Reference to how Salesforce is addressing the same space professionally
- Specific concrete examples from actual experience

**Never include**:
- Implication that work tools are inadequate
- Suggestion that you built what Salesforce should provide
- Corporate product criticism

**Tone markers**:
- "I was curious about..." not "I needed to solve..."
- "This helped me appreciate..." not "This proved that..."
- "Salesforce is building..." not "Salesforce should build..."
