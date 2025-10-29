"""
Hammadde girişlerini hesaplanan tüketimden oluştur
Tüketimden %30 fazla giriş yap ki stoklar pozitif olsun
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def create_material_entries():
    print("🧪 Hammadde girişleri hesaplanıyor...")
    
    # Toplam tüketimi hesapla
    consumptions = await db.daily_consumption.find({}).to_list(None)
    
    total_petkim = sum(c.get('petkim', 0) for c in consumptions)
    total_estol = sum(c.get('estol', 0) for c in consumptions)
    total_talk = sum(c.get('talk', 0) for c in consumptions)
    total_gaz = sum(c.get('gaz', 0) for c in consumptions)
    
    print(f"   Toplam Tüketim:")
    print(f"      PETKİM: {total_petkim:.2f} kg")
    print(f"      ESTOL: {total_estol:.2f} kg")
    print(f"      TALK: {total_talk:.2f} kg")
    print(f"      GAZ: {total_gaz:.2f} m³")
    
    # Masura kullanımını hesapla
    productions = await db.productions.find({}).to_list(None)
    masura_usage = {
        'masura100': 0,
        'masura120': 0,
        'masura150': 0,
        'masura200': 0
    }
    
    for p in productions:
        masura = p['masuraType'].lower().replace(' ', '')
        qty = p['quantity']
        if '100' in masura:
            masura_usage['masura100'] += qty
        elif '120' in masura:
            masura_usage['masura120'] += qty
        elif '150' in masura:
            masura_usage['masura150'] += qty
        elif '200' in masura:
            masura_usage['masura200'] += qty
    
    print(f"\n   Masura Kullanımı:")
    for key, val in masura_usage.items():
        print(f"      {key}: {val} adet")
    
    # Hammadde girişleri oluştur - tüketimden %30 fazla
    materials = []
    
    # Ana hammaddeler
    materials.append({
        'id': str(uuid.uuid4()),
        'date': '2025-09-01',
        'material': 'PETKİM LDPE',
        'quantity': round(total_petkim * 1.3, 2),
        'unitPrice': 2.85,
        'currency': 'USD',
        'supplier': 'PETKİM A.Ş.',
        'invoiceNo': 'PET-2025-001'
    })
    
    materials.append({
        'id': str(uuid.uuid4()),
        'date': '2025-09-01',
        'material': 'ESTOL',
        'quantity': round(total_estol * 1.3, 2),
        'unitPrice': 3.20,
        'currency': 'USD',
        'supplier': 'Kimya Tedarikçi',
        'invoiceNo': 'EST-2025-001'
    })
    
    materials.append({
        'id': str(uuid.uuid4()),
        'date': '2025-09-01',
        'material': 'TALK',
        'quantity': round(total_talk * 1.3, 2),
        'unitPrice': 1.50,
        'currency': 'USD',
        'supplier': 'Mineral A.Ş.',
        'invoiceNo': 'TAL-2025-001'
    })
    
    materials.append({
        'id': str(uuid.uuid4()),
        'date': '2025-09-01',
        'material': 'GAZ (N2)',
        'quantity': round(total_gaz * 1.3, 2),
        'unitPrice': 0.80,
        'currency': 'TL',
        'supplier': 'Gaz Tedarik',
        'invoiceNo': 'GAZ-2025-001'
    })
    
    # Masuralar - kullanımdan %20 fazla
    materials.append({
        'id': str(uuid.uuid4()),
        'date': '2025-09-05',
        'material': 'MASURA 100',
        'quantity': int(masura_usage['masura100'] * 1.2),
        'unitPrice': 2.50,
        'currency': 'TL',
        'supplier': 'Masura Üretici',
        'invoiceNo': 'MAS-2025-001'
    })
    
    materials.append({
        'id': str(uuid.uuid4()),
        'date': '2025-09-05',
        'material': 'MASURA 120',
        'quantity': int(masura_usage['masura120'] * 1.2),
        'unitPrice': 2.75,
        'currency': 'TL',
        'supplier': 'Masura Üretici',
        'invoiceNo': 'MAS-2025-002'
    })
    
    materials.append({
        'id': str(uuid.uuid4()),
        'date': '2025-09-05',
        'material': 'MASURA 150',
        'quantity': int(masura_usage['masura150'] * 1.2),
        'unitPrice': 3.00,
        'currency': 'TL',
        'supplier': 'Masura Üretici',
        'invoiceNo': 'MAS-2025-003'
    })
    
    materials.append({
        'id': str(uuid.uuid4()),
        'date': '2025-09-05',
        'material': 'MASURA 200',
        'quantity': int(masura_usage['masura200'] * 1.2),
        'unitPrice': 3.50,
        'currency': 'TL',
        'supplier': 'Masura Üretici',
        'invoiceNo': 'MAS-2025-004'
    })
    
    # SARI masterbatch (renklı üretim için)
    materials.append({
        'id': str(uuid.uuid4()),
        'date': '2025-09-10',
        'material': 'SARI MASTERBATCH',
        'quantity': 50.0,
        'unitPrice': 4.50,
        'currency': 'USD',
        'supplier': 'Renk Masterbatch',
        'invoiceNo': 'RNK-2025-001'
    })
    
    # Veritabanına kaydet
    await db.materials.delete_many({})
    await db.materials.insert_many(materials)
    
    print(f"\n   ✅ {len(materials)} hammadde giriş kaydı oluşturuldu")
    
    print(f"\n   📦 Hammadde Girişleri:")
    for mat in materials:
        print(f"      {mat['material']}: {mat['quantity']} {mat['currency']}")
    
    # Döviz kurları ekle
    exchange = {
        'usd': 34.75,
        'eur': 37.82,
        'lastUpdated': datetime.utcnow().isoformat()
    }
    
    await db.exchange_rates.delete_many({})
    await db.exchange_rates.insert_one(exchange)
    print(f"\n   ✅ Döviz kurları eklendi: USD={exchange['usd']}, EUR={exchange['eur']}")
    
    client.close()

async def main():
    print("=" * 70)
    print("🔄 HAMMADDE GİRİŞLERİ HESAPLANMASI")
    print("=" * 70)
    
    await create_material_entries()
    
    print("\n" + "=" * 70)
    print("✅ HAMMADDE GİRİŞLERİ BAŞARIYLA OLUŞTURULDU!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(main())
