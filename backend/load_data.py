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

# Üretim Kayıtları
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

async def load_data():
    print("🔄 Veritabanı temizleniyor...")
    await db.productions.delete_many({})
    
    print("📊 Üretim kayıtları yükleniyor...")
    for prod in production_data:
        prod['id'] = str(uuid.uuid4())
        prod['created_at'] = '2025-10-28T00:00:00Z'
        await db.productions.insert_one(prod)
    
    print(f"✅ {len(production_data)} üretim kaydı yüklendi!")
    
    # Verify
    count = await db.productions.count_documents({})
    print(f"✅ Doğrulama: {count} kayıt veritabanında")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(load_data())
