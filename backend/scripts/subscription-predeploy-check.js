#!/usr/bin/env node
/**
 * Predeploy billing check.
 *
 * Safe mode (default):
 *   - verifies backend is reachable
 *   - verifies public billing plans API
 *   - verifies current test harness loads cleanly
 *
 * Full mode:
 *   - set BILLING_E2E_FULL=1
 *   - runs the full subscription lifecycle for all 3 plans:
 *     buy -> claim -> usage -> credits exhausted -> buy again -> expiry -> renew
 */
const {
  API_BASE,
  assertSafeTarget,
  printSummary,
  verifyPublicPlansApi,
  runPlanE2E,
  api,
} = require('./lib/subscriptionTestHelpers');

async function verifyBackendRoot() {
  const result = await api('/');
  if (result.status !== 200) {
    throw new Error(`Backend root check failed (${result.status})`);
  }
  console.log('  OK: backend root endpoint reachable');
}

async function main() {
  assertSafeTarget();

  const fullMode = process.env.BILLING_E2E_FULL === '1';

  console.log('ApnaHomz Predeploy Billing Check');
  console.log(`API: ${API_BASE}`);
  console.log(`Mode: ${fullMode ? 'FULL' : 'SAFE'}\n`);

  console.log('=== Connectivity ===');
  await verifyBackendRoot();

  console.log('\n=== Public Billing API ===');
  await verifyPublicPlansApi();

  if (fullMode) {
    console.log('\n=== Full Billing Lifecycle ===');
    await runPlanE2E('essential');
    await runPlanE2E('signature');
    await runPlanE2E('prestige');
  } else {
    console.log('\nSkipping destructive billing lifecycle checks.');
    console.log('Set BILLING_E2E_FULL=1 when you want full buy/use/buy-again coverage.');
  }

  printSummary();
  console.log('\nPredeploy billing check completed.\n');
}

main().catch((error) => {
  console.error('\nPredeploy check failed:', error.message);
  process.exit(1);
});
