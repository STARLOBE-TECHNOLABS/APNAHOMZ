#!/usr/bin/env node
/** E2E test — Prestige plan only (15 renders, all 8 styles). */
const { API_BASE, assertSafeTarget, printSummary, runPlanE2E, verifyPublicPlansApi } =
  require('./lib/subscriptionTestHelpers');

async function main() {
  assertSafeTarget();
  console.log('Subscription E2E — PRESTIGE');
  console.log(`API: ${API_BASE}\n`);
  await verifyPublicPlansApi();
  await runPlanE2E('prestige');
  printSummary();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
