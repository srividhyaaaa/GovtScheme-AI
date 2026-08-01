/**
 * Extracts a human-readable error message from an API or network error,
 * and logs details to the console for debugging.
 *
 * @param {Error|Object} err - The caught error object
 * @param {string} fallbackMsg - Default fallback message if no specific error is found
 * @returns {string} Human-readable error message
 */
export const getErrorMessage = (err, fallbackMsg = "An unexpected error occurred.") => {
  // Always log error to console for debugging
  console.error("🔒 Auth API Error:", err);

  if (err?.response) {
    const data = err.response.data;

    // 1. Direct top-level message string from backend
    if (data?.message && typeof data.message === "string") {
      return data.message;
    }

    // 2. express-validator errors array
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      const messages = data.errors
        .map((e) => e.msg || e.message)
        .filter(Boolean);
      if (messages.length > 0) {
        return messages.join(", ");
      }
    }

    // 3. Direct error property
    if (data?.error && typeof data.error === "string") {
      return data.error;
    }

    // 4. HTTP status code based fallback messages
    const status = err.response.status;
    if (status === 400) return "Validation failed. Please check your inputs.";
    if (status === 401) return "Invalid credentials.";
    if (status === 409) return "User already exists with this email.";
    if (status >= 500) return "Server error. Please try again later.";
  }

  // Network or connectivity issue
  if (err?.request) {
    return "Unable to connect to the server. Please check your network connection.";
  }

  return err?.message || fallbackMsg;
};
