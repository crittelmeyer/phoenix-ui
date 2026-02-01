# Requirements: Phoenix

**Defined:** 2026-02-01
**Core Value:** AI agents can add, modify, and extend components without human hand-holding

## v1 Requirements

### Foundation

- [x] **FNDN-01**: Developer can clone repo and run `pnpm install && pnpm dev` with zero additional setup
- [x] **FNDN-02**: pnpm workspaces with Turborepo orchestrating builds across apps/web, apps/storybook, packages/ui, packages/tokens
- [x] **FNDN-03**: TypeScript strict mode with shared tsconfig base across all packages
- [x] **FNDN-04**: Vite + React Router app in apps/web consuming @phoenix/ui components
- [x] **FNDN-05**: ESLint + Prettier enforcing consistent code style across all packages
- [x] **FNDN-06**: Prettier Tailwind plugin sorting class names deterministically
- [x] **FNDN-07**: ESLint rule banning arbitrary Tailwind values (mt-[13px]) in packages/ui
- [x] **FNDN-08**: ESLint rule banning inline styles in packages/ui
- [x] **FNDN-09**: Pre-commit hooks running lint, typecheck, and format:check — all must pass
- [x] **FNDN-10**: Turborepo build pipeline with correct dependency ordering (tokens → ui → apps)

### Tokens

- [x] **TOKN-01**: Seed token set covering colors (neutral, primary, destructive), spacing scale, typography scale, and border radii
- [x] **TOKN-02**: Light and dark color schemes defined as separate token sets
- [x] **TOKN-03**: Style Dictionary pipeline transforming JSON tokens → CSS custom properties
- [x] **TOKN-04**: Tailwind v4 @theme directive mapping token CSS variables to utility classes (e.g., bg-primary resolves to token value)
- [x] **TOKN-05**: Tailwind config in apps/web consuming token CSS variables via @theme
- [x] **TOKN-06**: Dark mode toggle working via CSS class strategy (class="dark")
- [x] **TOKN-07**: Documented migration path from seed tokens to Tokens Studio / Figma Variables sync

### Components

- [x] **COMP-01**: cn() utility combining clsx + tailwind-merge for class composition
- [x] **COMP-02**: Button component with variant (default, outline, ghost) and size (sm, md, lg) via CVA
- [x] **COMP-03**: Input component with Radix-compatible forwarded ref and semantic tokens
- [x] **COMP-04**: Textarea component with auto-resize option and semantic tokens
- [x] **COMP-05**: Select component built on Radix Select primitive
- [x] **COMP-06**: Checkbox component built on Radix Checkbox primitive
- [x] **COMP-07**: Radio component built on Radix RadioGroup primitive
- [x] **COMP-08**: Dialog component built on Radix Dialog primitive
- [ ] **COMP-09**: DropdownMenu component built on Radix DropdownMenu primitive
- [ ] **COMP-10**: Tabs component built on Radix Tabs primitive
- [ ] **COMP-11**: Tooltip component built on Radix Tooltip primitive
- [ ] **COMP-12**: Toast component using Sonner
- [ ] **COMP-13**: Form wrapper integrating react-hook-form with component library
- [ ] **COMP-14**: All components export from packages/ui/src/index.ts barrel file
- [ ] **COMP-15**: Every component uses semantic token classes only (bg-surface, text-foreground, etc.)

### Documentation

- [ ] **DOCS-01**: Storybook app in apps/storybook rendering all components
- [ ] **DOCS-02**: One story per component showing all variants and sizes
- [ ] **DOCS-03**: Tokens overview page in Storybook visualizing colors, spacing, typography, radii
- [ ] **DOCS-04**: Figma Code Connect mappings for all 12 component types
- [ ] **DOCS-05**: README.md with clone instructions, scope rename guide, and development workflow

### AI Integration

- [ ] **AIML-01**: CLAUDE.md at repo root with project overview and high-level conventions
- [ ] **AIML-02**: .claude/rules/ with path-scoped rules for packages/ui (component authoring pattern)
- [ ] **AIML-03**: .claude/rules/ with path-scoped rules for packages/tokens (token authoring constraints)
- [ ] **AIML-04**: .claude/rules/ with path-scoped rules for apps/storybook (story authoring pattern)
- [ ] **AIML-05**: AGENTS.md at repo root for cross-tool AI compatibility (references CLAUDE.md)
- [ ] **AIML-06**: Claude can add a new component by following documented patterns without human guidance

## v2 Requirements

### Enhanced Components

- **COMP-V2-01**: Accordion component built on Radix Accordion
- **COMP-V2-02**: Avatar component with image fallback
- **COMP-V2-03**: Badge component with variants
- **COMP-V2-04**: Card component with header/content/footer slots
- **COMP-V2-05**: Sheet/Drawer component built on Radix Dialog
- **COMP-V2-06**: Popover component built on Radix Popover
- **COMP-V2-07**: Command palette component (cmdk)

### Enhanced Tooling

- **TOOL-V2-01**: Visual regression testing via Chromatic or Playwright
- **TOOL-V2-02**: Changeset-based versioning for packages
- **TOOL-V2-03**: CI/CD pipeline template (GitHub Actions)
- **TOOL-V2-04**: Figma MCP server integration guide

### Enhanced Tokens

- **TOKN-V2-01**: Animation/motion tokens
- **TOKN-V2-02**: Responsive breakpoint tokens
- **TOKN-V2-03**: Multiple theme support beyond light/dark

## Out of Scope

| Feature                             | Reason                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------ |
| React 19 support                    | Radix UI infinite loop bug — upgrade path documented, revisit when fixed |
| Biome (replacing ESLint + Prettier) | Tailwind class sorting not mature enough in Biome                        |
| Server-side rendering               | Vite + React Router chosen deliberately for simplicity; no SSR opinions  |
| Authentication / API layer          | UI starter, not app template                                             |
| Mobile / React Native               | Web-first, separate concern                                              |
| CI/CD configuration                 | Too environment-specific for a starter template                          |
| Figma file / design assets          | Users bring their own designs or start from seed tokens                  |
| npm publishing pipeline             | Starter is cloned and owned, not consumed as dependency                  |
| Internationalization (i18n)         | Orthogonal concern, add per-product                                      |

## Traceability

| Requirement | Phase   | Status   |
| ----------- | ------- | -------- |
| FNDN-01     | Phase 1 | Complete |
| FNDN-02     | Phase 1 | Complete |
| FNDN-03     | Phase 1 | Complete |
| FNDN-04     | Phase 1 | Complete |
| FNDN-05     | Phase 1 | Complete |
| FNDN-06     | Phase 1 | Complete |
| FNDN-07     | Phase 1 | Complete |
| FNDN-08     | Phase 1 | Complete |
| FNDN-09     | Phase 1 | Complete |
| FNDN-10     | Phase 1 | Complete |
| TOKN-01     | Phase 2 | Complete |
| TOKN-02     | Phase 2 | Complete |
| TOKN-03     | Phase 2 | Complete |
| TOKN-04     | Phase 2 | Complete |
| TOKN-05     | Phase 2 | Complete |
| TOKN-06     | Phase 2 | Complete |
| TOKN-07     | Phase 2 | Complete |
| COMP-01     | Phase 3 | Complete |
| COMP-02     | Phase 3 | Complete |
| COMP-03     | Phase 3 | Complete |
| COMP-04     | Phase 3 | Complete |
| COMP-05     | Phase 3 | Complete |
| COMP-06     | Phase 3 | Complete |
| COMP-07     | Phase 3 | Complete |
| COMP-08     | Phase 3 | Complete |
| COMP-09     | Phase 5 | Pending  |
| COMP-10     | Phase 5 | Pending  |
| COMP-11     | Phase 5 | Pending  |
| COMP-12     | Phase 5 | Pending  |
| COMP-13     | Phase 5 | Pending  |
| COMP-14     | Phase 5 | Pending  |
| COMP-15     | Phase 5 | Pending  |
| DOCS-01     | Phase 4 | Pending  |
| DOCS-02     | Phase 4 | Pending  |
| DOCS-03     | Phase 4 | Pending  |
| DOCS-04     | Phase 4 | Pending  |
| DOCS-05     | Phase 4 | Pending  |
| AIML-01     | Phase 6 | Pending  |
| AIML-02     | Phase 6 | Pending  |
| AIML-03     | Phase 6 | Pending  |
| AIML-04     | Phase 6 | Pending  |
| AIML-05     | Phase 6 | Pending  |
| AIML-06     | Phase 6 | Pending  |

**Coverage:**

- v1 requirements: 38 total
- Mapped to phases: 38
- Unmapped: 0

**Phase distribution:**

- Phase 1 (Foundation): 10 requirements
- Phase 2 (Token System): 7 requirements
- Phase 3 (Core Components Foundation): 8 requirements
- Phase 4 (Documentation Infrastructure): 5 requirements
- Phase 5 (Core Components Advanced): 7 requirements
- Phase 6 (AI Integration): 6 requirements

---

_Requirements defined: 2026-02-01_
_Last updated: 2026-02-01 after phase 03 execution complete (COMP-01 through COMP-08 shipped)_
