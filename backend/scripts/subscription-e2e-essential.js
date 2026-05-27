#!/usr/bin/env node
/** E2E test — Essential plan only (5 renders, 3 styles). */
const { API_BASE, assertSafeTarget, printSummary, runPlanE2E, verifyPublicPlansApi } =
  require('./lib/subscriptionTestHelpers');

async function main() {
  assertSafeTarget();
  console.log('Subscription E2E — ESSENTIAL');
  console.log(`API: ${API_BASE}\n`);
  await verifyPublicPlansApi();
  await runPlanE2E('essential');
  printSummary();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
