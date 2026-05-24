---
profile: skill-manager
target: Skill definitions, Skill index, Pattern B, user/admin skill separation
stages:
  - chat
  - coding
  - debugging
---

# Skill Manager Skill

## Purpose
Use this skill when designing, editing, validating, or debugging Skill definitions.

## Rules
- Every Skill must explicitly declare `stages` with one or more of: `chat`, `coding`, `debugging`.
- Admin Skills may be saved as GitHub JSON files.
- User Skills are local app settings only and must not be included in GitHub file saves.
- The Skill index must contain metadata only: id, title, description, triggers, stages, file, enabled.
- Skill body content is loaded only after the selector chooses the Skill.
- Do not mix admin Skill selection logic with user Skill selection logic.

## Validation Checklist
1. Skill has a stable id.
2. Skill has explicit stages.
3. Skill has clear triggers.
4. Admin/user storage boundaries are preserved.
5. Index and content are separated for Pattern B.