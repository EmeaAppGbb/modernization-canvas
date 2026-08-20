import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
    configureWorkflow,
    getWorkflowState,
    refreshWorkflow,
} from "../extensions/modernization-workflow/lib/state.mjs";

async function fixture() {
    return mkdtemp(join(tmpdir(), "modernization-workflow-"));
}

test("detects .NET and generates documented language flags", async (t) => {
    const workspace = await fixture();
    t.after(() => rm(workspace, { recursive: true, force: true }));
    await writeFile(join(workspace, "Example.csproj"), "<Project />");

    const state = await getWorkflowState(workspace);

    assert.equal(state.detectedLanguage, "dotnet");
    assert.match(state.commands.plan, /--language dotnet/);
    assert.equal(state.commands.upgrade, "modernize upgrade --source .");
    assert.equal(state.compatibilityNotice, null);
});

test("keeps C++ on auto-detection and reports compatibility", async (t) => {
    const workspace = await fixture();
    t.after(() => rm(workspace, { recursive: true, force: true }));
    await writeFile(join(workspace, "CMakeLists.txt"), "project(example)");
    await configureWorkflow(workspace, "cpp-flow", {
        language: "cpp",
        source: ".",
        goal: "upgrade the C++ application",
        planName: "cpp-modernization",
        delegate: "local",
    });

    const state = await getWorkflowState(workspace, "cpp-flow");

    assert.equal(state.effectiveLanguage, "cpp");
    assert.doesNotMatch(state.commands.plan, /--language/);
    assert.match(state.compatibilityNotice, /C\+\+/);
});

test("derives progress only from the matching artifact stage", async (t) => {
    const workspace = await fixture();
    t.after(() => rm(workspace, { recursive: true, force: true }));
    const assessment = join(workspace, ".github", "modernize", "assessment");
    await mkdir(assessment, { recursive: true });
    await writeFile(join(assessment, "assessment-summary.md"), "# Assessment");

    let state = await refreshWorkflow(workspace);
    assert.equal(state.steps.assess.status, "complete");
    assert.equal(state.steps.execute.status, "pending");

    const plan = join(workspace, ".github", "modernize", "modernization-plan");
    await mkdir(plan, { recursive: true });
    await writeFile(join(plan, "plan.md"), "# Plan");
    await writeFile(join(plan, "tasks.json"), "[]");
    state = await refreshWorkflow(workspace);
    assert.equal(state.steps.plan.status, "complete");
    assert.equal(state.steps.execute.status, "pending");

    await writeFile(join(plan, "summary.md"), "# Complete");
    state = await refreshWorkflow(workspace);
    assert.equal(state.steps.execute.status, "complete");
});

test("rejects unsafe plan names from the HTTP configuration path", async (t) => {
    const workspace = await fixture();
    t.after(() => rm(workspace, { recursive: true, force: true }));

    await assert.rejects(
        configureWorkflow(workspace, "default", {
            planName: "../outside",
        }),
        /Plan name/,
    );
});

test("guides cloud delegation and waits for assessment output", async (t) => {
    const workspace = await fixture();
    t.after(() => rm(workspace, { recursive: true, force: true }));
    await configureWorkflow(workspace, "cloud-flow", {
        delegate: "cloud",
    });

    const state = await getWorkflowState(workspace, "cloud-flow");

    assert.match(state.commands.assess, /--delegate cloud --wait$/);
    assert.match(state.compatibilityNotice, /github\.com repository URL/);
});
