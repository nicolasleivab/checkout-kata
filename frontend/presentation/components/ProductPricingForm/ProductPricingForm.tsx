import { useState } from "react";
import { useProductMutation } from "../../../services/useProductMutation";
import { SKUS } from "../../../types/products";
import styles from "./ProductPricingForm.module.css";

export function ProductPricingForm() {
  const [sku, setSku] = useState<(typeof SKUS)[number]>(SKUS[0]);
  const [unitPrice, setUnitPrice] = useState("");
  const [offerN, setOfferN] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [showForm, setShowForm] = useState(false);

  const { updatePricing, isLoading, error, isSuccess, reset } =
    useProductMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      unit_price: Math.round(parseFloat(unitPrice) * 100), // Convert to cents
      offer_n: offerN ? parseInt(offerN) : null,
      offer_price: offerPrice ? Math.round(parseFloat(offerPrice) * 100) : null, // Convert to cents
      sku,
    };

    updatePricing({
      sku,
      data,
      authToken: authToken || undefined,
    });
  };

  const handleReset = () => {
    setUnitPrice("");
    setOfferN("");
    setOfferPrice("");
    setAuthToken("");
    reset();
  };

  if (!showForm) {
    return (
      <div className={styles.container}>
        <button
          onClick={() => setShowForm(true)}
          className={styles.toggleButton}
        >
          🔧 Update Product Pricing
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Update Product Pricing</h3>
        <button
          onClick={() => setShowForm(false)}
          className={styles.closeButton}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="sku">Product SKU:</label>
          <select
            id="sku"
            value={sku}
            onChange={(e) => setSku(e.target.value as (typeof SKUS)[number])}
            required
          >
            {SKUS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="unitPrice">Unit Price ($):</label>
          <input
            id="unitPrice"
            type="number"
            min="0"
            step="0.01"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
            placeholder="e.g., 1.50"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="offerN">Offer Quantity (optional):</label>
          <input
            id="offerN"
            type="number"
            min="1"
            value={offerN}
            onChange={(e) => setOfferN(e.target.value)}
            placeholder="e.g., 3"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="offerPrice">Offer Price ($) (optional):</label>
          <input
            id="offerPrice"
            type="number"
            min="0"
            step="0.01"
            value={offerPrice}
            onChange={(e) => setOfferPrice(e.target.value)}
            placeholder="e.g., 4.00"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="authToken">Auth Token:</label>
          <select
            id="authToken"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            required
          >
            <option value="">Select a token...</option>
            <option value="admin-token">Admin Token (Full Access)</option>
            <option value="manager-token">
              Manager Token (Pricing Access)
            </option>
            <option value="user-token">User Token (Read Only)</option>
          </select>
        </div>

        {error && <div className={styles.error}>❌ Error: {error.message}</div>}

        {isSuccess && (
          <div className={styles.success}>✅ Pricing updated successfully!</div>
        )}

        <div className={styles.actions}>
          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? "Updating..." : "Update Pricing"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className={styles.resetButton}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
