"""
Üretim verilerinden günlük tüketimi hesapla
Her tarih + makine kombinasyonu için toplam m²'ye göre hammadde tüketimi
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

async def calculate_consumption():
    print("📉 Üretimden günlük tüketim hesaplanıyor...")
    
    # Tüm üretimleri al
    productions = await db.productions.find({}).to_list(None)
    
    # Tarih + Makine kombinasyonlarına göre grupla
    daily_groups = {}
    
    for prod in productions:
        key = f"{prod['date']}_{prod['machine']}"
        
        if key not in daily_groups:
            daily_groups[key] = {
                'date': prod['date'],
                'machine': prod['machine'],
                'total_m2': 0,
                'total_quantity': 0
            }
        
        daily_groups[key]['total_m2'] += prod['m2']
        daily_groups[key]['total_quantity'] += prod['quantity']
    
    print(f"   Toplam {len(daily_groups)} günlük üretim kaydı bulundu")
    
    # Her grup için hammadde tüketimini hesapla
    # Standart formül: 100 m² başına ortalama tüketim
    consumptions = []
    
    for key, group in daily_groups.items():
        m2 = group['total_m2']
        
        # Hammadde tüketim formülleri (100 m² bazında)
        # Bu değerler sektör ortalaması - gerçek değerler fabrikaya göre değişir
        petkim = (m2 / 100) * 18.5  # kg
        estol = (m2 / 100) * 0.92    # kg  
        talk = (m2 / 100) * 1.48     # kg
        gaz = (m2 / 100) * 2.05      # m³
        
        consumption = {
            'id': str(uuid.uuid4()),
            'date': group['date'],
            'machine': group['machine'],
            'petkim': round(petkim, 2),
            'estol': round(estol, 2),
            'talk': round(talk, 2),
            'gaz': round(gaz, 2),
            'notes': f"Üretim: {group['total_quantity']} adet, {m2:.2f} m²"
        }
        
        consumptions.append(consumption)
    
    # Mevcut günlük tüketimi sil ve yenilerini ekle
    await db.daily_consumption.delete_many({})
    await db.daily_consumption.insert_many(consumptions)
    
    print(f"   ✅ {len(consumptions)} günlük tüketim kaydı oluşturuldu")
    
    # Toplam tüketimi göster
    total_petkim = sum(c['petkim'] for c in consumptions)
    total_estol = sum(c['estol'] for c in consumptions)
    total_talk = sum(c['talk'] for c in consumptions)
    total_gaz = sum(c['gaz'] for c in consumptions)
    
    print(f"\n   📊 Toplam Hesaplanan Tüketim:")
    print(f"      PETKİM: {total_petkim:.2f} kg")
    print(f"      ESTOL: {total_estol:.2f} kg")
    print(f"      TALK: {total_talk:.2f} kg")
    print(f"      GAZ: {total_gaz:.2f} m³")
    
    # Günlük tüketim örnekleri
    print(f"\n   📋 İlk 5 Günlük Tüketim:")
    for i, c in enumerate(consumptions[:5], 1):
        print(f"      {i}. {c['date']} - {c['machine']}: PETKİM={c['petkim']}kg, ESTOL={c['estol']}kg")
    
    client.close()

async def main():
    print("=" * 70)
    print("🔄 GÜNLÜK TÜKETİM HESAPLANMASI (Üretimden)")
    print("=" * 70)
    
    await calculate_consumption()
    
    print("\n" + "=" * 70)
    print("✅ GÜNLÜK TÜKETİM BAŞARIYLA HESAPLANDI!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(main())
