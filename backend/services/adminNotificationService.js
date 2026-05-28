const { sendEmail } = require('./emailService');

const ADMIN_NOTIFICATION_EMAIL =
  process.env.ADMIN_NOTIFICATION_EMAIL || 'info@apnahomz.com';

function formatValue(value) {
  if (value === null || value === undefined || value === '') return 'Not provided';
  return String(value);
}

function formatPrice(amount, currency = 'INR') {
  if (amount === null || amount === undefined) return 'Not available';
  return `${currency} ${Number(amount).toLocaleString('en-IN')}`;
}

async function sendAdminUserRegistrationNotification({ username, email, phone }) {
  const subject = `New user registration: ${formatValue(username)}`;
  const html = `
    <h2>New User Registration</h2>
    <p>A new user has registered on FloorLite.</p>
    <table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse;">
      <tr><td><strong>Username</strong></td><td>${formatValue(username)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${formatValue(email)}</td></tr>
      <tr><td><strong>Mobile Number</strong></td><td>${formatValue(phone)}</td></tr>
    </table>
  `;
  const text = [
    'New User Registration',
    `Username: ${formatValue(username)}`,
    `Email: ${formatValue(email)}`,
    `Mobile Number: ${formatValue(phone)}`,
  ].join('\n');

  return sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject,
    html,
    text,
    fromName: 'FloorLite Notifications',
  });
}

async function sendAdminPlanSubscriptionNotification({
  username,
  email,
  phone,
  planName,
  planCode,
  amount,
  currency,
  renderLimit,
  styleAccess,
  paymentId,
  orderId,
}) {
  const subject = `Plan subscribed: ${formatValue(planName)} by ${formatValue(username)}`;
  const html = `
    <h2>Plan Subscription Activated</h2>
    <p>A user's plan has been activated successfully.</p>
    <table cellpadding="6" cellspacing="0" border="1" style="border-collapse:collapse;">
      <tr><td><strong>Username</strong></td><td>${formatValue(username)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${formatValue(email)}</td></tr>
      <tr><td><strong>Mobile Number</strong></td><td>${formatValue(phone)}</td></tr>
      <tr><td><strong>Plan Name</strong></td><td>${formatValue(planName)}</td></tr>
      <tr><td><strong>Plan Code</strong></td><td>${formatValue(planCode)}</td></tr>
      <tr><td><strong>Amount</strong></td><td>${formatPrice(amount, currency)}</td></tr>
      <tr><td><strong>AI Render Limit</strong></td><td>${formatValue(renderLimit)}</td></tr>
      <tr><td><strong>Interior Styles Access</strong></td><td>${formatValue(styleAccess)}</td></tr>
      <tr><td><strong>Payment ID</strong></td><td>${formatValue(paymentId)}</td></tr>
      <tr><td><strong>Order ID</strong></td><td>${formatValue(orderId)}</td></tr>
    </table>
  `;
  const text = [
    'Plan Subscription Activated',
    `Username: ${formatValue(username)}`,
    `Email: ${formatValue(email)}`,
    `Mobile Number: ${formatValue(phone)}`,
    `Plan Name: ${formatValue(planName)}`,
    `Plan Code: ${formatValue(planCode)}`,
    `Amount: ${formatPrice(amount, currency)}`,
    `AI Render Limit: ${formatValue(renderLimit)}`,
    `Interior Styles Access: ${formatValue(styleAccess)}`,
    `Payment ID: ${formatValue(paymentId)}`,
    `Order ID: ${formatValue(orderId)}`,
  ].join('\n');

  return sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject,
    html,
    text,
    fromName: 'FloorLite Notifications',
  });
}

module.exports = {
  sendAdminUserRegistrationNotification,
  sendAdminPlanSubscriptionNotification,
};
