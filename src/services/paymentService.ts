import RazorpayCheckout, { RazorpayOptions, RazorpaySuccessResponse } from 'react-native-razorpay';

export type PlanId = 'monthly' | 'annual';

export interface PlanDetails {
  id: PlanId;
  label: string;
  amountPaise: number;   // Razorpay expects paise (₹1 = 100 paise)
  amountDisplay: string;
  period: string;
}

export const PLAN_DETAILS: Record<PlanId, PlanDetails> = {
  monthly: {
    id: 'monthly',
    label: 'Student Premium (Monthly)',
    amountPaise: 29900,
    amountDisplay: '₹299',
    period: 'per month',
  },
  annual: {
    id: 'annual',
    label: 'Student Premium (Annual)',
    amountPaise: 249900,
    amountDisplay: '₹2,499',
    period: 'per year',
  },
};

// ---------------------------------------------------------------------------
// createOrder — replace this stub with a real POST to your backend.
// Your backend should call Razorpay's Orders API and return the order_id.
// ---------------------------------------------------------------------------
async function createOrder(planId: PlanId): Promise<string> {
  // TODO: replace with real API call:
  //   const res = await fetch(`${API_BASE}/payments/create-order`, {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  //     body: JSON.stringify({ planId }),
  //   });
  //   const { order_id } = await res.json();
  //   return order_id;

  // Stub: returns a fake Razorpay order_id for UI development
  await new Promise((r) => setTimeout(r, 400));
  return `order_${Date.now()}_stub`;
}

// ---------------------------------------------------------------------------
// openRazorpayCheckout — call this from the subscription screen.
// Returns the success response; throws on failure or cancellation.
// ---------------------------------------------------------------------------
export async function openRazorpayCheckout(
  planId: PlanId,
  userPhone: string,
  userName: string,
): Promise<RazorpaySuccessResponse> {
  const plan = PLAN_DETAILS[planId];
  const orderId = await createOrder(planId);

  const options: RazorpayOptions = {
    key: 'rzp_test_REPLACE_WITH_YOUR_KEY',  // TODO: move to env variable
    amount: plan.amountPaise,
    currency: 'INR',
    name: 'Dhrona',
    description: plan.label,
    order_id: orderId,
    prefill: {
      contact: userPhone,
      name: userName,
    },
    theme: { color: '#7B5CFF' },
    retry: { enabled: true, max_count: 2 },
    notes: { planId },
  };

  return RazorpayCheckout.open(options);
}
