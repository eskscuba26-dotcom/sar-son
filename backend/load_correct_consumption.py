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

# DOĞRU Günlük Tüketim Kayıtları (Excel'den alındı)
daily_consumption_data = [
    {'date': '2025-09-23', 'machine': 'Makine 2', 'totalProduction': 9900.00, 'petkim': 1350.00, 'estol': 40.50, 'talk': 20.25, 'fire': 0.00},
    {'date': '2025-09-24', 'machine': 'Makine 2', 'totalProduction': 30000.00, 'petkim': 425.00, 'estol': 12.75, 'talk': 6.38, 'fire': 0.00},
    {'date': '2025-09-25', 'machine': 'Makine 2', 'totalProduction': 32400.00, 'petkim': 675.00, 'estol': 20.25, 'talk': 10.13, 'fire': 0.00},
    {'date': '2025-09-26', 'machine': 'Makine 1', 'totalProduction': 38214.00, 'petkim': 725.00, 'estol': 21.75, 'talk': 10.88, 'fire': 0.00},
    {'date': '2025-09-26', 'machine': 'Makine 2', 'totalProduction': 38214.00, 'petkim': 350.00, 'estol': 10.50, 'talk': 5.25, 'fire': 0.00},
    {'date': '2025-09-29', 'machine': 'Makine 1', 'totalProduction': 14850.00, 'petkim': 325.00, 'estol': 9.75, 'talk': 4.88, 'fire': 0.00},
    {'date': '2025-09-29', 'machine': 'Makine 1', 'totalProduction': 3712.50, 'petkim': 81.25, 'estol': 2.44, 'talk': 1.22, 'fire': 0.00},
    {'date': '2025-09-29', 'machine': 'Makine 1', 'totalProduction': 2000.00, 'petkim': 50.00, 'estol': 1.50, 'talk': 0.75, 'fire': 0.00},
    {'date': '2025-09-26', 'machine': 'Makine 2', 'totalProduction': 6533.25, 'petkim': 195.99, 'estol': 5.88, 'talk': 2.94, 'fire': 0.00},
    {'date': '2025-09-30', 'machine': 'Makine 1', 'totalProduction': 23650.00, 'petkim': 1125.00, 'estol': 33.75, 'talk': 16.88, 'fire': 0.00},
    {'date': '2025-10-01', 'machine': 'Makine 1', 'totalProduction': 28000.00, 'petkim': 775.00, 'estol': 23.25, 'talk': 11.63, 'fire': 0.00},
    {'date': '2025-10-01', 'machine': 'Makine 2', 'totalProduction': 600.00, 'petkim': 13.50, 'estol': 0.41, 'talk': 0.20, 'fire': 0.00},
    {'date': '2025-10-01', 'machine': 'Makine 2', 'totalProduction': 1000.00, 'petkim': 22.50, 'estol': 0.68, 'talk': 0.34, 'fire': 0.00},
    {'date': '2025-10-01', 'machine': 'Makine 2', 'totalProduction': 800.00, 'petkim': 18.00, 'estol': 0.54, 'talk': 0.27, 'fire': 0.00},
    {'date': '2025-10-02', 'machine': 'Makine 1', 'totalProduction': 21000.00, 'petkim': 1050.00, 'estol': 31.50, 'talk': 15.75, 'fire': 0.00},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'totalProduction': 1440.00, 'petkim': 32.40, 'estol': 0.97, 'talk': 0.49, 'fire': 0.00},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'totalProduction': 600.00, 'petkim': 13.50, 'estol': 0.41, 'talk': 0.20, 'fire': 0.00},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'totalProduction': 600.00, 'petkim': 13.50, 'estol': 0.41, 'talk': 0.20, 'fire': 0.00},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'totalProduction': 480.00, 'petkim': 10.80, 'estol': 0.32, 'talk': 0.16, 'fire': 0.00},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'totalProduction': 2160.00, 'petkim': 48.60, 'estol': 1.46, 'talk': 0.73, 'fire': 0.00},
    {'date': '2025-10-03', 'machine': 'Makine 2', 'totalProduction': 22500.00, 'petkim': 1125.00, 'estol': 33.75, 'talk': 16.88, 'fire': 0.00},
    {'date': '2025-10-06', 'machine': 'Makine 2', 'totalProduction': 21300.00, 'petkim': 1065.00, 'estol': 31.95, 'talk': 15.98, 'fire': 0.00},
    {'date': '2025-10-07', 'machine': 'Makine 2', 'totalProduction': 18300.00, 'petkim': 915.00, 'estol': 27.45, 'talk': 13.73, 'fire': 0.00},
    {'date': '2025-10-07', 'machine': 'Makine 2', 'totalProduction': 800.00, 'petkim': 18.00, 'estol': 0.54, 'talk': 0.27, 'fire': 0.00},
    {'date': '2025-10-07', 'machine': 'Makine 2', 'totalProduction': 1000.00, 'petkim': 22.50, 'estol': 0.68, 'talk': 0.34, 'fire': 0.00},
    {'date': '2025-10-07', 'machine': 'Makine 2', 'totalProduction': 1000.00, 'petkim': 22.50, 'estol': 0.68, 'talk': 0.34, 'fire': 0.00},
    {'date': '2025-10-08', 'machine': 'Makine 2', 'totalProduction': 23400.00, 'petkim': 1170.00, 'estol': 35.10, 'talk': 17.55, 'fire': 0.00},
    {'date': '2025-10-23', 'machine': 'Makine 1', 'totalProduction': 29100.00, 'petkim': 14.86, 'estol': 0.45, 'talk': 0.22, 'fire': 0.00},
    {'date': '2025-10-24', 'machine': 'Makine 1', 'totalProduction': 27850.00, 'petkim': 686.32, 'estol': 20.59, 'talk': 10.29, 'fire': 70.00},
    {'date': '2025-10-27', 'machine': 'Makine 2', 'totalProduction': 26700.00, 'petkim': 526.86, 'estol': 15.81, 'talk': 7.90, 'fire': 25.00},
]

async def load_correct_consumption_data():
    print("🔄 DOĞRU Günlük Tüketim verileri yükleniyor...\n")
    
    await db.daily_consumption.delete_many({})
    
    for item in daily_consumption_data:
        item['id'] = str(uuid.uuid4())
        item['created_at'] = '2025-10-28T00:00:00Z'
        await db.daily_consumption.insert_one(item)
    
    print(f"✅ {len(daily_consumption_data)} günlük tüketim kaydı yüklendi!")
    
    # Toplamları hesapla
    total_petkim = sum([d['petkim'] for d in daily_consumption_data])
    total_estol = sum([d['estol'] for d in daily_consumption_data])
    total_talk = sum([d['talk'] for d in daily_consumption_data])
    total_fire = sum([d['fire'] for d in daily_consumption_data])
    total_production = sum([d['totalProduction'] for d in daily_consumption_data])
    
    print(f"\n📊 TOPLAMLAR:")
    print(f"   - Toplam Üretim: {total_production:,.2f} m²")
    print(f"   - Petkim: {total_petkim:,.2f} kg")
    print(f"   - Estol: {total_estol:,.2f} kg")
    print(f"   - Talk: {total_talk:,.2f} kg")
    print(f"   - Fire: {total_fire:,.2f} kg")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(load_correct_consumption_data())
