# Contributing

Contributions should keep the canvas aligned with the published Modernize CLI
command reference and the Copilot extension canvas SDK.

1. Make focused changes under `extensions/modernization-workflow/`.
2. Keep `.github/extensions/modernization-workflow/extension.mjs` as the
   project-local entry point.
3. Do not add runtime packages; the Copilot CLI resolves its extension SDK.
4. Reload the extension and validate discovery, open, actions, input validation,
   and renderer behavior before opening a pull request.
5. Update `assets/preview.png` when the primary UI changes.

Report security issues through the private process in `SECURITY.md`.
