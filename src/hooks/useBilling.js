import { useCallback, useEffect, useState } from 'react';
import { billingService } from '../services/billingService';
import { useAuth } from '../context/AuthContext';

let checkoutScriptPromise = null;

function loadRazorpayCheckout() {
  if (window.Razorpay) return Promise.resolve();
  if (checkoutScriptPromise) return checkoutScriptPromise;

  checkoutScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Unable to load Razorpay Checkout'));
    document.body.appendChild(script);
  });

  return checkoutScriptPromise;
}

export function useBilling({ autoLoad = true } = {}) {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [entitlement, setEntitlement] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(Boolean(autoLoad));
  const [checkoutLoading, setCheckoutLoading] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) return null;
    setError(null);
    const [planList, currentEntitlement, paymentHistory] = await Promise.all([
      billingService.getPlans(),
      billingService.getMyEntitlement(),
      billingService.getPaymentHistory(),
    ]);
    setPlans(planList);
    setEntitlement(currentEntitlement);
    setHistory(paymentHistory);
    return currentEntitlement;
  }, [user]);

  useEffect(() => {
    if (!autoLoad || !user) return;
    let cancelled = false;

    setLoading(true);
    refresh()
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [autoLoad, refresh, user]);

  const startCheckout = useCallback(async (planCode) => {
    if (!user) throw new Error('Please sign in before buying a plan');
    setCheckoutLoading(planCode);
    setError(null);

    try {
      const order = await billingService.createOrder(planCode);
      await loadRazorpayCheckout();

      const entitlementResult = await new Promise((resolve, reject) => {
        const checkout = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: 'ApnaHomz',
          description: `${order.plan.name} 30-day package`,
          order_id: order.orderId,
          prefill: {
            name: user.username,
            email: user.email,
          },
          theme: {
            color: '#142725',
          },
          handler: async (response) => {
            try {
              const updated = await billingService.verifyPayment(response);
              resolve(updated);
            } catch (err) {
              reject(err);
            }
          },
          modal: {
            ondismiss: () => reject(new Error('Payment was cancelled')),
          },
        });

        checkout.open();
      });

      setEntitlement(entitlementResult);
      await refresh();
      return entitlementResult;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setCheckoutLoading(null);
    }
  }, [refresh, user]);

  return {
    plans,
    entitlement,
    history,
    loading,
    checkoutLoading,
    error,
    refresh,
    startCheckout,
  };
}
