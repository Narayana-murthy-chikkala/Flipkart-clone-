/**
 * Generate unique order ID
 * Format: ORD-XXXX-XXXXXXXXXXXXXXXXX (ORD- + random alphanumeric)
 */
export const generateOrderId = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${random}-${timestamp}`;
};
