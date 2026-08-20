# GitHub Copilot Modernization Workflow Canvas

**See your application modernization journey, know what comes next, and keep
GitHub Copilot aligned with the Modernize CLI workflow.**

The Modernization Workflow Canvas is an interactive companion for the
[GitHub Copilot Modernize CLI](https://github.com/microsoft/modernize-cli).
It turns the governed **Assess → Plan → Execute** lifecycle into a visual
workspace for .NET, Java, and C++ application repositories.

![Modernization Workflow canvas preview](assets/preview.png)

## Why use this canvas?

Modernization produces reports, plans, tasks, code changes, and validation
results across several commands. This canvas brings those signals together so
you can:

- See the current Assess, Plan, and Execute stage at a glance.
- Generate commands from your source, technology, goal, and plan name.
- Detect .NET, Java, and C++ repository signals.
- Discover Modernize CLI artifacts under `.github/modernize/`.
- Track manual progress alongside artifact-derived progress.
- Switch between local execution and GitHub Copilot cloud-agent delegation.
- Use the reviewable workflow or the faster `modernize upgrade` path.
- Let Copilot configure, refresh, and update the workflow through canvas actions.

The canvas displays and copies commands; it does **not** execute them without
you. Run copied commands in a terminal where you can review their output.

> [!IMPORTANT]
> This is a GitHub Copilot CLI/App canvas extension, not a VS Code extension.
> Your Copilot client must support extension canvases.

## Prerequisites

Before installing the canvas, make sure you have:

1. A GitHub Copilot plan and a canvas-capable GitHub Copilot CLI/App.
2. [Git](https://git-scm.com/downloads).
3. [GitHub CLI](https://cli.github.com/) authenticated with `gh auth login`.
4. The [Modernize CLI](https://github.com/microsoft/modernize-cli) available as
   `modernize`.
5. A local application repository to assess and modernize.

Install the Modernize CLI with the platform-appropriate command:

| Platform | Command |
| --- | --- |
| Windows | `winget install GitHub.Copilot.modernization.agent` |
| macOS | `brew tap microsoft/modernize https://github.com/microsoft/modernize-cli && brew trust microsoft/modernize && brew install modernize` |
| Linux | `curl -fsSL https://raw.githubusercontent.com/microsoft/modernize-cli/main/scripts/install.sh \| sh` |

Open a new terminal after installation, then confirm both tools are available:

```text
gh auth status
modernize --help
```

## Install the canvas

The extension has no npm dependencies. Copilot supplies
`@github/copilot-sdk` when it loads the extension.

### Windows

Run these commands in PowerShell:

```powershell
git clone https://github.com/EmeaAppGbb/modernization-canvas.git

$source = Resolve-Path ".\modernization-canvas\extensions\modernization-workflow"
$copilotHome = if ($env:COPILOT_HOME) {
    $env:COPILOT_HOME
} else {
    Join-Path $HOME ".copilot"
}
$destination = Join-Path $copilotHome "extensions\modernization-workflow"

New-Item -ItemType Directory -Force $destination | Out-Null
Copy-Item "$source\*" $destination -Recurse -Force
```

Restart the GitHub Copilot App or CLI after copying the extension.

### macOS

Run these commands in Terminal:

```bash
git clone https://github.com/EmeaAppGbb/modernization-canvas.git

COPILOT_HOME="${COPILOT_HOME:-$HOME/.copilot}"
mkdir -p "$COPILOT_HOME/extensions/modernization-workflow"
cp -R modernization-canvas/extensions/modernization-workflow/. \
  "$COPILOT_HOME/extensions/modernization-workflow/"
```

Restart the GitHub Copilot App or CLI after copying the extension.

### Linux

Run these commands in your shell:

```bash
git clone https://github.com/EmeaAppGbb/modernization-canvas.git

COPILOT_HOME="${COPILOT_HOME:-$HOME/.copilot}"
mkdir -p "$COPILOT_HOME/extensions/modernization-workflow"
cp -R modernization-canvas/extensions/modernization-workflow/. \
  "$COPILOT_HOME/extensions/modernization-workflow/"
```

Restart GitHub Copilot CLI after copying the extension.

### Install for one repository only

To share the canvas with everyone working in one repository, copy the
`extensions/modernization-workflow` folder into:

```text
<application-repository>/.github/extensions/modernization-workflow/
```

The resulting folder must contain `extension.mjs` directly:

```text
.github/
└── extensions/
    └── modernization-workflow/
        ├── extension.mjs
        ├── copilot-extension.json
        └── lib/
```

Project-scoped extensions take precedence over a global extension with the same
name.

### Install from Awesome Copilot

After this plugin is approved and listed in the
[Awesome Copilot](https://github.com/github/awesome-copilot) marketplace, the
installation command will be:

```text
copilot plugin install modernization-workflow@awesome-copilot
```

Until the listing is published, use one of the source installation methods
above.

## Verify the installation

Start Copilot in an application repository and ask:

```text
List the installed extensions and their canvases.
```

You should see:

```text
modernization-workflow — running
Canvas: modernization-workflow
```

If it is not listed, confirm that the installed folder contains
`extension.mjs` directly, then restart Copilot.

## Use the canvas

### 1. Open your application repository

Start GitHub Copilot from the repository you want to modernize. The working
directory is the default source for the workflow.

### 2. Open the canvas

Ask Copilot:

```text
Open the Modernization Workflow canvas for this repository.
```

### 3. Configure the workflow

Use the **Workflow setup** panel to choose:

| Setting | Purpose |
| --- | --- |
| Technology | Auto-detect, .NET, Java, or C++ |
| Execution | Run locally or delegate supported work to a cloud agent |
| Source | Local path, Git URL, or Modernize CLI repository configuration |
| Modernization goal | The outcome used to create the plan |
| Upgrade target | Optional target for the `modernize upgrade` fast path |
| Plan name | Stable name for plan and task artifacts |

You can also ask Copilot to configure it:

```text
Configure the Modernization Workflow for a .NET 10 upgrade, using the current
repository and a plan named dotnet10-modernization.
```

### 4. Assess

Copy the Assess command from the canvas and run it in your terminal:

```bash
modernize assess --source .
```

The default assessment output is `.github/modernize/assessment/`. Select
**Refresh artifacts** when the command finishes. The canvas automatically marks
Assess complete when it finds assessment output.

### 5. Plan

Review the assessment findings, then run the generated plan command:

```bash
modernize plan create "modernize this application for Azure" \
  --source . \
  --plan-name modernization-plan
```

Review and edit the generated files before execution:

```text
.github/modernize/modernization-plan/plan.md
.github/modernize/modernization-plan/tasks.json
```

The canvas marks Plan complete after it finds both files.

### 6. Execute

Run the plan after it has been reviewed:

```bash
modernize plan execute \
  --source . \
  --plan-name modernization-plan
```

During execution, the Modernize CLI applies transformations, validates builds,
scans for CVEs, commits changes, and generates a summary. Refresh the canvas to
load the resulting progress and summary artifacts.

### 7. Use the upgrade fast path when appropriate

For an end-to-end runtime or framework upgrade that does not require a separate
plan-review checkpoint:

```bash
modernize upgrade ".NET 10" --source .
```

Use the full Assess, Plan, and Execute path when governance, review, or plan
customization is important.

## Local and cloud execution

Local execution is the default and supports local application paths.

Cloud delegation requires a `github.com` repository URL:

```bash
modernize assess \
  --source https://github.com/organization/application.git \
  --delegate cloud \
  --wait
```

The canvas warns when cloud execution is selected with a local path or an
unsupported Git provider.

## C++ support

The canvas detects common C++ signals such as `CMakeLists.txt`, Makefiles,
`.cpp` files, and Visual C++ project files.

> [!NOTE]
> The current Modernize CLI reference documents explicit `--language` values for
> Java and .NET only. C++ commands therefore rely on CLI auto-detection. Verify
> C++ support against your installed Modernize CLI version and available
> modernization skills before executing a plan.

## Workflow state and artifacts

Canvas state is stored in the application repository:

```text
.github/modernize/canvas-<stateId>.json
```

This lets progress survive canvas reloads and Copilot restarts. Add the state
file to your repository if the team should share progress, or ignore it if the
workflow is personal.

The canvas derives progress from these Modernize CLI artifacts:

| Stage | Detected artifacts |
| --- | --- |
| Assess | Assessment JSON, Markdown, or HTML reports |
| Plan | `<plan-name>/plan.md` and `<plan-name>/tasks.json` |
| Execute | Summary, progress, or result files under the plan folder |

## Troubleshooting

| Problem | Resolution |
| --- | --- |
| Canvas is not listed | Confirm `extension.mjs` is directly inside the installed extension folder, then restart Copilot. |
| Technology is not detected | Select .NET, Java, or C++ manually in Workflow setup. |
| Progress does not update | Select **Refresh artifacts** and confirm the CLI wrote output under `.github/modernize/`. |
| Cloud delegation warning | Use a `https://github.com/...` source URL or switch execution to Local. |
| A command does not match your CLI | Run `modernize <command> --help`; CLI options can evolve independently of the canvas. |

## Uninstall

Remove the installed extension folder and restart Copilot.

Windows:

```powershell
$copilotHome = if ($env:COPILOT_HOME) { $env:COPILOT_HOME } else { Join-Path $HOME ".copilot" }
Remove-Item (Join-Path $copilotHome "extensions\modernization-workflow") -Recurse
```

macOS and Linux:

```bash
COPILOT_HOME="${COPILOT_HOME:-$HOME/.copilot}"
rm -rf "$COPILOT_HOME/extensions/modernization-workflow"
```

For a project-scoped installation, remove
`.github/extensions/modernization-workflow/` from that repository instead.

## Contributing and marketplace publication

The distributable plugin is defined by `plugin.json`; reusable extension source
lives in `extensions/modernization-workflow/`.

To submit this repository to Awesome Copilot:

1. Make the GitHub repository public.
2. Create an immutable semantic-version release tag, such as `v1.0.0`.
3. Record the release tag and full 40-character commit SHA.
4. Submit the external plugin issue form in `github/awesome-copilot`, using `/`
   as the plugin path.
5. Address any `vally lint`, canvas-structure, or install smoke-test findings.

Do not edit `plugins/external.json` directly. Approved submissions are added by
the Awesome Copilot review automation.

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidance.

## References

- [Modernize CLI](https://github.com/microsoft/modernize-cli)
- [Modernization agent overview](https://learn.microsoft.com/azure/developer/github-copilot-app-modernization/modernization-agent/overview)
- [Modernize CLI command reference](https://learn.microsoft.com/azure/developer/github-copilot-app-modernization/modernization-agent/cli-commands)
- [Awesome Copilot contribution guide](https://github.com/github/awesome-copilot/blob/main/CONTRIBUTING.md)

## License

Licensed under the [MIT License](LICENSE).
