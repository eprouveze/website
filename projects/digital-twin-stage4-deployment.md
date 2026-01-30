# Stage 4: Deployment Guide

**Purpose**: Deploy your Voice DNA Runtime Block to your preferred AI platform.

**Time required**: 10-15 minutes
**Prerequisites**: Completed Stages 1-3 (you have your Runtime Block)

---

## Which Platform Should You Use?

### Quick Decision Tree

```
Do you have ChatGPT Plus/Pro/Team? ($20+/mo)
  └─ YES → Use ChatGPT Custom GPT (recommended)
  └─ NO ↓

Do you have Claude Pro? ($20/mo)
  └─ YES → Use Claude Project
  └─ NO ↓

Do you have Google AI Pro / Gemini Advanced? ($20/mo)
  └─ YES → Use Gemini Gem
  └─ NO ↓

Use Manual Mode (works with any AI, including free tiers)
```

### Platform Comparison

| Feature | ChatGPT GPT | Claude Project | Gemini Gem | Manual |
|---------|-------------|----------------|------------|--------|
| **Best for** | Most users | Writers, devs | Google users | Everyone |
| **Subscription** | Plus $20/mo | Pro $20/mo | AI Pro $20/mo | None |
| **Instruction limit** | ~8K chars | Very large | Instructions + 10 files | Unlimited |
| **Shareable** | Yes (public/private) | No | Yes | N/A |
| **File uploads** | Yes | Yes | Yes (Google Drive) | Depends |
| **Auto-detect works** | Yes | Yes | Yes | Yes |
| **Setup time** | 5 min | 5 min | 5 min | 2 min |

---

# Option 1: ChatGPT Custom GPT (Recommended)

**Best for**: Most users. Largest ecosystem, easiest to use, can share with others.

## Step 1: Access GPT Builder

1. Go to [chat.openai.com](https://chat.openai.com)
2. Click your profile icon (bottom left)
3. Select **"My GPTs"**
4. Click **"Create a GPT"**

## Step 2: Configure Your GPT

### In the "Create" tab:

**Name**: `[Your Name]'s Voice` or `My Digital Twin`

**Description**:
```
Writes in my authentic voice across all contexts. Auto-detects language, medium, and audience.
```

**Instructions**:
Copy and paste your entire **Runtime Block** here.

> ⚠️ If your Runtime Block exceeds the character limit (~8,000 chars), you have two options:
> 1. Compress slightly (remove some examples)
> 2. Upload the full block as a file (see Step 3)

### Conversation Starters (optional):
```
Draft an email to [client] about [topic]
Rewrite this in my voice: [paste text]
Help me respond to this message
Write a Slack update about [project]
```

## Step 3: Add Knowledge Files (Optional)

If your Runtime Block is very long, or you want to include your Master Voice Guide:

1. Go to the **"Configure"** tab
2. Scroll to **"Knowledge"**
3. Click **"Upload files"**
4. Upload:
   - `Runtime_Block.txt` (if too long for instructions)
   - `Master_Voice_Guide.pdf` (optional, for reference)
   - Sample documents in your voice (optional)

## Step 4: Set Capabilities

In the **"Configure"** tab, under **"Capabilities"**:

- ✅ Web Browsing (optional)
- ✅ DALL·E Image Generation (off, unless needed)
- ✅ Code Interpreter (off, unless needed)

## Step 5: Save and Test

1. Click **"Save"** (top right)
2. Choose visibility:
   - **Only me**: Private use
   - **Anyone with a link**: Share with team/clients
   - **Public**: List in GPT Store
3. Click **"Confirm"**

### Test Prompts:

```
Write a professional email declining a meeting request.
```

```
Draft a Slack message updating my team on project progress.
```

```
Rewrite this to sound like me: "We need to discuss the upcoming deadline and ensure all stakeholders are aligned on the deliverables."
```

Check that the output:
- ✅ Uses your sentence rhythm
- ✅ Matches your punctuation style
- ✅ Feels like something you'd actually write
- ✅ Auto-detected the correct mode

---

# Option 2: Claude Project

**Best for**: Writers, developers, anyone who needs large context windows.

## Step 1: Create a Project

1. Go to [claude.ai](https://claude.ai)
2. Click **"Projects"** in the left sidebar
3. Click **"Create Project"**

## Step 2: Configure the Project

**Project Name**: `My Voice` or `Digital Twin`

**Description**:
```
Writes in my authentic voice. Auto-detects context and language.
```

## Step 3: Add Project Instructions

1. In your project, click the **gear icon** (Settings)
2. Find **"Project Instructions"** or **"Custom Instructions"**
3. Paste your entire **Runtime Block**

> ✅ Claude Projects support very large instructions — your full Runtime Block will fit.

## Step 4: Add Knowledge (Optional)

1. In project settings, find **"Project Knowledge"**
2. Upload:
   - `Master_Voice_Guide.pdf`
   - Sample documents
   - Reference materials

## Step 5: Test

Start a new conversation in your project and test:

```
Write a professional email to a client explaining a delay.
```

```
Draft a casual Slack message to my team about Friday's plans.
```

Verify the output matches your voice patterns.

---

# Option 3: Gemini Gem

**Best for**: Google Workspace users, those with Gemini Advanced.

## Step 1: Access Gem Manager

1. Go to [gemini.google.com](https://gemini.google.com)
2. Click the **"Gems"** icon in the left sidebar (or find it in settings)
3. Click **"Create Gem"** or **"New Gem"**

## Step 2: Configure Your Gem

**Name**: `My Voice` or `[Your Name] Twin`

**Instructions**:
Paste your entire **Runtime Block**.

> 💡 Gemini Gems support both instructions AND file uploads. For best results, use both.

## Step 3: Add Knowledge Files

1. Click **"Add files"** or drag files into the Gem
2. Upload:
   - `Runtime_Block.txt` (backup)
   - `Master_Voice_Guide.pdf`
   - Sample documents in your voice
3. You can also link Google Drive documents (auto-updates!)

## Step 4: Save and Test

1. Click **"Save"**
2. Open your Gem from the Gems list
3. Test with prompts:

```
Write an email to a partner declining their proposal.
```

```
Draft a quick Slack update about this week's progress.
```

## Step 5: Share (Optional)

Gemini Gems can be shared:
1. Click the **share icon** on your Gem
2. Choose **"Anyone with the link"**
3. Share the link with team members

---

# Option 4: Manual Mode (Any AI)

**Best for**: Free tier users, API users, or anyone who wants maximum flexibility.

## Method A: Conversation Primer

At the start of any conversation, paste:

```
[Paste your Runtime Block here]

---

Now, please help me with the following:
[Your actual request]
```

The AI will use your Voice DNA for that entire conversation.

## Method B: System Prompt (API)

If using the API (OpenAI, Anthropic, Google):

```python
# OpenAI example
response = client.chat.completions.create(
    model="gpt-4",
    messages=[
        {
            "role": "system",
            "content": "[Your Runtime Block here]"
        },
        {
            "role": "user",
            "content": "Write an email declining a meeting."
        }
    ]
)
```

```python
# Anthropic example
response = client.messages.create(
    model="claude-sonnet-4-20250514",
    system="[Your Runtime Block here]",
    messages=[
        {"role": "user", "content": "Write an email declining a meeting."}
    ]
)
```

## Method C: Saved Snippet

Save your Runtime Block as a text file or snippet (using a tool like TextExpander, Raycast, or Alfred):

1. Create snippet with trigger (e.g., `;voice`)
2. Paste the Runtime Block
3. In any AI chat, type `;voice` to expand, then add your request

---

# Testing Your Digital Twin

## Quick Validation Checklist

After setup, test with these scenarios:

| Test | What to Check |
|------|---------------|
| Formal email | Sentence structure, transitions, sign-off |
| Casual Slack | Brevity, tone shift, formatting |
| Japanese (if applicable) | Keigo level, cushioning words |
| Refusal/negotiation | Firmness balanced with politeness |
| Friendly follow-up | Warmth, relationship language |

## Sample Test Prompts

### English External (Formal)
```
Write an email to a client named John explaining that we cannot accommodate his request for a 20% discount, but we value the partnership.
```

### English Internal (Slack)
```
Write a Slack message updating my team that the project deadline has moved to next Friday.
```

### Japanese External (if applicable)
```
田中様宛てに、来週の会議の日程変更をお願いするメールを書いてください。
```

### Mode Override Test
```
[MODE: INTERNAL_SLACK_EN]
Summarize this for my team: [paste long text]
```

## Red Flags to Watch For

If you see these, refine your Runtime Block:

| Problem | Likely Cause | Fix |
|---------|--------------|-----|
| Too formal for Slack | Mode detection failing | Add clearer mode triggers |
| Wrong language formality | Keigo rules unclear | Add more Japanese examples |
| Generic transitions | Templates not specific enough | Add your actual phrases |
| Inconsistent rhythm | Sentence rules too vague | Quantify (e.g., "max 20 words") |

---

# Maintenance & Iteration

## When to Update Your Runtime Block

- You notice consistent mismatches
- Your writing style evolves
- You add new communication contexts
- Platform limits change

## Version Control

Keep versions of your Runtime Block:
```
Runtime_Block_v1.0.txt  (original)
Runtime_Block_v1.1.txt  (after first round of fixes)
Runtime_Block_v2.0.txt  (major revision)
```

## Collecting Feedback

As you use your Digital Twin, note:
- Outputs that nailed your voice ✅
- Outputs that felt off ❌
- Patterns you want to add

Feed these back into Stage 2 (Forensic Extraction) periodically to refine.

---

# Troubleshooting

## "Output doesn't sound like me"

1. Check if correct mode was detected (look for mode announcement)
2. Verify Runtime Block was fully pasted (no truncation)
3. Try explicit mode override: `[MODE: EXTERNAL_ENGLISH]`
4. Review your corpus—did you include enough variety?

## "Instructions too long" (ChatGPT)

1. Remove explanatory comments from Runtime Block
2. Move examples to uploaded file
3. Keep only essential templates in instructions

## "Auto-detect chose wrong mode"

1. Add more context in your prompt
2. Use explicit mode override
3. Refine detection triggers in Runtime Block

## "Japanese keigo level is wrong"

1. Check your corpus included appropriate keigo examples
2. Add explicit formality markers to Runtime Block
3. Specify recipient relationship in prompt

---

# Quick Reference Card

## Platform Setup Summary

| Platform | Where to Paste Runtime Block |
|----------|------------------------------|
| ChatGPT | Create GPT → Configure → Instructions |
| Claude | Project → Settings → Project Instructions |
| Gemini | Create Gem → Instructions |
| API | System prompt / system message |
| Manual | Start of conversation |

## Mode Override Syntax

```
[MODE: EXTERNAL_ENGLISH]
[MODE: EXTERNAL_JAPANESE]
[MODE: INTERNAL_SLACK_EN]
[MODE: INTERNAL_SLACK_JP]
[MODE: SPOKEN_ENGLISH]
[MODE: SPOKEN_JAPANESE]
```

## Quick Test

After setup, try:
```
Write a 3-sentence email declining a meeting politely.
```

If it sounds like you → ✅ Success
If it sounds like generic AI → Review and iterate

---

*Stage 4 Complete → Your Digital Twin is deployed!*

*For ongoing refinement, return to Stage 2 with new samples.*
