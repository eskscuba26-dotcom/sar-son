import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Hammadde Girişleri (9 kayıt)
materials_data = [
    {'date': '2025-09-18', 'material': 'GAZ', 'entryType': 'Giriş', 'quantity': 5000, 'unit': 'Kilogram', 'unitPrice': 36.06, 'currency': 'TL', 'totalPrice': 180283.50, 'exchangeRate': 1.00, 'supplier': 'Tedarikçi 1'},
    {'date': '2025-09-18', 'material': 'PETKİM', 'entryType': 'Giriş', 'quantity': 25500, 'unit': 'Kilogram', 'unitPrice': 1.24, 'currency': 'USD', 'totalPrice': 31620.00, 'exchangeRate': 1.00, 'supplier': 'Tedarikçi 2'},
    {'date': '2025-09-18', 'material': 'ESTOL', 'entryType': 'Giriş', 'quantity': 1000, 'unit': 'Kilogram', 'unitPrice': 2.30, 'currency': 'USD', 'totalPrice': 2300.00, 'exchangeRate': 42.00, 'supplier': 'Tedarikçi 3'},
    {'date': '2025-09-18', 'material': 'TALK', 'entryType': 'Giriş', 'quantity': 500, 'unit': 'Kilogram', 'unitPrice': 2.15, 'currency': 'EUR', 'totalPrice': 1075.00, 'exchangeRate': 48.00, 'supplier': 'Tedarikçi 4'},
    {'date': '2025-09-18', 'material': 'MASURA 100', 'entryType': 'Giriş', 'quantity': 2500, 'unit': 'Adet', 'unitPrice': 13.00, 'currency': 'TL', 'totalPrice': 32500.00, 'exchangeRate': 1.00, 'supplier': 'Tedarikçi 5'},
    {'date': '2025-09-18', 'material': 'MASURA 120', 'entryType': 'Giriş', 'quantity': 1000, 'unit': 'Adet', 'unitPrice': 16.00, 'currency': 'TL', 'totalPrice': 16000.00, 'exchangeRate': 1.00, 'supplier': 'Tedarikçi 5'},
    {'date': '2025-09-18', 'material': 'MASURA 150', 'entryType': 'Giriş', 'quantity': 310, 'unit': 'Adet', 'unitPrice': 20.00, 'currency': 'TL', 'totalPrice': 6200.00, 'exchangeRate': 1.00, 'supplier': 'Tedarikçi 5'},
    {'date': '2025-09-18', 'material': 'MASURA 200', 'entryType': 'Giriş', 'quantity': 200, 'unit': 'Adet', 'unitPrice': 26.00, 'currency': 'TL', 'totalPrice': 5200.00, 'exchangeRate': 1.00, 'supplier': 'Tedarikçi 5'},
    {'date': '2025-10-16', 'material': 'SARI', 'entryType': 'Giriş', 'quantity': 25, 'unit': 'Kilogram', 'unitPrice': 5.00, 'currency': 'TL', 'totalPrice': 125.00, 'exchangeRate': 1.00, 'supplier': 'Tedarikçi 6'},
]

# Döviz Kurları
exchange_rates_data = {
    'usd': 42.00,
    'eur': 48.00,
    'lastUpdated': '2025-10-28T10:23:43',
    'updatedBy': 'admin'
}

# Kullanıcılar - KULLANICININ GERÇEK BİLGİLERİ
# ⚠️ ÖNEMLİ: Bu bilgileri DEĞİŞTİRMEYİN!
# Admin: Mehmet / 141413DOa.
users_data = [
    {
        'username': 'Mehmet', 
        'password': '$2b$12$bOplS.wkea4RiPysW6i4N.QGSkNY.QFVTpE0SqSjwnn6LyhhivXQi',  # 141413DOa. (hashli)
        'name': 'Mehmet', 
        'role': 'admin', 
        'createdAt': '2025-10-29'
    }
]

async def load_additional_data():
    print("🔄 Ek veriler yükleniyor...\n")
    
    # Hammadde kayıtları
    print("📦 Hammadde kayıtları yükleniyor...")
    await db.materials.delete_many({})
    for mat in materials_data:
        mat['id'] = str(uuid.uuid4())
        mat['created_at'] = '2025-10-28T00:00:00Z'
        await db.materials.insert_one(mat)
    print(f"✅ {len(materials_data)} hammadde kaydı yüklendi!")
    
    # Döviz kurları
    print("\n💱 Döviz kurları yükleniyor...")
    await db.exchange_rates.delete_many({})
    exchange_rates_data['id'] = str(uuid.uuid4())
    await db.exchange_rates.insert_one(exchange_rates_data)
    print(f"✅ Döviz kurları güncellendi: USD={exchange_rates_data['usd']} TL, EUR={exchange_rates_data['eur']} TL")
    
    # Kullanıcılar
    print("\n👥 Kullanıcılar yükleniyor...")
    await db.users.delete_many({})
    for user in users_data:
        user['id'] = str(uuid.uuid4())
        user['created_at'] = '2025-10-28T00:00:00Z'
        await db.users.insert_one(user)
    print(f"✅ {len(users_data)} kullanıcı kaydı yüklendi!")
    
    # Doğrulama
    mat_count = await db.materials.count_documents({})
    rate_count = await db.exchange_rates.count_documents({})
    user_count = await db.users.count_documents({})
    
    print(f"\n✅ Doğrulama:")
    print(f"   - {mat_count} hammadde kaydı")
    print(f"   - {rate_count} döviz kuru kaydı")
    print(f"   - {user_count} kullanıcı kaydı")
    print(f"\n🎉 Tüm ek veriler başarıyla yüklendi!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(load_additional_data())
