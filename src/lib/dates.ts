export const getDaysRemaining = (expirationDate?: string | null) => {
  if (!expirationDate) return "Activo sin vencimiento";

  const today = new Date();
  const expiration = new Date(expirationDate);

  const diffTime = expiration.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "Cuenta vencida";
  if (diffDays === 0) return "Vence hoy";
  if (diffDays === 1) return "Te queda 1 día";

  return `Te quedan ${diffDays} días`;
};