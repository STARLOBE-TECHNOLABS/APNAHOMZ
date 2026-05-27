#!/usr/bin/env node
/** E2E test — Signature plan only (10 renders, 5 premium styles). */
const { API_BASE, assertSafeTarget, printSummary, runPlanE2E, verifyPublicPlansApi } =
  require('./lib/subscriptionTestHelpers');

async function main() {
  assertSafeTarget();
  console.log('Subscription E2E — SIGNATURE');
  console.log(`API: ${API_BASE}\n`);
  await verifyPublicPlansApi();
  await runPlanE2E('signature');
  printSummary();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
