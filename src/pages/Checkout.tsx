import { useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");

      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };

      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay failed to load");
      return;
    }

    const options = {
      key: "rzp_test_SrVYmLubaVZqxF",

      amount: 9999,

      currency: "INR",

      name: "Nexora by BCI",

      description: "Growth Plan",

      image: "/logo.png",

      handler: async function (response: any) {

        console.log(response);

        alert("Payment Successful!");

      },

      prefill: {
        name: "Customer",
        email: "customer@email.com",
      },

      theme: {
        color: "#7c5cff",
      },
    };

    const paymentObject = new window.Razorpay(options);

    paymentObject.open();

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">

      <div className="w-full max-w-lg bg-[#111] rounded-2xl p-8 border border-purple-500">

        <h1 className="text-4xl font-bold mb-4">
          Complete Your Purchase
        </h1>

        <p className="text-zinc-400 mb-8">
          Unlock premium AI marketing tools for your business.
        </p>

        <div className="bg-[#1a1a1a] rounded-xl p-6 mb-6">

          <div className="flex justify-between mb-3">
            <span>Growth Plan</span>
            <span>₹999</span>
          </div>

          <div className="flex justify-between mb-3">
            <span>GST</span>
            <span>₹180</span>
          </div>

          <div className="border-t border-zinc-700 pt-4 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₹1179</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 transition-all py-4 rounded-xl text-lg font-semibold"
        >
          {loading ? "Processing..." : "Pay Securely"}
        </button>

        <p className="text-center text-zinc-500 text-sm mt-6">
          Secured by Razorpay
        </p>

      </div>
    </div>
  );
}