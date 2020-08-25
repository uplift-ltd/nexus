export const parseAmount = (amount: string) => {
  return Number(amount.replace(/[^0-9.]/g, ""));
};
