// Türkiye formatında para formatı: 1.234,56 TL
export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0,00';
  
  const number = parseFloat(value);
  // Önce 2 ondalığa yuvarla
  const rounded = Math.round(number * 100) / 100;
  // Tam ve ondalık kısmı ayır
  const [intPart, decPart] = rounded.toFixed(2).split('.');
  // Binlik ayracı ekle
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted},${decPart}`;
};

// Sayı formatı: 1.234
export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0';
  
  const number = parseInt(value);
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
