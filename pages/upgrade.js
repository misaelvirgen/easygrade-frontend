import React, { useState } from "react";
import PricingButtons from "@/components/PricingButtons";
import { useRouter } from "next/router";

export default function Upgrade() {
  const [billing, setBilling] = useState("yearly");
  const router = useRouter();

  const pricePro = billing === "yearly" ? 8 : 10;

  return (
    <div className="upgrade-overlay" onClick={() => router.push("/dashboard")}>

      <div className="upgrade-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* CLOSE BUTTON */}
        <button className="close-btn" onClick={() => router.push("/dashboard")}>
          ✕
        </button>

        {/* HEADER */}
        <h1 className="title">Upgrade Your EasyGrade Plan</h1>

        <div className="billing-toggle">
          <button
            className={billing === "yearly" ? "active" : ""}
            onClick={() => setBilling("yearly")}
          >
            Annually <span className="discount">–20%</span>
          </button>

          <button
            className={billing === "monthly" ? "active" : ""}
            onClick={() => setBilling("monthly")}
          >
            Monthly
          </button>
        </div>

        {/* PRICING GRID */}
        <div className="pricing-grid">

          {/* FREE PLAN */}
          <div className="plan-card">
            <h2>Free</h2>
            <p className="plan-subtitle">Basic grading features.</p>
            <div className="price">$0</div>

            <ul className="features">
              <li>● 10 essays per month</li>
              <li>● Upload PDFs</li>
              <li>● Basic rubric builder</li>
            </ul>

            <button className="disabled-btn">Current Plan</button>
          </div>

          {/* PRO PLAN */}
          <div className="plan-card selected">
            <div className="badge">Most Popular</div>
            <h2>Pro</h2>
            <p className="plan-subtitle">Unlimited grading & AI features.</p>

            <div className="price">
              ${pricePro}
              <span className="per">/month</span>
            </div>

            <ul className="features">
              <li>✔ Unlimited essays</li>
              <li>✔ Advanced AI feedback</li>
              <li>✔ Smart rubric generator</li>
            </ul>

            <PricingButtons billing={billing} />
          </div>

          {/* ENTERPRISE */}
          <div className="plan-card">
            <h2>Enterprise</h2>
            <p className="plan-subtitle">For schools & districts.</p>
            <div className="price">Custom</div>

            <ul className="features">
              <li>✔ LMS/SIS integration</li>
              <li>✔ Admin controls</li>
              <li>✔ Bulk teacher seats</li>
            </ul>

            <button className="contact-btn">Contact Us</button>
          </div>

        </div>
      </div>

      <style jsx>{`
        .upgrade-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .upgrade-modal {
          width: 90%;
          max-width: 1100px;
          background: white;
          border-radius: 20px;
          padding: 36px;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          position: absolute;
          right: 20px;
          top: 20px;
          cursor: pointer;
        }

        .title {
          text-align: center;
          margin-bottom: 20px;
        }

        .billing-toggle {
          display: flex;
          justify-content: center;
          margin-bottom: 32px;
          background: #eef1ff;
          border-radius: 999px;
          padding: 6px;
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
        }

        .billing-toggle button {
          padding: 10px 22px;
          border-radius: 999px;
          border: none;
          background: transparent;
          cursor: pointer;
          font-weight: 600;
          color: #6b6f80;
        }

        .billing-toggle button.active {
          background: white;
          color: #333;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .discount {
          background: #4f46e5;
          color: white;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 0.75rem;
          margin-left: 6px;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }

        .plan-card {
          background: #fafafa;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid #e5e7eb;
          position: relative;
        }

        .plan-card.selected {
          border: 2px solid #4f46e5;
          background: #f4f4ff;
          box-shadow: 0 8px 20px rgba(79,70,229,0.15);
        }

        .badge {
          background: #4f46e5;
          color: white;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.75rem;
          position: absolute;
          top: -10px;
          left: 20px;
        }

        .price {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .features {
          margin: 16px 0 20px;
          padding: 0;
          list-style: none;
          color: #444;
        }

        .contact-btn,
        .disabled-btn {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: none;
          font-size: 1rem;
          margin-top: 10px;
          cursor: pointer;
        }

        .disabled-btn {
          background: #ddd;
          color: #777;
        }

        .contact-btn {
          background: #4f46e5;
          color: white;
        }

        .contact-btn:hover {
          background: #3f3ac9;
        }
      `}</style>
    </div>
  );
}
