# Project Research Summary

**Project:** Phoenix Design System - Figma Integration (v2 Milestone)
**Domain:** Figma-to-Code Design System Integration
**Researched:** 2026-02-06
**Confidence:** HIGH

## Executive Summary

Phoenix Design System v2 adds bidirectional Figma integration to an existing, production-ready component library. The project scope is well-defined: connect 14 existing React components to Figma Dev Mode via Code Connect, and align the existing DTCG token pipeline with Figma Variables through Tokens Studio. The recommended approach leverages Phoenix's existing infrastructure rather than rebuilding — the `.figma.tsx` scaffolding, `figma.config.json`, and Style Dictionary 5 pipeline are already in place and need configuration updates, not architectural changes.

The critical path involves three additions: `@tokens-studio/sd-transforms` for processing Tokens Studio exports in Style Dictionary, `@figma/code-connect` CLI for publishing component mappings, and adopting the Pietro Schirano shadcn/ui Figma kit as the design foundation. The Professional plan constraint (no Variables REST API) means token synchronization must flow through the Tokens Studio plugin rather than direct API integration. This is actually advantageous — it provides a visual interface for designers and handles batching/rate limits internally.

Key risks center on the token pipeline boundary: Phoenix uses OKLCH colors which Figma cannot accept directly, requiring conversion transforms. The existing `documentUrlSubstitutions` in `figma.config.json` has incorrect nesting (at root instead of inside `codeConnect`). Code Connect node-IDs will need validation since placeholder URLs must be replaced with real Figma component references. All of these are configuration-level fixes, not architectural changes.

## Key Findings

### Recommended Stack

Phoenix needs minimal additions — the foundation is already built. Two npm packages and one Figma plugin complete the integration.

**Core technologies:**

- **@tokens-studio/sd-transforms ^2.0.3**: Process Tokens Studio exports in Style Dictionary — required bridge for typography composites, color modifiers, and math expressions
- **@figma/code-connect ^1.3.13**: Publish component mappings to Figma Dev Mode — existing `.figma.tsx` files already follow correct pattern
- **Tokens Studio Pro ($15/mo/editor)**: Manage design tokens in Figma with GitHub sync — required for multi-file folder sync matching Phoenix's token structure

**Figma starting point:**

- **shadcn/ui Design System kit by Pietro Schirano**: Free community file with Figma Variables, all Radix components, light/dark modes

**Version compatibility (critical):**

- sd-transforms 2.x requires Style Dictionary 5.x (Phoenix uses 5.2.0 — compatible)
- sd-transforms 1.x is NOT compatible with SD5 (common mistake)

### Expected Features

**Must have (table stakes):**

- Real code snippets in Dev Mode for all 14 components
- Property mapping from Figma variants to React props
- CLI publish workflow (`npx figma connect publish`)
- Token names aligned between Figma and code

**Should have (competitive):**

- Compound component snippets (Dialog shows full pattern with nested parts)
- Light/dark mode variable modes in Figma
- Storybook links in Code Connect examples

**Defer (v2+):**

- Bi-directional automated token sync (requires Tokens Studio Pro or Enterprise)
- Icon instance mapping
- CI/CD automated Code Connect publishing

### Architecture Approach

The integration adds a Figma boundary layer to Phoenix's existing three-tier architecture (tokens -> ui -> apps). Token flow becomes: DTCG JSON (source of truth) -> Style Dictionary + sd-transforms (build) -> CSS Variables + Figma Variables (outputs). Code Connect is orthogonal metadata — `.figma.tsx` files aren't imported at runtime, they're published separately to Figma's servers.

**Major components:**

1. **Token Pipeline Extension** — Add sd-transforms preprocessor to existing `build.mjs`, output RGB alongside OKLCH for Figma
2. **Code Connect Publishing** — Update 14 `.figma.tsx` files with real node-IDs, fix `figma.config.json` structure, add publish scripts
3. **Figma Library Setup** — Configure community kit with Phoenix semantic tokens, set up Tokens Studio GitHub sync
4. **Workflow Documentation** — Document manual token sync process, Code Connect maintenance procedures

### Critical Pitfalls

1. **OKLCH-to-RGB Conversion Required** — Figma Variables API only accepts RGB/Hex. Phoenix's 77 OKLCH color tokens must be converted at the Figma export boundary using `culori` or `colorjs.io`. Prevention: Add conversion transform to Style Dictionary build.

2. **sd-transforms Version Lock** — Using wrong version causes silent failures (tokens build but output is wrong). sd-transforms 2.x requires SD 5.x exactly. Prevention: Verify `npm ls style-dictionary @tokens-studio/sd-transforms` shows compatible pairing.

3. **Code Connect Node-ID Staleness** — When Figma components move/delete, Code Connect publishes succeed but Dev Mode shows errors. Prevention: Add validation step before publish, maintain node-ID manifest.

4. **figma.config.json Structure Error** — Current config has `documentUrlSubstitutions` at root level; it must be inside `codeConnect` object. Prevention: Fix nesting before first publish attempt.

5. **Tokens Studio Export Format Mismatch** — Tokens Studio can export legacy or DTCG format. Phoenix uses DTCG. Prevention: Verify "Token Format" is set to "W3C DTCG" in Tokens Studio settings.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Token Pipeline Integration

**Rationale:** Foundation for everything else. Figma Variables require token-level compatibility before Code Connect can show meaningful values. This phase has the highest technical risk (OKLCH conversion, sd-transforms integration).

**Delivers:** Style Dictionary build that outputs both OKLCH CSS (existing) and RGB-compatible Figma export (new). Validated token format compatibility.

**Addresses:** Token alignment (table stakes), mode support (differentiator)

**Avoids:** OKLCH conversion pitfall, sd-transforms version pitfall, format mismatch pitfall

**Key tasks:**

- Install @tokens-studio/sd-transforms
- Update `build.mjs` with preprocessors and transforms
- Add OKLCH-to-RGB conversion transform
- Verify output works with Tokens Studio import

### Phase 2: Figma Library Setup

**Rationale:** Designers need a working Figma file before Code Connect mappings can reference real node-IDs. This phase establishes the design-side foundation.

**Delivers:** Figma library file based on community kit, customized with Phoenix semantic tokens via Tokens Studio, published as team library.

**Addresses:** Token naming alignment, semantic token documentation

**Avoids:** Drafts folder limitation, collection/mode limits, naming convention conflicts

**Key tasks:**

- Duplicate Pietro Schirano shadcn/ui kit
- Install Tokens Studio plugin (Pro license)
- Configure GitHub sync to packages/tokens/src/tokens
- Import Phoenix tokens, apply to components
- Publish as team library

### Phase 3: Code Connect Setup

**Rationale:** With Figma library published, real node-IDs are available. Code Connect can be configured and validated before bulk mapping.

**Delivers:** Working Code Connect infrastructure, validated authentication, corrected configuration.

**Addresses:** CLI publish workflow, figma.config.json setup

**Avoids:** Authentication scope pitfall, config structure error, network blocking

**Key tasks:**

- Create Figma Personal Access Token with correct scopes
- Fix figma.config.json nesting
- Test single component publish (Button)
- Add npm scripts for publishing

### Phase 4: Component Mapping

**Rationale:** Bulk work phase. All 14 components need real node-IDs and validated property mappings. Best done systematically after infrastructure is proven.

**Delivers:** All 14 Phoenix components visible in Figma Dev Mode with accurate code snippets.

**Addresses:** Real code snippets, property mapping, all components connected

**Avoids:** Variant prop naming mismatch, node-ID staleness

**Key tasks:**

- Update each `.figma.tsx` with real Figma URLs
- Map variant names from Figma to code props
- Test each component in Dev Mode
- Document compound component patterns

### Phase 5: Workflow Documentation

**Rationale:** Sustainability phase. Document processes for ongoing maintenance so the integration doesn't rot.

**Delivers:** Team documentation for token sync, Code Connect updates, troubleshooting.

**Addresses:** Token update workflow, publish workflow

**Key tasks:**

- Document token sync procedure (designer-initiated)
- Document Code Connect maintenance (developer-initiated)
- Add validation scripts for node-ID freshness
- Create troubleshooting guide

### Phase Ordering Rationale

- **Token pipeline first** because Figma Variables depend on compatible token format. Attempting Code Connect before tokens are aligned results in components that show code but reference wrong values.
- **Figma library before Code Connect** because node-IDs don't exist until components are in a published library file.
- **Single component validation before bulk mapping** because discovering config errors on component #12 of 14 wastes effort.
- **Documentation last** because processes need to be established before they can be documented.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 1 (Token Pipeline):** OKLCH conversion is well-documented in color science libraries but integration with sd-transforms needs testing. May need custom transform.
- **Phase 4 (Component Mapping):** Compound components (Dialog, DropdownMenu, Tabs) need `figma.children()` patterns that aren't fully documented. May need experimentation.

Phases with standard patterns (skip deep research):

- **Phase 2 (Figma Library):** Tokens Studio GitHub sync is extensively documented.
- **Phase 3 (Code Connect Setup):** Authentication and config are well-documented in Figma docs.
- **Phase 5 (Documentation):** Standard technical writing.

## Confidence Assessment

| Area         | Confidence | Notes                                                                                                 |
| ------------ | ---------- | ----------------------------------------------------------------------------------------------------- |
| Stack        | HIGH       | All versions verified via npm registry and GitHub releases (sd-transforms 2.0.3, code-connect 1.3.13) |
| Features     | HIGH       | Based on official Figma Code Connect docs and React API reference                                     |
| Architecture | HIGH       | Phoenix already has working DTCG pipeline; additions are additive not replacement                     |
| Pitfalls     | HIGH       | Most pitfalls verified via GitHub issues with reproduction steps                                      |

**Overall confidence:** HIGH

The integration is well-scoped. Phoenix has more infrastructure already built than most Figma integration projects start with. The main work is configuration and mapping, not architecture.

### Gaps to Address

- **OKLCH conversion accuracy:** Need to verify P3 gamut colors convert correctly. Figma has known bugs with P3 profile interpretation.
- **Compound component Code Connect patterns:** `figma.children()` for nested instances isn't heavily documented. May need trial and error.
- **Tokens Studio Pro license:** Required for multi-file sync. User should confirm this is acceptable before Phase 2.
- **Figma file key availability:** Community kit needs to be duplicated to user's Figma account before node-IDs are obtainable.

## Sources

### Primary (HIGH confidence)

- [Figma Code Connect Quickstart](https://developers.figma.com/docs/code-connect/quickstart-guide/) — CLI usage, authentication, config
- [Figma Code Connect React API](https://developers.figma.com/docs/code-connect/react/) — figma.connect(), figma.enum(), prop mapping
- [sd-transforms GitHub](https://github.com/tokens-studio/sd-transforms) — Version compatibility, transform registration
- [Tokens Studio Documentation](https://docs.tokens.studio) — GitHub sync, W3C DTCG format, export options
- [Style Dictionary v5 Migration](https://styledictionary.com/versions/v4/migration/) — Async patterns, ESM requirements

### Secondary (MEDIUM confidence)

- [shadcn/ui Figma kit](https://www.figma.com/community/file/1314057472629730742) — Community file structure, variable organization
- [Figma Forum: OKLCH support request](https://forum.figma.com/suggest-a-feature-11/support-oklab-and-oklch-8257) — Confirmed OKLCH not supported in Variables API
- [Code Connect GitHub Issues #337, #291](https://github.com/figma/code-connect/issues) — Node-ID validation gaps

### Tertiary (LOW confidence)

- P3 color conversion accuracy in Figma — needs validation during implementation
- Compound component Code Connect patterns — sparse documentation, needs experimentation

---

_Research completed: 2026-02-06_
_Ready for roadmap: yes_
