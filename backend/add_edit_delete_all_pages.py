# Bu script tüm sayfaları kontrol eder ve eksik Düzenle/Sil butonlarını raporlar
import os

pages_to_check = [
    'Production.jsx',
    'CutProducts.jsx', 
    'Shipment.jsx',
    'Materials.jsx',
    'DailyConsumption.jsx'
]

print('=== DÜZENLE/SİL BUTON KONTROLÜ ===')
for page in pages_to_check:
    path = f'/app/frontend/src/pages/{page}'
    if os.path.exists(path):
        with open(path, 'r') as f:
            content = f.read()
            has_edit = 'Edit2' in content or 'Pencil' in content or 'düzenle' in content.lower()
            has_delete = 'Trash' in content or 'sil' in content.lower()
            print(f'{page}: Edit={"✅" if has_edit else "❌"}, Delete={"✅" if has_delete else "❌"}')
