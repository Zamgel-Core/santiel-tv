export const WHATSAPP_NUMBER = "13468847800";

export const getWhatsAppLink = (message: string) => {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};