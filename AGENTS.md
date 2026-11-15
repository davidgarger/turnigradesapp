# Architecture
- Keep editable Turni-Pass data in the existing TurnState and undo history; store only capability-link snapshots in pass_shares to avoid a second source of truth.
- Rebuild existing pass-share snapshots transactionally from app_state with a database trigger; revoke disabled or orphaned shares so resets, transfers and cloud writes cannot leave stale public data.
- Public pass access requires an exact cryptographic token through a server function; never grant anonymous table access or expose private student fields.
- Reuse the same pass-sheet component for teacher and read-only public views; pure pass rules and payload projection live in a browser-safe module.