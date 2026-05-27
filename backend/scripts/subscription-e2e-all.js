#!/usr/bin/env node
/**
 * Full subscription E2E — all 3 plans + expiry + renewal + payment history.
 *
 * Prerequisites:
 *   1. Backend running (local: npm run dev in backend/)
 *   2. backend/.env with DB_* and JWT_SECRET (same DB as API)
 *
 * Run:
 *   cd backend
 *   set BILLING_E2E_API_URL=http://localhost:5000
 *   node scripts/subscription-e2e-all.js
 */
const {
  API_BASE,
  assertSafeTarget,
  printSummary,
  runPlanE2E,
  verifyPublicPlansApi,
} = require('./lib/subscriptionTestHelpers');

async function main() {
  assertSafeTarget();
  console.log('ApnaHomz Subscription E2E — ALL PLANS');
  console.log(`API: ${API_BASE}`);
  console.log('Simulates: WordPress pay → register+claim → access → 30-day expiry → renew\n');

  await verifyPublicPlansApi();
  await runPlanE2E('essential');
  await runPlanE2E('signature');
  await runPlanE2E('prestige');

  printSummary();
  console.log('\nAll subscription checks passed. Safe to deploy if manual Razorpay test also OK.\n');
}

main().catch((error) => {
  console.error('\nE2E aborted:', error.message);
  process.exit(1);
});
