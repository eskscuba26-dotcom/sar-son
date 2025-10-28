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

# Günlük Tüketim Kayıtları (30 kayıt)
daily_consumption_data = [
    {'date': '2025-09-23', 'machine': 'Makine 2', 'material': 'GAZ', 'consumed': 125.50, 'unit': 'Kilogram'},
    {'date': '2025-09-23', 'machine': 'Makine 2', 'material': 'PETKİM', 'consumed': 850.00, 'unit': 'Kilogram'},
    {'date': '2025-09-23', 'machine': 'Makine 2', 'material': 'ESTOL', 'consumed': 35.00, 'unit': 'Kilogram'},
    {'date': '2025-09-24', 'machine': 'Makine 2', 'material': 'GAZ', 'consumed': 380.00, 'unit': 'Kilogram'},
    {'date': '2025-09-24', 'machine': 'Makine 2', 'material': 'PETKİM', 'consumed': 2600.00, 'unit': 'Kilogram'},
    {'date': '2025-09-24', 'machine': 'Makine 2', 'material': 'ESTOL', 'consumed': 105.00, 'unit': 'Kilogram'},
    {'date': '2025-09-25', 'machine': 'Makine 2', 'material': 'GAZ', 'consumed': 410.40, 'unit': 'Kilogram'},
    {'date': '2025-09-25', 'machine': 'Makine 2', 'material': 'PETKİM', 'consumed': 2808.00, 'unit': 'Kilogram'},
    {'date': '2025-09-25', 'machine': 'Makine 2', 'material': 'ESTOL', 'consumed': 113.40, 'unit': 'Kilogram'},
    {'date': '2025-09-26', 'machine': 'Makine 1', 'material': 'GAZ', 'consumed': 166.80, 'unit': 'Kilogram'},
    {'date': '2025-09-26', 'machine': 'Makine 1', 'material': 'PETKİM', 'consumed': 1140.80, 'unit': 'Kilogram'},
    {'date': '2025-09-26', 'machine': 'Makine 1', 'material': 'ESTOL', 'consumed': 46.08, 'unit': 'Kilogram'},
    {'date': '2025-09-26', 'machine': 'Makine 2', 'material': 'GAZ', 'consumed': 436.80, 'unit': 'Kilogram'},
    {'date': '2025-09-26', 'machine': 'Makine 2', 'material': 'PETKİM', 'consumed': 2988.00, 'unit': 'Kilogram'},
    {'date': '2025-09-26', 'machine': 'Makine 2', 'material': 'ESTOL', 'consumed': 120.60, 'unit': 'Kilogram'},
    {'date': '2025-10-01', 'machine': 'Makine 1', 'material': 'GAZ', 'consumed': 380.00, 'unit': 'Kilogram'},
    {'date': '2025-10-01', 'machine': 'Makine 1', 'material': 'PETKİM', 'consumed': 2600.00, 'unit': 'Kilogram'},
    {'date': '2025-10-01', 'machine': 'Makine 1', 'material': 'ESTOL', 'consumed': 105.00, 'unit': 'Kilogram'},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'material': 'GAZ', 'consumed': 285.60, 'unit': 'Kilogram'},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'material': 'PETKİM', 'consumed': 1954.40, 'unit': 'Kilogram'},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'material': 'ESTOL', 'consumed': 78.96, 'unit': 'Kilogram'},
    {'date': '2025-10-15', 'machine': 'Makine 2', 'material': 'GAZ', 'consumed': 433.60, 'unit': 'Kilogram'},
    {'date': '2025-10-15', 'machine': 'Makine 2', 'material': 'PETKİM', 'consumed': 2966.40, 'unit': 'Kilogram'},
    {'date': '2025-10-15', 'machine': 'Makine 2', 'material': 'ESTOL', 'consumed': 119.84, 'unit': 'Kilogram'},
    {'date': '2025-10-16', 'machine': 'Makine 2', 'material': 'GAZ', 'consumed': 403.20, 'unit': 'Kilogram'},
    {'date': '2025-10-16', 'machine': 'Makine 2', 'material': 'PETKİM', 'consumed': 2758.40, 'unit': 'Kilogram'},
    {'date': '2025-10-16', 'machine': 'Makine 2', 'material': 'SARI', 'consumed': 10.00, 'unit': 'Kilogram'},
    {'date': '2025-10-17', 'machine': 'Makine 2', 'material': 'GAZ', 'consumed': 421.20, 'unit': 'Kilogram'},
    {'date': '2025-10-17', 'machine': 'Makine 2', 'material': 'PETKİM', 'consumed': 2881.20, 'unit': 'Kilogram'},
    {'date': '2025-10-17', 'machine': 'Makine 2', 'material': 'SARI', 'consumed': 15.00, 'unit': 'Kilogram'},
]

# Maliyet Analizi Kayıtları (15 kayıt)
cost_analysis_data = [
    {'date': '2025-09-23', 'product': '2mm x 100cm x 300m', 'quantity': 33, 'materialCost': 11935.50, 'laborCost': 1650.00, 'energyCost': 825.00, 'otherCost': 330.00, 'totalCost': 14740.50, 'unitCost': 446.68},
    {'date': '2025-09-24', 'product': '2mm x 100cm x 300m', 'quantity': 100, 'materialCost': 36195.00, 'laborCost': 5000.00, 'energyCost': 2500.00, 'otherCost': 1000.00, 'totalCost': 44695.00, 'unitCost': 446.95},
    {'date': '2025-09-25', 'product': '1mm x 100cm x 300m', 'quantity': 100, 'materialCost': 39049.80, 'laborCost': 5000.00, 'energyCost': 2500.00, 'otherCost': 1000.00, 'totalCost': 47549.80, 'unitCost': 475.50},
    {'date': '2025-09-25', 'product': '0.8mm x 100cm x 300m', 'quantity': 8, 'materialCost': 3123.98, 'laborCost': 400.00, 'energyCost': 200.00, 'otherCost': 80.00, 'totalCost': 3803.98, 'unitCost': 475.50},
    {'date': '2025-09-26', 'product': '2mm x 110cm x 400m', 'quantity': 22, 'materialCost': 10594.18, 'laborCost': 1100.00, 'energyCost': 550.00, 'otherCost': 220.00, 'totalCost': 12464.18, 'unitCost': 566.55},
    {'date': '2025-09-26', 'product': '1.8mm x 100cm x 300m', 'quantity': 61, 'materialCost': 29029.32, 'laborCost': 3050.00, 'energyCost': 1525.00, 'otherCost': 610.00, 'totalCost': 34214.32, 'unitCost': 560.89},
    {'date': '2025-10-01', 'product': '1mm x 140cm x 200m', 'quantity': 100, 'materialCost': 47549.80, 'laborCost': 5000.00, 'energyCost': 2500.00, 'otherCost': 1000.00, 'totalCost': 56049.80, 'unitCost': 560.50},
    {'date': '2025-10-01', 'product': '2mm x 200cm x 100m', 'quantity': 3, 'materialCost': 1426.49, 'laborCost': 150.00, 'energyCost': 75.00, 'otherCost': 30.00, 'totalCost': 1681.49, 'unitCost': 560.50},
    {'date': '2025-10-02', 'product': '1.8mm x 100cm x 300m', 'quantity': 70, 'materialCost': 33301.82, 'laborCost': 3500.00, 'energyCost': 1750.00, 'otherCost': 700.00, 'totalCost': 39251.82, 'unitCost': 560.74},
    {'date': '2025-10-15', 'product': '3mm x 100cm x 100m', 'quantity': 75, 'materialCost': 35676.32, 'laborCost': 3750.00, 'energyCost': 1875.00, 'otherCost': 750.00, 'totalCost': 42051.32, 'unitCost': 560.68},
    {'date': '2025-10-15', 'product': '1mm x 100cm x 300m', 'quantity': 39, 'materialCost': 18544.42, 'laborCost': 1950.00, 'energyCost': 975.00, 'otherCost': 390.00, 'totalCost': 21859.42, 'unitCost': 560.50},
    {'date': '2025-10-16', 'product': '4mm x 100cm x 100m (Sarı)', 'quantity': 106, 'materialCost': 51089.84, 'laborCost': 5300.00, 'energyCost': 2650.00, 'otherCost': 1060.00, 'totalCost': 60099.84, 'unitCost': 566.98},
    {'date': '2025-10-21', 'product': '1mm x 120cm x 300m', 'quantity': 83, 'materialCost': 39466.17, 'laborCost': 4150.00, 'energyCost': 2075.00, 'otherCost': 830.00, 'totalCost': 46521.17, 'unitCost': 560.50},
    {'date': '2025-10-23', 'product': '1mm x 100cm x 300m', 'quantity': 95, 'materialCost': 45174.31, 'laborCost': 4750.00, 'energyCost': 2375.00, 'otherCost': 950.00, 'totalCost': 53249.31, 'unitCost': 560.52},
    {'date': '2025-10-24', 'product': '1mm x 150cm x 80m', 'quantity': 60, 'materialCost': 28529.88, 'laborCost': 3000.00, 'energyCost': 1500.00, 'otherCost': 600.00, 'totalCost': 33629.88, 'unitCost': 560.50},
]

async def load_consumption_and_cost_data():
    print("🔄 Günlük Tüketim ve Maliyet verileri yükleniyor...\n")
    
    # Günlük Tüketim
    print("📊 Günlük Tüketim kayıtları yükleniyor...")
    await db.daily_consumption.delete_many({})
    for item in daily_consumption_data:
        item['id'] = str(uuid.uuid4())
        item['created_at'] = '2025-10-28T00:00:00Z'
        await db.daily_consumption.insert_one(item)
    print(f"✅ {len(daily_consumption_data)} günlük tüketim kaydı yüklendi!")
    
    # Maliyet Analizi
    print("\n💰 Maliyet analizi kayıtları yükleniyor...")
    await db.cost_analysis.delete_many({})
    for item in cost_analysis_data:
        item['id'] = str(uuid.uuid4())
        item['created_at'] = '2025-10-28T00:00:00Z'
        await db.cost_analysis.insert_one(item)
    print(f"✅ {len(cost_analysis_data)} maliyet analizi kaydı yüklendi!")
    
    # Doğrulama
    consumption_count = await db.daily_consumption.count_documents({})
    cost_count = await db.cost_analysis.count_documents({})
    
    print(f"\n✅ Doğrulama:")
    print(f"   - {consumption_count} günlük tüketim kaydı")
    print(f"   - {cost_count} maliyet analizi kaydı")
    print(f"\n🎉 Toplam {consumption_count + cost_count} kayıt başarıyla yüklendi!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(load_consumption_and_cost_data())
