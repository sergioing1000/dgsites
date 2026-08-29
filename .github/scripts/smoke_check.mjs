import { appendFile, readFile } from "node:fs/promises";

const DEFAULT_MAX_WAIT_MS = 120_000;
const DEFAULT_INTERVAL_MS = 5_000;
const REQUEST_TIMEOUT_MS = 15_000;

function getPositiveNumber(value, fallback) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}

async function resolveDeployUrl(resultPath) {
  if (!resultPath) {
    throw new Error("Pass the Netlify deployment JSON path as the first argument.");
  }

  const deployResult = JSON.parse(await readFile(resultPath, "utf8"));
  const deployUrl =
    deployResult.deploy_url ?? deployResult.deployUrl ?? deployResult.url;

  if (!deployUrl) {
    throw new Error("Netlify did not return a deployment URL.");
  }

  return new URL(deployUrl).toString();
}

async function probeApplication(deployUrl) {
  const response = await fetch(deployUrl, {
    headers: { Accept: "text/html" },
    redirect: "follow",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const html = await response.text();
  const contentType = response.headers.get("content-type") ?? "";

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  if (!contentType.includes("text/html")) {
    throw new Error(`unexpected content type: ${contentType || "missing"}`);
  }
  if (!/<div\s+id=["']root["']/.test(html)) {
    throw new Error("the application root element is missing");
  }
}

async function smokeCheck() {
  const deployUrl = await resolveDeployUrl(process.argv[2]);
  const maxWaitMs = getPositiveNumber(
    process.env.SMOKE_MAX_WAIT_MS,
    DEFAULT_MAX_WAIT_MS
  );
  const intervalMs = getPositiveNumber(
    process.env.SMOKE_INTERVAL_MS,
    DEFAULT_INTERVAL_MS
  );
  const deadline = Date.now() + maxWaitMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      await probeApplication(deployUrl);
      console.log(`Smoke check passed: ${deployUrl}`);
      return deployUrl;
    } catch (error) {
      lastError = error;
      console.log(`Waiting for ${deployUrl}: ${error.message}`);
      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  }

  throw new Error(
    `Smoke check failed for ${deployUrl}: ${lastError?.message ?? "timeout"}`
  );
}

smokeCheck()
  .then(async (deployUrl) => {
    if (process.env.GITHUB_OUTPUT) {
      await appendFile(process.env.GITHUB_OUTPUT, `deploy_url=${deployUrl}\n`);
    }
  })
  .catch((error) => {
    console.error(`::error::${error.message}`);
    process.exitCode = 1;
  });
