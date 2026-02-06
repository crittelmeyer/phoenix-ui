# Requirements: Phoenix v2 Figma Integration

**Defined:** 2026-02-03
**Core Value:** Complete Figma <-> code workflow where tokens flow from Figma and Code Connect surfaces real React components in Dev Mode

## v2 Requirements

Requirements for Figma integration milestone. Each maps to roadmap phases.

### Code Connect

- [ ] **CC-01**: All 14 Phoenix components have working Code Connect mappings with real Figma node URLs
- [ ] **CC-02**: Property mappings translate Figma variant selections to actual prop values (size, variant, etc.)
- [ ] **CC-03**: CLI publish workflow (`npx figma connect publish`) successfully uploads all mappings
- [ ] **CC-04**: figma.config.json properly configured with correct file key and include paths
- [ ] **CC-05**: Compound components (Dialog, DropdownMenu, Select, Tabs, Tooltip, Form) show complete nested patterns using figma.children()

### Token Alignment

- [ ] **TKN-01**: Token naming conventions documented — clear mapping between Figma Variables and Phoenix semantic tokens
- [ ] **TKN-02**: Figma Variables created matching Phoenix token structure (colors, spacing, typography, radius)
- [ ] **TKN-03**: Light and dark modes configured in Figma Variables mapping to Phoenix theme files
- [ ] **TKN-04**: Tokens Studio plugin configured with GitHub sync for bi-directional token workflow

### Infrastructure

- [ ] **INF-01**: Community Figma kit duplicated and configured as starting point
- [ ] **INF-02**: Figma access token created with Code Connect Write scope
- [ ] **INF-03**: @tokens-studio/sd-transforms integrated into Style Dictionary build
- [ ] **INF-04**: OKLCH-to-RGB color conversion added for Figma compatibility

### Documentation

- [ ] **DOC-01**: Token sync workflow documented (designer export -> code import -> build -> verify)
- [ ] **DOC-02**: Code Connect publish workflow documented
- [ ] **DOC-03**: Figma library setup guide for future maintainers

## Future Requirements

Deferred beyond v2. Tracked but not in current roadmap.

### Automation

- **AUTO-01**: GitHub Actions for automated token sync on Figma changes
- **AUTO-02**: CI validation that Code Connect node-IDs are still valid
- **AUTO-03**: Automated Storybook deployment with Figma links

### Enhanced Features

- **ENH-01**: Storybook links embedded in Code Connect snippets
- **ENH-02**: Icon instance mapping (figma.instance() for icon library)
- **ENH-03**: Multi-brand theme support in Figma Variables

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature                                     | Reason                                                                    |
| ------------------------------------------- | ------------------------------------------------------------------------- |
| Variables REST API integration              | Requires Enterprise plan ($75/editor/month) — using Tokens Studio instead |
| Generate Figma components from code         | Using community kit, not building Figma library from scratch              |
| Custom Figma plugin development             | Maintenance burden, existing plugins (Tokens Studio) cover needs          |
| Supernova/Zeroheight integration            | Storybook already provides documentation                                  |
| Replace Style Dictionary with Tokens Studio | Phoenix pipeline works; Tokens Studio adds layer, not replaces            |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status  |
| ----------- | ----- | ------- |
| CC-01       | 10    | Pending |
| CC-02       | 10    | Pending |
| CC-03       | 10    | Pending |
| CC-04       | 9     | Pending |
| CC-05       | 10    | Pending |
| TKN-01      | 7     | Pending |
| TKN-02      | 8     | Pending |
| TKN-03      | 8     | Pending |
| TKN-04      | 8     | Pending |
| INF-01      | 8     | Pending |
| INF-02      | 9     | Pending |
| INF-03      | 7     | Pending |
| INF-04      | 7     | Pending |
| DOC-01      | 11    | Pending |
| DOC-02      | 11    | Pending |
| DOC-03      | 11    | Pending |

**Coverage:**

- v2 requirements: 16 total
- Mapped to phases: 16
- Unmapped: 0

---

_Requirements defined: 2026-02-03_
_Last updated: 2026-02-06 after roadmap creation_
