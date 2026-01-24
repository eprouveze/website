# Story Elements for Publication

## For Technical Audiences

### Suggested Titles
- "Two Scores, One Truth: Separating Deal Health from Analysis Quality in AI Systems"
- "The Confidence Paradox: Why Your AI Needs Two Different Reliability Metrics"
- "Beyond Single-Score Confidence: A Dual-Axis Approach to Trustworthy AI Output"

### Hook
When an AI confidently tells you a deal will close, how do you know if it is confident because the deal looks strong, or because it thoroughly analyzed the available data? These are two fundamentally different questions, and conflating them is one of the most common mistakes in AI system design.

### Story Arc
We discovered the problem the hard way. Our AI would analyze a troubled deal with incomplete data and report back with high confidence. Users trusted the assessment, only to find gaps in the analysis later. The issue was not that the AI was wrong about the deal health. The issue was that we had conflated two separate quality dimensions into a single score.

Consider this scenario: a sales deal has strong fundamentals, engaged stakeholders, and positive momentum. That is high deal confidence. But what if the AI only had access to partial data when making that assessment? What if two of three tools failed during analysis? The deal might still be healthy, but our confidence in the analysis should be low.

This insight led to a dual scoring architecture. The ConfidenceScorer measures deal health probability, aggregating signals across risk, momentum, coverage, alignment, and quality dimensions. The ReasoningQualityScorer measures analysis completeness, evaluating tool execution success, data availability, and evidence sufficiency. A deal can score HIGH on health but LOW on reasoning quality, or vice versa. Both scores matter, but they answer different questions entirely.

---

## For Non-Technical Audiences

### Suggested Titles
- "The Two Questions Your AI Should Answer Before You Trust Its Advice"
- "Why Smart Systems Need Two Confidence Scores, Not One"
- "Trust, But Verify: How AI Should Grade Its Own Homework"

### Hook
Imagine asking your doctor about a diagnosis. You would want to know two things: how confident are they in the diagnosis itself, and how thorough was their examination? A doctor who confidently diagnoses a rare condition after a two-minute phone call raises different concerns than one who reaches the same conclusion after extensive testing.

### Story Arc
Think of confidence scoring like a credit score system. A traditional credit score tells you one thing: how likely is this person to repay a loan? But what if the credit bureau only had partial records? What if they were missing three years of payment history? The score itself might look fine, but your confidence in that score should be lower.

AI systems face the same challenge. When an AI recommends a course of action, it produces two implicit claims. First, the recommendation itself: this deal is likely to close. Second, a claim about its own analysis: I did thorough work to reach this conclusion.

Most AI systems blend these into a single confidence percentage. The problem is that users cannot tell whether a 75% confidence means the deal itself is strong, or that the AI did good analysis, or some murky combination. Our system separates these concerns explicitly. One score tells you about the deal. Another score tells you about the analysis quality. When both are high, you can act with confidence. When they diverge, you know exactly which aspect needs attention, whether that is the deal itself or the data feeding the analysis.

---

# Dual Confidence Scoring System

The GAM Forecast Tool implements a dual confidence scoring architecture that serves two fundamentally different purposes. This document provides complete technical documentation of both scorers, their scoring rules, and their application within the reasoning engine.

## 1. Why Two Scorers?

The system distinguishes between two orthogonal quality dimensions that must not be conflated:

### ConfidenceScorer: Deal Health Assessment

**Purpose**: Measures the probability that a sales deal will close successfully.

**Question it answers**: "Is this deal likely to close?"

This scorer aggregates signals from multiple sales process dimensions:
- Risk indicators from sales notes
- Stakeholder engagement patterns
- Stage-probability alignment
- Deal momentum trends
- Quality metrics from scorecards

The output guides sales managers on deal prioritization and category assignment (Commit, Best Case, Pipeline, Omitted).

### ReasoningQualityScorer: Analysis Reliability Assessment

**Purpose**: Measures the quality and completeness of the reasoning engine's analysis work.

**Question it answers**: "Did we answer the user's question well?"

This scorer evaluates the reasoning process itself:
- Did tools execute successfully?
- Was relevant data found?
- Were appropriate filters applied?
- Is the evidence sufficient?

The output determines whether disclaimers should be added to responses, independent of the deal's actual health.

**Key Insight**: A deal can have LOW health confidence (risky deal) but HIGH reasoning confidence (we analyzed it thoroughly), or vice versa. The two scores measure fundamentally different things.

## 2. ConfidenceScorer: Complete Deal Health Rules

**Reference**: `src/services/confidence_scorer.py` - `ConfidenceScorer` class

### Base Score

All deal assessments start at a neutral score of **50 points**, representing insufficient information to make a determination. Signals then add or subtract from this baseline.

### Scoring Rules by Category

#### RISK Penalties

Risk signals extracted from opportunity notes and manager comments reduce confidence.

| Rule | Threshold | Points | Max Impact | Description |
|------|-----------|--------|------------|-------------|
| `explicit_risks` | 1+ | -10 per risk | -30 | Explicit risks mentioned in notes |
| `blockers` | 1+ | -15 per blocker | -30 | Deal blockers identified |
| `high_severity_risk` | HIGH severity | -15 | -15 | High severity risk classification |
| `has_explicit_red_flags` | present | -10 | -10 | Sales team recorded red flags |

#### MOMENTUM Adjustments

Activity patterns indicate deal health through engagement velocity.

| Rule | Threshold | Points | Description |
|------|-----------|--------|-------------|
| `stale_deal` | 30+ days inactive | -25 | No activity for extended period |
| `inactive_deal` | 14+ days inactive | -15 | Recent inactivity warning |
| `declining_momentum` | -10% WoW | -20 | Week-over-week value decline |
| `improving_momentum` | +5% WoW | +15 | Week-over-week growth |
| `aged_deal` | 180+ days old | -20 | Deal exceeds typical cycle length |

#### COVERAGE Adjustments

Stakeholder coverage patterns indicate deal robustness.

| Rule | Threshold | Points | Description |
|------|-----------|--------|-------------|
| `single_threaded` | <2 stakeholders | -20 | Single point of contact risk |
| `strong_coverage` | 4+ stakeholders | +10 | Well-developed relationships |
| `no_executive` | absent | -15 | Missing executive sponsor |
| `has_executive` | present | +15 | Executive sponsor engaged |
| `no_se` | absent | -10 | No Solutions Engineer attached |
| `has_se` | present | +10 | SE supporting the deal |

#### ALIGNMENT Adjustments

Consistency between opportunity attributes and expected patterns.

| Rule | Threshold | Points | Description |
|------|-----------|--------|-------------|
| `stage_mismatch` | probability != stage expectation | -15 | Stage-probability misalignment |
| `category_mismatch` | 2+ alignment issues | -10 | Multiple alignment anomalies |
| `manager_cautious` | UP- judgement | -10 | Manager has concerns |
| `manager_committed` | IN judgement | +15 | Manager commits to forecast |

#### QUALITY Adjustments

Scorecard ratings from Account Executive and Solutions Engineer assessments.

| Rule | Threshold | Points | Description |
|------|-----------|--------|-------------|
| `low_ae_scorecard` | <1.0 | -10 | Below-standard AE assessment |
| `low_se_scorecard` | <1.0 | -5 | Below-standard SE assessment |
| `high_ae_scorecard` | >=2.0 | +10 | Strong AE assessment |
| `high_se_scorecard` | >=2.0 | +10 | Strong SE assessment |

#### Other Factors

| Rule | Points | Description |
|------|--------|-------------|
| `quarter_end_close` | -15 | Close date at quarter boundary (risk of slip) |

### Score Clamping

Final scores are clamped to the 0-100 range:
```python
score = max(0, min(100, score))
```

## 3. ReasoningQualityScorer: Analysis Quality Factors

**Reference**: `src/services/confidence_scorer.py` - `ReasoningQualityScorer` class

### Base Score

Like deal confidence, reasoning quality starts at **50 points**.

### Quality Factors

#### DATA AVAILABILITY

| Factor | Points | Description |
|--------|--------|-------------|
| `data_found` | +30 | Tools found relevant data for the query |
| `no_data_found` | -30 | Tools executed but returned no matching data |
| `partial_data` | -15 | Some expected data missing |

#### FILTER APPLICATION

| Factor | Points | Description |
|--------|--------|-------------|
| `filters_applied` | +20 | Query filters successfully parsed and applied |
| `filter_not_applicable` | -10 | Expected filters could not be applied |

#### TOOL EXECUTION

| Factor | Points | Description |
|--------|--------|-------------|
| `tool_success` | +10 per tool (max 3) | Each tool that executed successfully |
| `tool_failure` | -15 per failure | Each tool that failed to execute |

#### EVIDENCE QUALITY

| Factor | Points | Description |
|--------|--------|-------------|
| `multiple_sources` | +15 | Data corroborated from 2+ sources |
| `single_source` | -5 | Analysis relies on single data source |

#### QUERY COMPLETENESS

| Factor | Points | Description |
|--------|--------|-------------|
| `query_fully_answered` | +20 | All aspects of query addressed |
| `query_partially_answered` | -10 | Some query aspects unanswered |
| `query_not_answered` | -25 | Unable to answer the query |

## 4. Tier Definitions

Both scorers use tier classifications to translate numeric scores into actionable categories.

### ConfidenceScorer Tiers (Deal Health)

| Tier | Score Range | Interpretation | Recommended Action |
|------|-------------|----------------|-------------------|
| **HIGH** | 70-100 | Strong indicators for close | Consider for Commit category |
| **MEDIUM** | 40-69 | Some concerns present | Monitor weekly, address key concerns |
| **LOW** | 20-39 | Significant concerns | Investigate and address issues |
| **CRITICAL** | 0-19 | Major red flags | Review deal viability urgently |

### ReasoningQualityScorer Tiers (Analysis Reliability)

| Tier | Score Range | Interpretation | User Experience |
|------|-------------|----------------|-----------------|
| **HIGH** | 80-100 | Complete analysis with good data | Full confidence in response |
| **MEDIUM** | 60-79 | Adequate but some gaps | Response reliable with caveats |
| **LOW** | 40-59 | Limited data available | Interpret with caution |
| **CRITICAL** | 0-39 | Insufficient data | Major disclaimer added |

Note: ReasoningQualityScorer uses slightly different thresholds (80/60/40) compared to ConfidenceScorer (70/40/20) because analysis quality has a higher bar for "high confidence".

## 5. Internal Use Only Principle

Both confidence scores are **internal quality control mechanisms** and are not displayed directly to end users.

### Rationale

1. **Avoiding Confusion**: Users may conflate deal confidence with analysis confidence
2. **Preventing Gaming**: Visible scores could encourage manipulation of inputs
3. **Focus on Actionability**: Users need recommendations, not abstract scores
4. **Context Sensitivity**: Raw numbers lack context without understanding the scoring rules

### How Confidence Affects Responses

The confidence score influences response generation through:

1. **Disclaimer Addition**: Low scores trigger automatic caveats
2. **Recommendation Specificity**: Higher confidence enables more definitive recommendations
3. **Citation Requirements**: Low confidence responses include more source citations
4. **Synthesis Quality Control**: Responses are adjusted based on confidence level

### What Users See Instead

Rather than numeric scores, users receive:
- Actionable recommendations ("Engage executive sponsor before advancing")
- Risk flags when relevant ("No activity in 30 days")
- Data completeness notes when applicable
- Specific next steps based on the analysis

## 6. Quality Control Application

**Reference**: `src/services/reasoning_orchestrator.py` - `_apply_confidence_quality_control()` method

The reasoning orchestrator applies confidence-based quality control to all synthesized responses before delivery to users.

### Quality Control Logic

```python
def _apply_confidence_quality_control(
    self,
    synthesis: str,
    confidence_score: int,
    confidence_tier: str
) -> str:
    """
    Apply internal quality control based on confidence score.

    Confidence is used INTERNALLY to decide whether to add disclaimers,
    but the actual score is never shown to users.
    """
```

### Threshold-Based Disclaimers

| Confidence Score | Tier | Disclaimer Added |
|-----------------|------|-----------------|
| < 20 | CRITICAL | "Note: This analysis is based on limited data. Some fields may be incomplete." |
| < 40 | LOW | "Some opportunity details may be incomplete." |
| >= 40 | MEDIUM/HIGH | No disclaimer added |

### Implementation Details

1. **Idempotency Check**: Disclaimers are only added if not already present (checked via substring match)
2. **Case-Insensitive Matching**: "limited data" and "incomplete" are matched regardless of case
3. **Preservation of Content**: Original synthesis is preserved; disclaimers are appended
4. **Empty Response Handling**: Null or empty synthesis returns unchanged

### Example Application

For a query about an opportunity with missing stakeholder data:

```
Original synthesis:
"The deal shows positive momentum with 15% week-over-week growth."

After quality control (confidence_score=35):
"The deal shows positive momentum with 15% week-over-week growth.

*Some opportunity details may be incomplete.*"
```

## Summary

The dual confidence scoring system provides:

1. **ConfidenceScorer** - A deal health assessment that aggregates risk, momentum, coverage, alignment, and quality signals into a 0-100 score with category recommendations for sales pipeline management.

2. **ReasoningQualityScorer** - An analysis reliability assessment that measures data availability, tool execution success, and evidence quality to determine if the reasoning engine's response is trustworthy.

Both scores operate internally to guide response generation, with the user-facing output consisting of recommendations, risk flags, and contextual disclaimers rather than raw numeric values.

---

**Code Reference**: `/Users/eprouveze/Documents/Dev/GAM-Forecast-Tool/src/services/confidence_scorer.py`

**Quality Control Reference**: `/Users/eprouveze/Documents/Dev/GAM-Forecast-Tool/src/services/reasoning_orchestrator.py`
