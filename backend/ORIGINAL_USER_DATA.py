"""
KULLANICININ ORİJİNAL VERİLERİ - SAKLAYIN, DEĞİŞTİRMEYİN!
Kullanıcı tarafından sağlanan ekran görüntülerinden alınan GERÇEK veriler
Tarih: 2025-10-29
26 Günlük Tüketim Kaydı
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

# KULLANICININ GERÇEK VERİLERİ - 26 KAYIT
# Ekran görüntülerinden alındı
# GAZ değerleri günlük toplam GAZ'ın üretim oranına göre dağıtılmasıyla hesaplanmıştır
ORIGINAL_DAILY_CONSUMPTION = [
    # 23.09.2025 - Toplam GAZ: 56 kg - Sadece Makine 2
    {'date': '2025-09-23', 'machine': 'Makine 2', 'petkim': 1350.00, 'estol': 40.50, 'talk': 20.25, 'gaz': 56.00, 'fire': 0.00},
    
    # 24.09.2025 - Toplam GAZ: 56 kg - Sadece Makine 2
    {'date': '2025-09-24', 'machine': 'Makine 2', 'petkim': 425.00, 'estol': 12.75, 'talk': 6.375, 'gaz': 56.00, 'fire': 0.00},
    
    # 25.09.2025 - Toplam GAZ: 60 kg - Sadece Makine 2 (hepsi)
    {'date': '2025-09-25', 'machine': 'Makine 2', 'petkim': 675.00, 'estol': 20.25, 'talk': 10.125, 'gaz': 60.00, 'fire': 0.00},
    
    # 26.09.2025 - Toplam GAZ: 140 kg - Makine 1: 440m²=94.05kg, Makine 2 toplamı: 1466.75m²=45.95kg
    {'date': '2025-09-26', 'machine': 'Makine 1', 'petkim': 725.00, 'estol': 21.75, 'talk': 10.875, 'gaz': 94.05, 'fire': 0.00},
    {'date': '2025-09-26', 'machine': 'Makine 2', 'petkim': 350.00, 'estol': 10.50, 'talk': 5.25, 'gaz': 45.95, 'fire': 0.00},
    
    # 29.09.2025 - Toplam GAZ: 112 kg - Sadece Makine 1
    {'date': '2025-09-29', 'machine': 'Makine 1', 'petkim': 475.00, 'estol': 14.25, 'talk': 7.125, 'gaz': 112.00, 'fire': 0.00},
    
    # 30.09.2025 - Toplam GAZ: 101 kg - Sadece Makine 1
    {'date': '2025-09-30', 'machine': 'Makine 1', 'petkim': 825.00, 'estol': 24.75, 'talk': 12.375, 'gaz': 101.00, 'fire': 0.00},
    
    # 01.10.2025 - Toplam GAZ: 128.80 kg - Makine 1: 280m²=41.80kg, Makine 2: 600m²=87.00kg
    {'date': '2025-10-01', 'machine': 'Makine 1', 'petkim': 750.00, 'estol': 22.50, 'talk': 11.25, 'gaz': 41.80, 'fire': 0.00},
    {'date': '2025-10-01', 'machine': 'Makine 2', 'petkim': 825.00, 'estol': 24.75, 'talk': 12.375, 'gaz': 87.00, 'fire': 0.00},
    
    # 02.10.2025 - Toplam GAZ: 184.80 kg - Makine 1: 300m²=92.40kg, Makine 2: 960m²=92.40kg  
    {'date': '2025-10-02', 'machine': 'Makine 1', 'petkim': 275.00, 'estol': 8.25, 'talk': 4.125, 'gaz': 92.40, 'fire': 40.00},
    {'date': '2025-10-02', 'machine': 'Makine 2', 'petkim': 225.00, 'estol': 6.75, 'talk': 3.375, 'gaz': 92.40, 'fire': 40.00},
    
    # 03.10.2025 - Toplam GAZ: 56 kg - Sadece Makine 2
    {'date': '2025-10-03', 'machine': 'Makine 2', 'petkim': 637.28, 'estol': 19.1184, 'talk': 9.5592, 'gaz': 56.00, 'fire': 29.00},
    
    # 06.10.2025 - Toplam GAZ: 168 kg - Sadece Makine 2
    {'date': '2025-10-06', 'machine': 'Makine 2', 'petkim': 655.08, 'estol': 19.6524, 'talk': 9.8262, 'gaz': 168.00, 'fire': 38.00},
    
    # 07.10.2025 - Toplam GAZ: 168 kg - Sadece Makine 2
    {'date': '2025-10-07', 'machine': 'Makine 2', 'petkim': 762.38, 'estol': 22.8714, 'talk': 11.4357, 'gaz': 168.00, 'fire': 38.56},
    
    # 08.10.2025 - Toplam GAZ: 112 kg - Sadece Makine 2
    {'date': '2025-10-08', 'machine': 'Makine 2', 'petkim': 708.58, 'estol': 21.2574, 'talk': 10.6287, 'gaz': 112.00, 'fire': 31.00},
    
    # 14.10.2025 - Toplam GAZ: 56 kg - Sadece Makine 2
    {'date': '2025-10-14', 'machine': 'Makine 2', 'petkim': 477.20, 'estol': 14.316, 'talk': 7.158, 'gaz': 56.00, 'fire': 36.00},
    
    # 15.10.2025 - Toplam GAZ: 84 kg - Sadece Makine 2
    {'date': '2025-10-15', 'machine': 'Makine 2', 'petkim': 647.38, 'estol': 19.4214, 'talk': 9.7107, 'gaz': 84.00, 'fire': 40.00},
    
    # 16.10.2025 - Toplam GAZ: 112 kg - Sadece Makine 2
    {'date': '2025-10-16', 'machine': 'Makine 2', 'petkim': 796.51, 'estol': 23.8953, 'talk': 11.94765, 'gaz': 112.00, 'fire': 40.00},
    
    # 17.10.2025 - Toplam GAZ: 84 kg - Sadece Makine 2
    {'date': '2025-10-17', 'machine': 'Makine 2', 'petkim': 765.524, 'estol': 22.96572, 'talk': 11.48286, 'gaz': 84.00, 'fire': 37.00},
    
    # 20.10.2025 - Toplam GAZ: 212.80 kg - Sadece Makine 2
    {'date': '2025-10-20', 'machine': 'Makine 2', 'petkim': 781.30, 'estol': 23.439, 'talk': 11.7195, 'gaz': 212.80, 'fire': 40.00},
    
    # 21.10.2025 - Toplam GAZ: 168 kg - Sadece Makine 1
    {'date': '2025-10-21', 'machine': 'Makine 1', 'petkim': 653.61, 'estol': 19.6083, 'talk': 9.80415, 'gaz': 168.00, 'fire': 35.00},
    
    # 22.10.2025 - Toplam GAZ: 158 kg - Sadece Makine 1
    {'date': '2025-10-22', 'machine': 'Makine 1', 'petkim': 589.58, 'estol': 17.6874, 'talk': 8.8437, 'gaz': 158.00, 'fire': 40.00},
    
    # 23.10.2025 - Toplam GAZ: 160 kg - İki Makine 2 kaydı: 596.48kg=156.13kg, 14.86kg=3.87kg
    {'date': '2025-10-23', 'machine': 'Makine 2', 'petkim': 596.48, 'estol': 17.8944, 'talk': 8.9472, 'gaz': 156.13, 'fire': 30.00},
    {'date': '2025-10-23', 'machine': 'Makine 2', 'petkim': 14.86, 'estol': 0.4458, 'talk': 0.2229, 'gaz': 3.87, 'fire': 0.00},
    
    # 24.10.2025 - Toplam GAZ: 168 kg - Sadece Makine 1 (birden fazla kayıt ama hepsi Makine 1)
    {'date': '2025-10-24', 'machine': 'Makine 1', 'petkim': 616.32, 'estol': 18.4896, 'talk': 9.2448, 'gaz': 168.00, 'fire': 70.00},
    
    # 27.10.2025 - KULLANICI DEDİ: 27'de GAZ GİRİŞİ YOK - Ama ekran görüntüsünde 200 var
    # Şimdilik kaldırıyorum
    # {'date': '2025-10-27', 'machine': 'Makine 2', 'petkim': 501.86, 'estol': 15.0558, 'talk': 7.5279, 'gaz': 200.00, 'fire': 25.00},
]

async def load_original_data():
    """
    KULLANICININ ORİJİNAL VERİLERİNİ YÜKLE
    Bu fonksiyon her zaman kullanıcının sağladığı GERÇEK verileri yükler
    """
    print("=" * 80)
    print("📁 KULLANICININ ORİJİNAL VERİLERİ YÜKLENİYOR")
    print("=" * 80)
    print(f"\n26 Günlük Tüketim Kaydı (Ekran görüntülerinden)")
    
    # Mevcut verileri temizle
    await db.daily_consumption.delete_many({})
    
    # Orijinal verileri yükle
    for record in ORIGINAL_DAILY_CONSUMPTION:
        record['id'] = str(uuid.uuid4())
        record['notes'] = f"{record['machine']} - Orijinal veri"
        await db.daily_consumption.insert_one(record)
    
    print(f"\n✅ {len(ORIGINAL_DAILY_CONSUMPTION)} kayıt yüklendi!")
    
    # Toplamları hesapla
    total_petkim = sum(r['petkim'] for r in ORIGINAL_DAILY_CONSUMPTION)
    total_estol = sum(r['estol'] for r in ORIGINAL_DAILY_CONSUMPTION)
    total_talk = sum(r['talk'] for r in ORIGINAL_DAILY_CONSUMPTION)
    total_gaz = sum(r['gaz'] for r in ORIGINAL_DAILY_CONSUMPTION)
    total_fire = sum(r['fire'] for r in ORIGINAL_DAILY_CONSUMPTION)
    
    print(f"\n📊 TOPLAM TÜKETIM:")
    print(f"   • PETKİM: {total_petkim:,.2f} kg")
    print(f"   • ESTOL: {total_estol:,.2f} kg")
    print(f"   • TALK: {total_talk:,.2f} kg")
    print(f"   • GAZ: {total_gaz:,.2f} kg")
    print(f"   • FİRE: {total_fire:,.2f} kg")
    
    print(f"\n📋 İlk 5 Kayıt:")
    for i, rec in enumerate(ORIGINAL_DAILY_CONSUMPTION[:5], 1):
        print(f"   {i}. {rec['date']} - {rec['machine']}: PETKİM={rec['petkim']}, GAZ={rec['gaz']}, FİRE={rec['fire']}")
    
    print("\n" + "=" * 80)
    print("✅ ORİJİNAL VERİLER BAŞARIYLA YÜKLENDİ!")
    print("=" * 80)
    
    client.close()

if __name__ == "__main__":
    asyncio.run(load_original_data())
