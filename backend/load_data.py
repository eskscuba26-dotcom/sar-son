import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Üretim Kayıtları (49 kayıt)
production_data = [
    {'date': '2025-09-23', 'machine': 'Makine 2', 'thickness': '2 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 33, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-09-24', 'machine': 'Makine 2', 'thickness': '2 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 100, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-24', 'machine': 'Makine 2', 'thickness': '0.8 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 4, 'masuraType': 'Masura 120', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-09-25', 'machine': 'Makine 2', 'thickness': '1 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 100, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-09-25', 'machine': 'Makine 2', 'thickness': '0.8 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 8, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-09-26', 'machine': 'Makine 2', 'thickness': '1.8 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 61, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-09-26', 'machine': 'Makine 2', 'thickness': '1 mm', 'width': '100', 'length': '50', 'm2': 50.00, 'quantity': 50, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-09-26', 'machine': 'Makine 2', 'thickness': '1 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 4, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-09-26', 'machine': 'Makine 1', 'thickness': '2 mm', 'width': '110', 'length': '400', 'm2': 440.00, 'quantity': 22, 'masuraType': 'Masura 120', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-09-29', 'machine': 'Makine 1', 'thickness': '3 mm', 'width': '110', 'length': '150', 'm2': 165.00, 'quantity': 50, 'masuraType': 'Masura 120', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-09-29', 'machine': 'Makine 1', 'thickness': '4 mm', 'width': '110', 'length': '150', 'm2': 165.00, 'quantity': 25, 'masuraType': 'Masura 120', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-09-29', 'machine': 'Makine 1', 'thickness': '1 mm', 'width': '100', 'length': '250', 'm2': 250.00, 'quantity': 8, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-09-26', 'machine': 'Makine 2', 'thickness': '1 mm', 'width': '165', 'length': '495', 'm2': 816.75, 'quantity': 8, 'masuraType': 'Masura 200', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-09-30', 'machine': 'Makine 1', 'thickness': '1 mm', 'width': '110', 'length': '500', 'm2': 550.00, 'quantity': 43, 'masuraType': 'Masura 120', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-01', 'machine': 'Makine 1', 'thickness': '1 mm', 'width': '140', 'length': '200', 'm2': 280.00, 'quantity': 100, 'masuraType': 'Masura 150', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-01', 'machine': 'Makine 2', 'thickness': '2 mm', 'width': '200', 'length': '100', 'm2': 200.00, 'quantity': 3, 'masuraType': 'Masura 200', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-01', 'machine': 'Makine 2', 'thickness': '3 mm', 'width': '200', 'length': '100', 'm2': 200.00, 'quantity': 5, 'masuraType': 'Masura 200', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-01', 'machine': 'Makine 2', 'thickness': '1 mm', 'width': '200', 'length': '100', 'm2': 200.00, 'quantity': 4, 'masuraType': 'Masura 200', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-02', 'machine': 'Makine 1', 'thickness': '1.8 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 70, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'thickness': '2 mm', 'width': '120', 'length': '200', 'm2': 240.00, 'quantity': 6, 'masuraType': 'Masura 120', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'thickness': '3 mm', 'width': '120', 'length': '100', 'm2': 120.00, 'quantity': 5, 'masuraType': 'Masura 120', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'thickness': '4 mm', 'width': '120', 'length': '100', 'm2': 120.00, 'quantity': 5, 'masuraType': 'Masura 120', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'thickness': '5 mm', 'width': '120', 'length': '100', 'm2': 120.00, 'quantity': 4, 'masuraType': 'Masura 120', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'thickness': '1 mm', 'width': '120', 'length': '300', 'm2': 360.00, 'quantity': 6, 'masuraType': 'Masura 120', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-03', 'machine': 'Makine 2', 'thickness': '1.8 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 75, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-06', 'machine': 'Makine 2', 'thickness': '1.8 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 71, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-07', 'machine': 'Makine 2', 'thickness': '1.8 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 61, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-07', 'machine': 'Makine 2', 'thickness': '3 mm', 'width': '100', 'length': '100', 'm2': 100.00, 'quantity': 8, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-07', 'machine': 'Makine 2', 'thickness': '4 mm', 'width': '100', 'length': '100', 'm2': 100.00, 'quantity': 10, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-07', 'machine': 'Makine 2', 'thickness': '5 mm', 'width': '100', 'length': '100', 'm2': 100.00, 'quantity': 10, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-08', 'machine': 'Makine 2', 'thickness': '1.8 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 78, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-14', 'machine': 'Makine 2', 'thickness': '1 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 77, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-15', 'machine': 'Makine 2', 'thickness': '3 mm', 'width': '100', 'length': '100', 'm2': 100.00, 'quantity': 75, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-15', 'machine': 'Makine 2', 'thickness': '1 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 39, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-16', 'machine': 'Makine 2', 'thickness': '4 mm', 'width': '100', 'length': '100', 'm2': 100.00, 'quantity': 106, 'masuraType': 'Masura 120', 'color': 'Sarı', 'colorCategory': 'Renkli'},
    {'date': '2025-10-17', 'machine': 'Makine 2', 'thickness': '4 mm', 'width': '100', 'length': '100', 'm2': 100.00, 'quantity': 70, 'masuraType': 'Masura 100', 'color': 'Sarı', 'colorCategory': 'Renkli'},
    {'date': '2025-10-17', 'machine': 'Makine 2', 'thickness': '2 mm', 'width': '100', 'length': '100', 'm2': 100.00, 'quantity': 27, 'masuraType': 'Masura 100', 'color': 'Sarı', 'colorCategory': 'Renkli'},
    {'date': '2025-10-17', 'machine': 'Makine 2', 'thickness': '5 mm', 'width': '100', 'length': '100', 'm2': 100.00, 'quantity': 14, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-20', 'machine': 'Makine 2', 'thickness': '5 mm', 'width': '100', 'length': '100', 'm2': 100.00, 'quantity': 75, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-20', 'machine': 'Makine 2', 'thickness': '7 mm', 'width': '100', 'length': '50', 'm2': 50.00, 'quantity': 15, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-21', 'machine': 'Makine 1', 'thickness': '1 mm', 'width': '120', 'length': '300', 'm2': 360.00, 'quantity': 83, 'masuraType': 'Masura 120', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-22', 'machine': 'Makine 1', 'thickness': '1 mm', 'width': '120', 'length': '300', 'm2': 360.00, 'quantity': 78, 'masuraType': 'Masura 120', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-23', 'machine': 'Makine 2', 'thickness': '1 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 95, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-23', 'machine': 'Makine 2', 'thickness': '1.8 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 2, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-24', 'machine': 'Makine 1', 'thickness': '1 mm', 'width': '150', 'length': '80', 'm2': 120.00, 'quantity': 60, 'masuraType': 'Masura 150', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-24', 'machine': 'Makine 1', 'thickness': '1 mm', 'width': '150', 'length': '300', 'm2': 450.00, 'quantity': 13, 'masuraType': 'Masura 150', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-24', 'machine': 'Makine 1', 'thickness': '2 mm', 'width': '160', 'length': '200', 'm2': 320.00, 'quantity': 5, 'masuraType': 'Masura 150', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-24', 'machine': 'Makine 1', 'thickness': '0.8 mm', 'width': '160', 'length': '300', 'm2': 480.00, 'quantity': 25, 'masuraType': 'Masura 150', 'color': 'Doğal', 'colorCategory': 'Doğal'},
    {'date': '2025-10-27', 'machine': 'Makine 2', 'thickness': '0.8 mm', 'width': '100', 'length': '300', 'm2': 300.00, 'quantity': 89, 'masuraType': 'Masura 100', 'color': 'Doğal', 'colorCategory': 'Doğal'},
]

# Kesilmiş Ürün Kayıtları (4 kayıt)
cut_product_data = [
    {'date': '2025-10-07', 'material': '1.8mm x 100cm x 300m (300.00 m²)', 'cutSize': '1.8mm x 50cm x 137.5cm', 'quantity': 1744, 'usedMaterial': '4 adet', 'color': 'Doğal'},
    {'date': '2025-10-16', 'material': '1.8mm x 100cm x 300m (300.00 m²)', 'cutSize': '1.8mm x 50cm x 137.5cm', 'quantity': 2180, 'usedMaterial': '5 adet', 'color': 'Doğal'},
    {'date': '2025-10-16', 'material': '1.8mm x 100cm x 300m (300.00 m²)', 'cutSize': '1.8mm x 50cm x 137.5cm', 'quantity': 3488, 'usedMaterial': '8 adet', 'color': 'Doğal'},
    {'date': '2025-10-23', 'material': '1.8mm x 100cm x 300m (300.00 m²)', 'cutSize': '1.8mm x 50cm x 137.5cm', 'quantity': 5668, 'usedMaterial': '13 adet', 'color': 'Doğal'},
]

# Sevkiyat Kayıtları (24 kayıt)
shipment_data = [
    {'date': '2025-09-24', 'customer': 'RÖPLAST', 'type': 'Normal', 'size': '2mm x 100cm x 300m', 'm2': 300.00, 'quantity': 3, 'color': 'Doğal', 'waybill': '001'},
    {'date': '2025-09-26', 'customer': 'ESKİŞEHİR AMBALAJ', 'type': 'Normal', 'size': '0.8mm x 100cm x 300m', 'm2': 300.00, 'quantity': 9, 'color': 'Doğal', 'waybill': '002'},
    {'date': '2025-09-26', 'customer': 'ESKİŞEHİR AMBALAJ', 'type': 'Normal', 'size': '1mm x 100cm x 300m', 'm2': 300.00, 'quantity': 100, 'color': 'Doğal', 'waybill': '003'},
    {'date': '2025-09-29', 'customer': 'SERCAN ÖZDEMİR', 'type': 'Normal', 'size': '1mm x 100cm x 50m', 'm2': 50.00, 'quantity': 3, 'color': 'Doğal', 'waybill': '004'},
    {'date': '2025-09-29', 'customer': 'ESKİŞEHİR AMBALAJ', 'type': 'Normal', 'size': '1mm x 100cm x 50m', 'm2': 50.00, 'quantity': 2, 'color': 'Doğal', 'waybill': '005'},
    {'date': '2025-10-07', 'customer': 'RÖPLAST', 'type': 'Normal', 'size': '2mm x 100cm x 300m', 'm2': 300.00, 'quantity': 20, 'color': 'Doğal', 'waybill': 'OZI202000000030'},
    {'date': '2025-10-07', 'customer': 'ADEL AMBALAJ', 'type': 'Normal', 'size': '1mm x 140cm x 200m', 'm2': 280.00, 'quantity': 100, 'color': 'Doğal', 'waybill': 'OZI202000000029'},
    {'date': '2025-10-08', 'customer': 'ESKİŞEHİR AMBALAJ', 'type': 'Normal', 'size': '1mm x 100cm x 300m', 'm2': 300.00, 'quantity': 6, 'color': 'Doğal', 'waybill': '006'},
    {'date': '2025-10-09', 'customer': 'ESKİŞEHİR AMBALAJ', 'type': 'Normal', 'size': '1mm x 100cm x 250m', 'm2': 250.00, 'quantity': 4, 'color': 'Doğal', 'waybill': '007'},
    {'date': '2025-10-07', 'customer': 'RÖPLAST', 'type': 'Kesilmiş', 'size': '1.8mm x 50cm x 137.5cm', 'm2': 68.75, 'quantity': 1744, 'color': 'Doğal', 'waybill': 'OZI202000000031'},
    {'date': '2025-10-14', 'customer': 'ESKİŞEHİR AMBALAJ', 'type': 'Normal', 'size': '1mm x 140cm x 200m', 'm2': 280.00, 'quantity': 3, 'color': 'Doğal', 'waybill': '008'},
    {'date': '2025-10-21', 'customer': 'ANPAK', 'type': 'Normal', 'size': '1mm x 120cm x 300m', 'm2': 360.00, 'quantity': 25, 'color': 'Doğal', 'waybill': 'OZI2025000000048'},
    {'date': '2025-10-21', 'customer': 'ES DOĞAN', 'type': 'Normal', 'size': '1mm x 120cm x 300m', 'm2': 360.00, 'quantity': 5, 'color': 'Doğal', 'waybill': 'OZI2025000000042'},
    {'date': '2025-10-21', 'customer': 'ES DOĞAN', 'type': 'Normal', 'size': '1mm x 120cm x 300m', 'm2': 360.00, 'quantity': 5, 'color': 'Doğal', 'waybill': 'OZI2025000000047'},
    {'date': '2025-10-16', 'customer': 'RÖPLAST', 'type': 'Kesilmiş', 'size': '1.8mm x 50cm x 137.5cm', 'm2': 68.75, 'quantity': 2180, 'color': 'Doğal', 'waybill': 'OZI2025000000041'},
    {'date': '2025-10-16', 'customer': 'ES DOĞAN', 'type': 'Normal', 'size': '1mm x 120cm x 300m', 'm2': 360.00, 'quantity': 5, 'color': 'Doğal', 'waybill': 'OZI2025000000043'},
    {'date': '2025-10-23', 'customer': 'ESKİŞEHİR POLİMER', 'type': 'Normal', 'size': '4mm x 100cm x 100m', 'm2': 100.00, 'quantity': 19, 'color': 'Sarı', 'waybill': 'OZI2025000000049'},
    {'date': '2025-10-23', 'customer': 'SERCAN ÖZDEMİR', 'type': 'Normal', 'size': '4mm x 100cm x 100m', 'm2': 100.00, 'quantity': 2, 'color': 'Sarı', 'waybill': 'OZI2025000000050'},
    {'date': '2025-10-23', 'customer': 'ES DOĞAN', 'type': 'Normal', 'size': '1mm x 120cm x 300m', 'm2': 360.00, 'quantity': 5, 'color': 'Doğal', 'waybill': 'OZI2025000000051'},
    {'date': '2025-10-23', 'customer': 'RÖPLAST', 'type': 'Kesilmiş', 'size': '1.8mm x 50cm x 137.5cm', 'm2': 68.75, 'quantity': 5668, 'color': 'Doğal', 'waybill': 'OZI2025000000052'},
    {'date': '2025-10-24', 'customer': 'ESKİŞEHİR POLİMER', 'type': 'Normal', 'size': '1mm x 100cm x 300m', 'm2': 300.00, 'quantity': 1, 'color': 'Doğal', 'waybill': 'OZI2025000000053'},
    {'date': '2025-10-24', 'customer': 'ES DOĞAN', 'type': 'Normal', 'size': '1mm x 120cm x 300m', 'm2': 360.00, 'quantity': 5, 'color': 'Doğal', 'waybill': 'OZI2025000000054'},
    {'date': '2025-10-24', 'customer': 'ES DOĞAN', 'type': 'Normal', 'size': '1mm x 150cm x 80m', 'm2': 120.00, 'quantity': 50, 'color': 'Doğal', 'waybill': 'OZI2025000000055'},
    {'date': '2025-10-24', 'customer': 'ES DOĞAN', 'type': 'Normal', 'size': '1mm x 120cm x 300m', 'm2': 360.00, 'quantity': 30, 'color': 'Doğal', 'waybill': 'OZI2025000000055'},
]

async def load_data():
    print("🔄 Veritabanı temizleniyor...")
    await db.productions.delete_many({})
    await db.cut_products.delete_many({})
    await db.shipments.delete_many({})
    
    print("\n📊 Üretim kayıtları yükleniyor...")
    for prod in production_data:
        prod['id'] = str(uuid.uuid4())
        prod['created_at'] = '2025-10-28T00:00:00Z'
        await db.productions.insert_one(prod)
    print(f"✅ {len(production_data)} üretim kaydı yüklendi!")
    
    print("\n✂️ Kesilmiş ürün kayıtları yükleniyor...")
    for cut in cut_product_data:
        cut['id'] = str(uuid.uuid4())
        cut['created_at'] = '2025-10-28T00:00:00Z'
        await db.cut_products.insert_one(cut)
    print(f"✅ {len(cut_product_data)} kesilmiş ürün kaydı yüklendi!")
    
    print("\n🚚 Sevkiyat kayıtları yükleniyor...")
    for ship in shipment_data:
        ship['id'] = str(uuid.uuid4())
        ship['created_at'] = '2025-10-28T00:00:00Z'
        await db.shipments.insert_one(ship)
    print(f"✅ {len(shipment_data)} sevkiyat kaydı yüklendi!")
    
    # Verify
    prod_count = await db.productions.count_documents({})
    cut_count = await db.cut_products.count_documents({})
    ship_count = await db.shipments.count_documents({})
    
    print(f"\n✅ Doğrulama:")
    print(f"   - {prod_count} üretim kaydı")
    print(f"   - {cut_count} kesilmiş ürün kaydı")
    print(f"   - {ship_count} sevkiyat kaydı")
    print(f"\n🎉 Toplam {prod_count + cut_count + ship_count} kayıt başarıyla yüklendi!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(load_data())
