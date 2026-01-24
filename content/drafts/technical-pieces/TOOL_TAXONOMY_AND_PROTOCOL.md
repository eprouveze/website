# Story Elements for Publication

## For Technical Audiences

### Suggested Titles
- "The Guardrails Principle: Designing Safe Tool Access for LLM-Augmented Systems"
- "From Raw SQL to Validated Protocols: Building a Secure LLM Tool Architecture"
- "Tool Taxonomy by Trust: How We Stopped Our AI from Running Arbitrary Queries"

### Hook
What happens when you give an LLM direct database access? In our early prototypes, it happened: a reasoning model generated a DELETE statement while trying to "clean up" test data. That incident became the catalyst for SimplifiedDataProtocol - a validation layer that transformed how our system handles AI-initiated data requests.

### Story Arc
The journey began with a deceptively simple goal: let an AI assistant query sales data to help forecast analysts. Our first implementation passed natural language queries to an LLM that generated SQL. It worked beautifully in demos - until production. The model occasionally hallucinated table names, joined on non-existent columns, and once attempted a schema modification "to improve performance."

We realized the problem wasn't the LLM's reasoning ability - it was our architecture. Giving a probabilistic system direct access to deterministic infrastructure violated a fundamental principle: tools should inform, not decide.

The solution emerged as a two-category tool taxonomy. General-purpose tools (metrics, comparisons) route through SimplifiedDataProtocol, which validates every parameter against Pydantic schemas before mapping to predefined API endpoints. Deal-specific tools operate on pre-fetched data with explicit field requirements. No tool generates SQL. No tool has write access. The LLM proposes; the protocol disposes.

The result: 100% elimination of malformed queries, zero unauthorized data access attempts, and an architecture where adding new tools requires explicit schema definitions rather than hoping the model "figures it out."

---

## For Non-Technical Audiences

### Suggested Titles
- "Giving Your AI the Right Keys: How We Built Safe Data Access for Our Forecast Assistant"
- "The New Employee Problem: Training AI to Ask Permission, Not Forgiveness"
- "Trust but Verify: Building Guardrails for AI-Powered Business Tools"

### Hook
Imagine hiring a brilliant analyst who can process information faster than anyone on your team - but who occasionally tries to reorganize your filing system without asking. That's essentially what early AI assistants were like. We built a system that keeps the brilliance while adding the judgment.

### Story Arc
When we first connected our AI assistant to our sales database, it was like giving a new employee the master key to the building on day one. Sure, they needed access to do their job - but did they need access to everything, all at once, with no supervision?

The answer, we learned quickly, was no.

Our solution borrowed from how good organizations actually onboard employees. New hires don't get root access to production systems. They get specific tools for specific tasks: a CRM login here, a reporting dashboard there. Each tool does one thing well, with built-in guardrails that prevent accidental damage.

We applied the same principle to our AI. Instead of giving it a direct line to the database (like handing over the master key), we gave it a toolkit of pre-approved actions. Want to see pipeline numbers? There's a validated tool for that. Need to compare regional performance? Another tool, with input checking built in. The AI requests data through these tools, and each request passes through a validation checkpoint before any data moves.

The AI is still brilliant at synthesis and analysis - that's where it shines. But now it works within a structure that matches how businesses actually manage access and trust. The result is an assistant that's both capable and safe.

---

# Tool Taxonomy and Protocol Reference

Technical reference for the GAM Reasoning Engine tool system, covering the two-category architecture, SimplifiedDataProtocol, query intent classification, and tool dispatch patterns.

## Architecture Overview

The Reasoning Engine implements a tool-augmented reasoning system inspired by the Atlas architecture. The core principle is that **tools enrich LLM context for ANY query type** - they provide evidence, not decisions. The LLM synthesizes the final user-facing response from tool-gathered evidence.

The reasoning flow follows this pattern:
1. **CLASSIFY** - Determine query intent
2. **SELECT** - Choose appropriate tools based on intent
3. **EXECUTE** - Run selected tools to gather evidence
4. **ENRICH** - Format evidence for LLM context
5. **SYNTHESIZE** - LLM synthesizes natural response
6. **VALIDATE** - Measure reasoning quality

---

## Two-Category Tool Architecture

Tools are organized into two distinct categories based on their data requirements and execution patterns. This taxonomy is defined in the `REASONING_TOOLS` registry (`src/services/reasoning_orchestrator.py`, lines 179-259).

### General-Purpose Tools

General-purpose tools work with aggregate data and do not require specific opportunity data. They use the `SimplifiedDataProtocol` to access existing API endpoints.

| Tool Name | Description | Async |
|-----------|-------------|-------|
| `query_metrics` | Get aggregate metrics (pipeline, forecast, closed, quota) | Yes |
| `query_opportunities` | Find/list opportunities with filters | Yes |
| `compare_periods` | Compare metrics between periods (Q1 vs Q2) | Yes |
| `compare_regions` | Compare metrics between regions (EMEA vs AMER) | Yes |
| `calculate_variance` | Calculate and explain variance between values | No |

These tools have `category: "general"` and their `function` field is `None` because they are implemented via the `SimplifiedDataProtocol` rather than direct function calls.

### Deal-Specific Tools

Deal-specific tools analyze individual opportunity data. They require pre-fetched opportunity fields and are implemented as direct Python functions in `src/services/tools/`.

| Tool Name | Description | Required Fields | Source File |
|-----------|-------------|-----------------|-------------|
| `extract_risk_signals` | Extract risk signals from opportunity notes | `manager_notes`, `next_steps`, `red_flags` | `risk_extraction_tools.py` |
| `analyze_deal_momentum` | Analyze deal momentum from WoW changes | `week_over_week_change_percent`, `age`, `last_activity_date` | `risk_extraction_tools.py` |
| `analyze_stakeholder_coverage` | Analyze multi-threading and stakeholder coverage | `opportunity_owner`, `deal_sponsor`, `sfdc_executive_sponsor`, `se_attached` | `stakeholder_tools.py` |
| `detect_executive_presence` | Detect executive presence from contact title | `contact_title` | `stakeholder_tools.py` |
| `check_stage_alignment` | Check stage-probability alignment | `stage`, `probability`, `forecast_category`, `manager_judgement` | `alignment_tools.py` |
| `analyze_forecast_credibility` | Analyze overall forecast credibility | `stage`, `probability`, `ae_scorecard`, `se_scorecard` | `alignment_tools.py` |

These tools have `category: "deal_specific"` and include a `requires_fields` array documenting their data dependencies.

---

## Tool Registry Structure

Each tool entry in `REASONING_TOOLS` follows this structure:

```python
REASONING_TOOLS = {
    "tool_name": {
        "function": callable_or_none,  # Python function for deal-specific, None for general
        "description": "Human-readable tool description",
        "category": "general" | "deal_specific",
        "is_async": bool,  # True for async tools, False for sync
        "requires_fields": [...]  # Only for deal_specific tools
    }
}
```

**Example - General-Purpose Tool:**
```python
"query_metrics": {
    "function": None,  # Implemented via SimplifiedDataProtocol
    "description": "Get aggregate metrics (pipeline, forecast, closed, quota)",
    "category": "general",
    "is_async": True
}
```

**Example - Deal-Specific Tool:**
```python
"extract_risk_signals": {
    "function": extract_risk_signals,  # Direct function reference
    "description": "Extract risk signals from opportunity notes",
    "requires_fields": ["manager_notes", "next_steps", "red_flags"],
    "category": "deal_specific",
    "is_async": False
}
```

---

## SimplifiedDataProtocol Design

The `SimplifiedDataProtocol` (`src/services/simplified_data_protocol.py`) provides a secure, validated interface for LLM-initiated data access. It exists for three primary reasons:

1. **LLM Security** - Prevents arbitrary query execution by constraining data access to predefined patterns
2. **Parameter Validation** - Uses Pydantic models to validate all inputs before API calls
3. **API Abstraction** - Maps simplified requests to existing FastAPI endpoints

### Core Data Models

**QueryType Enum:**
```python
class QueryType(str, Enum):
    METRICS = "METRICS"
    OPPORTUNITIES = "OPPORTUNITIES"
```

**MetricsFilter Schema:**
```python
class MetricsFilter(BaseModel):
    fiscal_year: Optional[int] = Field(None, ge=2020, le=2030)
    view: str = Field("quarters", pattern="^(quarters|regions)$")
    metric_names: Optional[List[str]] = None  # Supports dot notation
    region: Optional[str] = None
```

**OpportunitiesFilter Schema:**
```python
class OpportunitiesFilter(BaseModel):
    fiscal_year: Optional[int] = Field(None, ge=2020, le=2030)
    fiscal_quarter: Optional[str] = Field(None, pattern="^Q[1-4]$")
    region: Optional[str] = None
    stage: Optional[str] = None
    stage_min: Optional[int] = Field(None, ge=1, le=10)
    min_amount: Optional[float] = Field(None, ge=0)
    max_amount: Optional[float] = None
    search_query: Optional[str] = None
    limit: Optional[int] = Field(20, ge=1, le=100)
```

**DataRequest Schema:**
```python
class DataRequest(BaseModel):
    query_type: QueryType
    purpose: str = Field(..., min_length=10)  # Why data is needed
    metrics_filter: Optional[MetricsFilter] = None
    opportunities_filter: Optional[OpportunitiesFilter] = None
```

**DataRequestBatch Schema:**
```python
class DataRequestBatch(BaseModel):
    request_id: str
    user_question: str
    requests: List[DataRequest] = Field(..., min_items=1, max_items=5)
    confidence: float = Field(..., ge=0.0, le=1.0)
```

### API Endpoint Mapping

The protocol routes requests to existing endpoints:

| Query Type | Filter Conditions | Target Endpoint |
|------------|-------------------|-----------------|
| METRICS | Any | `/api/v2/metrics/calculate-all` |
| OPPORTUNITIES | With `search_query` | `/api/search/opportunities` |
| OPPORTUNITIES | Without `search_query` | `/api/v2/forecast/data/{fiscal_year}` |

---

## Query Intent Classification System

The `_classify_query_intent()` method (lines 910-1000) uses rule-based pattern matching to determine which tools to use. Intent classification occurs before tool selection.

### QueryIntent Enum

```python
class QueryIntent(Enum):
    AGGREGATION = "aggregation"    # "What's total pipeline?" -> query_metrics
    LISTING = "listing"            # "Show top deals" -> query_opportunities
    COMPARISON = "comparison"      # "Q1 vs Q2" -> query_metrics + compare
    DEAL_ANALYSIS = "deal_analysis" # "Analyze risks" -> deal-health tools
    SEARCH = "search"              # "Find deals with X" -> query_opportunities
    EXPLANATION = "explanation"    # "Why did pipeline change?" -> query_metrics + variance
    GENERAL = "general"            # Fallback for unclear intent
```

### Pattern Matching Logic

**Order matters.** The classifier checks patterns in this priority:

1. **EXPLANATION** (checked first - "why", "explain", "what changed")
2. **DEAL_ANALYSIS** ("risk", "stakeholder", "coverage", "health")
3. **COMPARISON** ("compare", "vs", "difference", "Q1 vs Q2")
4. **LISTING** ("show", "list", "top", "deals")
5. **AGGREGATION** ("total", "sum", "how much", "pipeline")
6. **SEARCH** ("find", "where", "which deals")
7. **GENERAL** (fallback)

**Pattern Examples:**
```python
# EXPLANATION patterns - check FIRST
explanation_patterns = [
    r'\bwhy\b', r'\bexplain\b', r'\breason\b', r'\bcause\b',
    r'what\s+happened', r'what\s+changed'
]

# DEAL_ANALYSIS patterns
deal_analysis_patterns = [
    r'\brisk', r'\bconcern\b', r'\bstakeholder',
    r'analyze\s+(?:this\s+)?deal', r'executive\s+sponsor'
]

# COMPARISON patterns - distinguish regional vs period
comparison_patterns = [
    r'compare', r'\bvs\.?\b', r'\bdifference\b',
    r'q[1-4]\s*(?:vs|versus)\s*q[1-4]',
    r'(?:emea|amer|apac)\s*(?:vs|versus)\s*(?:emea|amer|apac)'
]
```

---

## Tool Dispatch Pattern

Tool execution is routed by category in `_execute_general_tool()` (lines 2055-2115) and direct function calls for deal-specific tools.

### General Tool Dispatch (lines 569-574)

```python
tool_config = self.REASONING_TOOLS[tool_name]
category = tool_config.get("category", "deal_specific")

if category == "general":
    result = await self._execute_general_tool(
        tool_name=tool_name,
        query=query,
        selection_criteria=selection_criteria
    )
```

The `_execute_general_tool` method:
1. Initializes `SimplifiedDataProtocol`
2. Builds appropriate filters from `selection_criteria`
3. Creates a `DataRequest` with the correct `QueryType`
4. Wraps in `DataRequestBatch` and processes via protocol
5. Returns the API response data

### Deal-Specific Tool Dispatch (lines 575-581)

```python
else:
    if not opportunity_data:
        result = {"error": "No opportunity data for deal-specific tool"}
    else:
        tool_func = tool_config["function"]
        params = self._build_tool_params(tool_name, opportunity_data)
        result = tool_func(**params)
```

### Parameter Building with `_build_tool_params()` (lines 1121-1180)

Maps opportunity data fields to tool function parameters:

```python
field_mappings = {
    "extract_risk_signals": {
        "manager_notes": "manager_notes",
        "next_steps": "next_steps",
        "red_flags": "red_flags"
    },
    "analyze_stakeholder_coverage": {
        "opportunity_owner": "opportunity_owner",
        "deal_sponsor": "deal_sponsor",
        "sfdc_executive_sponsor": "sfdc_executive_sponsor",
        "se_attached": "se_attached"
    },
    # ... additional mappings
}

if tool_name in field_mappings:
    for param_name, field_name in field_mappings[tool_name].items():
        if field_name in opportunity_data:
            params[param_name] = opportunity_data[field_name]
```

---

## Evidence Enrichment Pattern

The core principle: **"Tools don't decide, they inform."** Tools gather evidence that enriches the LLM context for synthesis.

### Evidence Formatting (`_format_evidence_for_llm`, lines 1309-1360)

Tool observations are formatted into a structured context string:

```python
def _format_evidence_for_llm(
    self,
    observations: Dict[str, Any],      # Tool results keyed by tool name
    opportunity_data: Dict[str, Any],  # Source opportunity data
    confidence_result: Dict[str, Any], # Internal quality score
    selection_criteria: Dict[str, Any] # How data was selected
) -> str:
```

The formatted evidence includes:
1. **Selection Criteria** - How the opportunity was found/filtered
2. **Opportunity Context** - Key deal attributes (name, amount, stage)
3. **Tool Observations** - Results from each executed tool
4. **Confidence Context** - Internal quality indicators

**Example Output Structure:**
```
## How This Opportunity Was Selected
I searched for opportunities matching:
- Region: EMEA
- Fiscal Quarter: Q4
- Stage: 4+

## Opportunity Data
- Enterprise Deal Alpha: $2,500,000 (Stage 5) IN

## Tool Results
### extract_risk_signals
- risks_found: ["Budget freeze pending approval"]
- risk_severity: MEDIUM

### analyze_stakeholder_coverage
- stakeholder_count: 4
- has_executive: True
- multi_threading_level: STRONG
```

### How Observations Become Context

The flow from tool execution to LLM synthesis:

1. Tools execute and return structured dictionaries
2. `_format_evidence_for_llm()` converts to readable context
3. Context is passed to LLM via `_call_llm_with_evidence()`
4. LLM generates natural language response grounded in evidence
5. `_llm_ground()` validates response against source data

This pattern ensures the LLM has access to all relevant data while preventing hallucination through grounding validation.

---

## References

| Component | Location |
|-----------|----------|
| Tool Registry | `src/services/reasoning_orchestrator.py` lines 179-259 |
| Query Intent Classification | `src/services/reasoning_orchestrator.py` lines 910-1000 |
| Tool Dispatch | `src/services/reasoning_orchestrator.py` lines 569-598 |
| Parameter Building | `src/services/reasoning_orchestrator.py` lines 1121-1180 |
| Evidence Formatting | `src/services/reasoning_orchestrator.py` lines 1309-1360 |
| SimplifiedDataProtocol | `src/services/simplified_data_protocol.py` |
| Risk Extraction Tools | `src/services/tools/risk_extraction_tools.py` |
| Stakeholder Tools | `src/services/tools/stakeholder_tools.py` |
| Alignment Tools | `src/services/tools/alignment_tools.py` |
| LLM Prompts | `src/services/llm_prompts.py` |
