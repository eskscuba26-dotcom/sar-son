// Türkiye formatında para formatı: 1.234,56 TL
export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0,00';
  
  const number = parseFloat(value);
  return number.toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Sayı formatı: 1.234
export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0';
  
  const number = parseFloat(value);
  return number.toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
};
