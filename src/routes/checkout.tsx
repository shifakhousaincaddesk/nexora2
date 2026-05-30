import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutPage() {
  const [plan, setPlan] = useState("yearly");

  const yearlyPrice = 1;
  const monthlyPrice = 1;

  const selectedPrice =
    plan === "yearly"
      ? yearlyPrice
      : monthlyPrice;

  // LOAD RAZORPAY SCRIPT
  const loadRazorpay = async () => {

    const script =
      document.createElement("script");

    script.src =
      "https://checkout.razorpay.com/v1/checkout.js";

    script.async = true;

    document.body.appendChild(script);

    script.onload = () => {
      openRazorpay();
    };
  };

  // OPEN PAYMENT
  const openRazorpay = () => {

    const options = {

      // YOUR RAZORPAY KEY
      key: "rzp_test_SrVYmLubaVZqxF",

      amount: selectedPrice * 100,

      currency: "INR",

      name: "Nexora by BCI",

      description:
        plan === "yearly"
          ? "Yearly Subscription"
          : "Monthly Subscription",

      image:
        "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",

      // SUCCESS HANDLER
      handler: async function (
        response: any
      ) {

        const paymentId =
          response.razorpay_payment_id;

        alert("Payment Successful!");

        console.log(response);

        // SAVE PAYMENT
        await fetch(
          "/api/save-payment",
          {

            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              payment_id:
                paymentId,

              plan: plan,

              amount:
                selectedPrice,

              status: "paid",

            }),
          }
        );

        // REDIRECT
        window.location.href =
          "/dashboard";
      },

      // USER PREFILL
      prefill: {

        name: "Customer",

        email:
          "customer@email.com",

        contact:
          "9999999999",
      },

      // THEME
      theme: {
        color: "#7c3aed",
      },
    };

    // OPEN RAZORPAY
    const razor =
      new window.Razorpay(options);

    razor.open();
  };

  return (

    <div className="min-h-screen bg-[#0b0117] text-white">

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 p-10">

        {/* LEFT SIDE */}
        <div className="md:col-span-2 bg-[#140424] p-8 rounded-2xl border border-purple-900">

          <h1 className="text-4xl font-bold mb-8">
            Checkout to start growing
          </h1>

          {/* PLAN SELECT */}
          <div className="grid md:grid-cols-2 gap-5 mb-10">

            {/* YEARLY */}
            <div
              onClick={() =>
                setPlan("yearly")
              }
              className={`cursor-pointer rounded-xl border p-6 transition ${
                plan === "yearly"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-700"
              }`}
            >

              <h2 className="text-2xl font-bold">
                Yearly Access
              </h2>

              <p className="text-4xl font-bold mt-4">
                ₹499/mo
              </p>

              <p className="text-gray-400 mt-2">
                ₹5,999 billed yearly
              </p>

            </div>

            {/* MONTHLY */}
            <div
              onClick={() =>
                setPlan("monthly")
              }
              className={`cursor-pointer rounded-xl border p-6 transition ${
                plan === "monthly"
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-gray-700"
              }`}
            >

              <h2 className="text-2xl font-bold">
                Monthly Access
              </h2>

              <p className="text-4xl font-bold mt-4">
                ₹999/mo
              </p>

              <p className="text-gray-400 mt-2">
                billed monthly
              </p>

            </div>
          </div>

          {/* BILLING */}
          <div className="space-y-5">

            <h2 className="text-2xl font-bold">
              Billing Details
            </h2>

            <input
              placeholder="Full Name"
              className="w-full bg-black border border-gray-700 rounded-xl p-4"
            />

            <input
              placeholder="Email Address"
              className="w-full bg-black border border-gray-700 rounded-xl p-4"
            />

            <input
              placeholder="Phone Number"
              className="w-full bg-black border border-gray-700 rounded-xl p-4"
            />

            <select
              className="w-full bg-black border border-gray-700 rounded-xl p-4"
            >
              <option>
                India
              </option>
            </select>

          </div>

          {/* PAYMENT METHODS */}
          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-4">
              Payment Method
            </h2>

            <div className="space-y-4">

              <div className="border border-gray-700 rounded-xl p-5">
                UPI / Google Pay / PhonePe
              </div>

              <div className="border border-gray-700 rounded-xl p-5">
                Credit / Debit Card
              </div>

              <div className="border border-gray-700 rounded-xl p-5">
                Net Banking
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="bg-[#140424] p-8 rounded-2xl border border-purple-900 h-fit sticky top-10">

          <h2 className="text-3xl font-bold mb-8">
            Summary
          </h2>

          <div className="space-y-5 text-lg">

            <div className="flex justify-between">

              <span>
                Plan
              </span>

              <span>
                {plan === "yearly"
                  ? "Yearly"
                  : "Monthly"}
              </span>

            </div>

            <div className="flex justify-between">

              <span>
                Subtotal
              </span>

              <span>
                ₹{selectedPrice}
              </span>

            </div>

            <div className="flex justify-between">

              <span>
                GST
              </span>

              <span>
                ₹0
              </span>

            </div>

            <hr className="border-gray-700" />

            <div className="flex justify-between text-2xl font-bold">

              <span>
                Total
              </span>

              <span>
                ₹{selectedPrice}
              </span>

            </div>
          </div>

          {/* PAY BUTTON */}
          <button
            onClick={loadRazorpay}
            className="w-full mt-10 bg-purple-600 hover:bg-purple-700 transition rounded-xl p-5 text-xl font-bold"
          >
            Start Subscription
          </button>

          <p className="text-gray-400 text-sm mt-6">
            Secure payments powered by Razorpay.
            Cancel anytime.
          </p>

        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;