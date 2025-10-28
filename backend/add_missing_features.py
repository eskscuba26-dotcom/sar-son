# Her sayfaya eklenecek ortak özellikler:
# 1. Excel'e aktar butonu ve fonksiyonu
# 2. Arama/filtre input
# 3. Düzenle butonu (Pencil icon)
# 4. Sil butonu (Trash2 icon)

pages_to_update = [
    "CutProducts.jsx",
    "Stock.jsx", 
    "Materials.jsx",
    "DailyConsumption.jsx",
    "CostAnalysis.jsx"
]

print("✅ Sayfalar güncelleniyor:")
for page in pages_to_update:
    print(f"  - {page}: Excel, Filtre, Düzenle, Sil özellikleri eklenecek")
