"""
Excel dosyasından tüm verileri okuyup MongoDB'ye yükle
SAR-2025-Veriler.xlsx dosyasındaki tüm sheet'leri ve verileri içe aktar
"""
import pandas as pd
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
import uuid
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB bağlantısı
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

EXCEL_FILE = "/app/SAR-2025-Veriler.xlsx"

async def import_production_data():
    """Üretim verilerini import et (Sheet: Üretim Kayıtları)"""
    print("📊 Üretim verileri yükleniyor...")
    
    try:
        # Excel'den oku - Sheet adı: "Üretim Kayıtları"
        df = pd.read_excel(EXCEL_FILE, sheet_name="Üretim Kayıtları")
        
        print(f"   Sütunlar: {df.columns.tolist()}")
        print(f"   Toplam satır: {len(df)}")
        
        productions = []
        for index, row in df.iterrows():
            try:
                # Boş satırları atla
                if pd.isna(row['Tarih']):
                    continue
                
                # Tarih formatını düzenle
                if isinstance(row['Tarih'], pd.Timestamp):
                    date_str = row['Tarih'].strftime('%Y-%m-%d')
                else:
                    date_str = str(row['Tarih'])
                
                machine = str(row['Makine']) if not pd.isna(row['Makine']) else "Makine 1"
                thickness = str(row['Kalınlık']) if not pd.isna(row['Kalınlık']) else "1 mm"
                width = str(int(row['En'])) if not pd.isna(row['En']) else "100"
                length = str(int(row['Uzunluk'])) if not pd.isna(row['Uzunluk']) else "300"
                m2 = float(row['M²']) if not pd.isna(row['M²']) else 0.0
                quantity = int(row['Adet']) if not pd.isna(row['Adet']) else 0
                masura_type = str(row['Masura Tipi']) if not pd.isna(row['Masura Tipi']) else "Masura 100"
                color = str(row['Renk']) if not pd.isna(row['Renk']) else "Doğal"
                color_category = str(row['Renk Kategorisi']) if not pd.isna(row['Renk Kategorisi']) else "Doğal"
                
                prod = {
                    "id": str(uuid.uuid4()),
                    "date": date_str,
                    "machine": machine,
                    "thickness": thickness,
                    "width": width,
                    "length": length,
                    "m2": m2,
                    "quantity": quantity,
                    "masuraType": masura_type,
                    "color": color,
                    "colorCategory": color_category,
                    "created_at": datetime.utcnow().isoformat()
                }
                
                productions.append(prod)
                
            except Exception as e:
                print(f"   ⚠️ Satır {index} atlandı: {e}")
                continue
        
        if productions:
            # Mevcut verileri temizle
            await db.productions.delete_many({})
            # Yeni verileri ekle
            await db.productions.insert_many(productions)
            print(f"   ✅ {len(productions)} üretim kaydı yüklendi")
        else:
            print("   ⚠️ Üretim verisi bulunamadı")
            
    except Exception as e:
        print(f"   ❌ Üretim verileri yüklenemedi: {e}")
        import traceback
        traceback.print_exc()

async def import_cut_products():
    """Kesilmiş ürün verilerini import et (Sheet: Kesilmiş Ürünler)"""
    print("\n✂️ Kesilmiş ürün verileri yükleniyor...")
    
    try:
        df = pd.read_excel(EXCEL_FILE, sheet_name="Kesilmiş Ürünler")
        
        print(f"   Sütunlar: {df.columns.tolist()}")
        print(f"   Toplam satır: {len(df)}")
        
        cut_products = []
        for index, row in df.iterrows():
            try:
                # Boş satırları atla
                if pd.isna(row['Tarih']):
                    continue
                    
                if isinstance(row['Tarih'], pd.Timestamp):
                    date_str = row['Tarih'].strftime('%Y-%m-%d')
                else:
                    date_str = str(row['Tarih'])
                
                original_material = str(row['Malzeme']) if not pd.isna(row['Malzeme']) else ""
                cut_size = str(row['Kesim Boyutu']) if not pd.isna(row['Kesim Boyutu']) else ""
                quantity = int(row['Adet']) if not pd.isna(row['Adet']) else 0
                used_material = str(row['Kullanılan Malzeme']) if not pd.isna(row['Kullanılan Malzeme']) else ""
                color = str(row['Renk']) if not pd.isna(row['Renk']) else "Doğal"
                
                cut_prod = {
                    "id": str(uuid.uuid4()),
                    "date": date_str,
                    "originalMaterial": original_material,
                    "cutSize": cut_size,
                    "quantity": quantity,
                    "usedMaterial": used_material,
                    "color": color,
                    "colorCategory": "Doğal" if color == "Doğal" else "Renkli"
                }
                
                cut_products.append(cut_prod)
                
            except Exception as e:
                print(f"   ⚠️ Satır {index} atlandı: {e}")
                continue
        
        if cut_products:
            await db.cut_products.delete_many({})
            await db.cut_products.insert_many(cut_products)
            print(f"   ✅ {len(cut_products)} kesilmiş ürün kaydı yüklendi")
        else:
            print("   ⚠️ Kesilmiş ürün verisi bulunamadı")
            
    except Exception as e:
        print(f"   ❌ Kesilmiş ürün verileri yüklenemedi: {e}")
        import traceback
        traceback.print_exc()

async def import_shipments():
    """Sevkiyat verilerini import et (Sheet: Sevkiyatlar)"""
    print("\n📦 Sevkiyat verileri yükleniyor...")
    
    try:
        df = pd.read_excel(EXCEL_FILE, sheet_name="Sevkiyatlar")
        
        print(f"   Sütunlar: {df.columns.tolist()}")
        print(f"   Toplam satır: {len(df)}")
        
        shipments = []
        for index, row in df.iterrows():
            try:
                # Boş satırları atla
                if pd.isna(row['Tarih']):
                    continue
                    
                if isinstance(row['Tarih'], pd.Timestamp):
                    date_str = row['Tarih'].strftime('%Y-%m-%d')
                else:
                    date_str = str(row['Tarih'])
                
                customer = str(row['Müşteri']) if not pd.isna(row['Müşteri']) else ""
                ship_type = str(row['Tip']) if not pd.isna(row['Tip']) else "Normal"
                size = str(row['Boyut']) if not pd.isna(row['Boyut']) else ""
                m2 = float(row['M²']) if not pd.isna(row['M²']) else 0.0
                quantity = int(row['Adet']) if not pd.isna(row['Adet']) else 0
                color = str(row['Renk']) if not pd.isna(row['Renk']) else "Doğal"
                waybill_no = str(row['İrsaliye No']) if not pd.isna(row['İrsaliye No']) else ""
                
                shipment = {
                    "id": str(uuid.uuid4()),
                    "date": date_str,
                    "customer": customer,
                    "type": ship_type,
                    "size": size,
                    "m2": m2,
                    "quantity": quantity,
                    "color": color,
                    "waybillNo": waybill_no
                }
                
                shipments.append(shipment)
                
            except Exception as e:
                print(f"   ⚠️ Satır {index} atlandı: {e}")
                continue
        
        if shipments:
            await db.shipments.delete_many({})
            await db.shipments.insert_many(shipments)
            print(f"   ✅ {len(shipments)} sevkiyat kaydı yüklendi")
        else:
            print("   ⚠️ Sevkiyat verisi bulunamadı")
            
    except Exception as e:
        print(f"   ❌ Sevkiyat verileri yüklenemedi: {e}")
        import traceback
        traceback.print_exc()


async def main():
    print("=" * 70)
    print("📁 SAR-2025-Veriler.xlsx dosyası MongoDB'ye yükleniyor...")
    print("=" * 70)
    
    # Tüm sheet'leri oku ve incele
    xls = pd.ExcelFile(EXCEL_FILE)
    print(f"\n📋 Excel'de bulunan sheet'ler: {xls.sheet_names}\n")
    
    # Her sheet'i import et
    await import_production_data()
    await import_cut_products()
    await import_shipments()
    
    print("\n" + "=" * 70)
    print("✅ TÜM VERİLER BAŞARIYLA YÜKLENDİ!")
    print("=" * 70)
    
    # İstatistikleri göster
    prod_count = await db.productions.count_documents({})
    cut_count = await db.cut_products.count_documents({})
    ship_count = await db.shipments.count_documents({})
    
    print(f"\n📊 Yüklenen Veri Özeti:")
    print(f"  • Üretim Kayıtları: {prod_count} kayıt")
    print(f"  • Kesilmiş Ürünler: {cut_count} kayıt")
    print(f"  • Sevkiyatlar: {ship_count} kayıt")
    print(f"\n💾 Veritabanı: {os.environ['DB_NAME']}")
    print("\n✨ Veriler uygulamada görüntülenmeye hazır!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
