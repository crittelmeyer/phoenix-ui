# Roadmap: Phoenix v2 Figma Integration

## Overview

This roadmap establishes bidirectional Figma integration for the Phoenix Design System. Starting from the existing token pipeline and component library, we add @tokens-studio/sd-transforms for processing Figma token exports, configure a Figma library from a community kit, publish 14 component mappings via Code Connect, and document sustainable workflows. Phases 7-11 continue from v1 (phases 1-6).

## Milestones

- [x] **v1 MVP** - Phases 1-6 (shipped 2026-02-02)
- [ ] **v2 Figma Integration** - Phases 7-11 (in progress)

## Phases

- [x] **Phase 7: Token Pipeline Integration** - Add sd-transforms and OKLCH-to-RGB conversion
- [ ] **Phase 8: Figma Library Setup** - Configure community kit with Tokens Studio and Variables
- [ ] **Phase 9: Code Connect Setup** - Validate authentication and config with single component test
- [ ] **Phase 10: Component Mapping** - Update all 14 .figma.tsx files with real node-IDs
- [ ] **Phase 11: Workflow Documentation** - Document token sync and Code Connect processes

## Phase Details

### Phase 7: Token Pipeline Integration

**Goal**: Style Dictionary build outputs Figma-compatible tokens alongside existing OKLCH CSS
**Depends on**: Nothing (first v2 phase, builds on v1 infrastructure)
**Requirements**: INF-03, INF-04, TKN-01
**Plans:** 2 plans

Plans:

- [x] 07-01-PLAN.md - Install sd-transforms and create custom formats
- [x] 07-02-PLAN.md - Extend build script and generate Figma outputs

### Phase 8: Figma Library Setup

**Goal**: Figma library file exists with Phoenix tokens applied via Tokens Studio
**Depends on**: Phase 7 (token naming conventions must be documented first)
**Requirements**: INF-01, TKN-02, TKN-03, TKN-04
**Success Criteria** (what must be TRUE):

1. Community kit is duplicated to team account and customized with Phoenix branding
2. Figma Variables exist matching Phoenix token structure (colors, spacing, typography, radius)
3. Light and dark mode variables are configured and switchable in Figma
4. Tokens Studio plugin is connected to GitHub repo (packages/tokens/src/tokens)
5. Changes exported from Tokens Studio import successfully into Style Dictionary build
   **Plans**: TBD

Plans:

- [ ] 08-01: TBD
- [ ] 08-02: TBD

### Phase 9: Code Connect Setup

**Goal**: Code Connect infrastructure validated with one component publishing successfully
**Depends on**: Phase 8 (need real Figma file with node-IDs)
**Requirements**: INF-02, CC-04
**Success Criteria** (what must be TRUE):

1. Figma Personal Access Token exists with Code Connect Write scope
2. figma.config.json has correct structure (documentUrlSubstitutions inside codeConnect)
3. Button component publishes via `npx figma connect publish` and appears in Dev Mode
4. npm scripts exist for publishing workflow (`pnpm figma:publish` or similar)
   **Plans**: TBD

Plans:

- [ ] 09-01: TBD

### Phase 10: Component Mapping

**Goal**: All 14 Phoenix components visible in Figma Dev Mode with accurate code snippets
**Depends on**: Phase 9 (infrastructure must be validated first)
**Requirements**: CC-01, CC-02, CC-03, CC-05
**Success Criteria** (what must be TRUE):

1. All 14 .figma.tsx files have real Figma node URLs (no placeholder URLs remain)
2. Variant selections in Figma translate to correct prop values in code snippets
3. CLI publish workflow (`npx figma connect publish`) completes without errors
4. Compound components (Dialog, DropdownMenu, Select, Tabs, Tooltip, Form) show nested patterns with figma.children()
5. Inspecting any Phoenix component in Figma Dev Mode shows correct React import and usage
   **Plans**: TBD

Plans:

- [ ] 10-01: TBD
- [ ] 10-02: TBD
- [ ] 10-03: TBD

### Phase 11: Workflow Documentation

**Goal**: Sustainable processes documented for ongoing token sync and Code Connect maintenance
**Depends on**: Phase 10 (document processes after they work)
**Requirements**: DOC-01, DOC-02, DOC-03
**Success Criteria** (what must be TRUE):

1. Token sync workflow is documented: designer export -> code import -> build -> verify
2. Code Connect publish workflow is documented with troubleshooting steps
3. Figma library setup guide exists for onboarding future maintainers
4. A new team member can follow docs to make a token change or update a component mapping
   **Plans**: TBD

Plans:

- [ ] 11-01: TBD

## Progress

| Phase                         | Plans Complete | Status      | Completed  |
| ----------------------------- | -------------- | ----------- | ---------- |
| 7. Token Pipeline Integration | 2/2            | Complete    | 2026-02-06 |
| 8. Figma Library Setup        | 0/?            | Not started | -          |
| 9. Code Connect Setup         | 0/?            | Not started | -          |
| 10. Component Mapping         | 0/?            | Not started | -          |
| 11. Workflow Documentation    | 0/?            | Not started | -          |

---

_Roadmap created: 2026-02-06_
_Coverage: 16/16 v2 requirements mapped_
