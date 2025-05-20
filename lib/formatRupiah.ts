export const formatRupiah = (amount: Number, withPrefix: boolean = true): String => {
  const formatted = amount.toLocaleString('id-ID');
  return withPrefix ? `Rp${formatted}` : formatted
}
