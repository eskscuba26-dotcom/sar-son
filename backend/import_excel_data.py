"""
Excel dosyasından tüm verileri okuyup MongoDB'ye yükle
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
    """Üretim verilerini import et (Sheet1)"""
    print("📊 Üretim verileri yükleniyor...")
    
    try:
        # Excel'den oku
        df = pd.read_excel(EXCEL_FILE, sheet_name=0)
        
        print(f"Sheet columns: {df.columns.tolist()}")
        print(f"First few rows:\n{df.head()}")
        
        # Temizle ve yükle
        productions = []
        for index, row in df.iterrows():
            try:
                # Boş satırları atla
                if pd.isna(row.iloc[0]):
                    continue
                
                # Tarih sütunu
                date_val = row.iloc[0]
                if isinstance(date_val, (int, float)):
                    continue  # Toplam satırları atla
                    
                # Tarih formatını düzenle
                if isinstance(date_val, pd.Timestamp):
                    date_str = date_val.strftime('%Y-%m-%d')
                else:
                    date_str = str(date_val)
                
                # Makine ve kalınlık bilgisi
                machine_thickness = str(row.iloc[1]) if not pd.isna(row.iloc[1]) else "Makine 1"
                
                # Makine ve kalınlığı ayır
                if "Makine" in machine_thickness:
                    machine = machine_thickness.split()[0] + " " + machine_thickness.split()[1]
                    # Kalınlık bir sonraki sütunda
                    thickness_col = 2
                else:
                    machine = "Makine 1"
                    thickness_col = 1
                
                thickness = str(row.iloc[thickness_col]) if not pd.isna(row.iloc[thickness_col]) else "1 mm"
                if "mm" not in thickness:
                    thickness = f"{thickness} mm"
                
                width = str(int(row.iloc[thickness_col + 1])) if not pd.isna(row.iloc[thickness_col + 1]) else "100"
                length = str(int(row.iloc[thickness_col + 2])) if not pd.isna(row.iloc[thickness_col + 2]) else "300"
                m2 = float(row.iloc[thickness_col + 3]) if not pd.isna(row.iloc[thickness_col + 3]) else 0.0
                quantity = int(row.iloc[thickness_col + 4]) if not pd.isna(row.iloc[thickness_col + 4]) else 0
                
                masura_type = str(row.iloc[thickness_col + 5]) if not pd.isna(row.iloc[thickness_col + 5]) else "Masura 100"
                color = str(row.iloc[thickness_col + 6]) if not pd.isna(row.iloc[thickness_col + 6]) else "Doğal"
                color_category = str(row.iloc[thickness_col + 7]) if not pd.isna(row.iloc[thickness_col + 7]) else "Doğal"
                
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
                print(f"Satır {index} atlandı: {e}")
                continue
        
        if productions:
            # Mevcut verileri temizle
            await db.productions.delete_many({})
            # Yeni verileri ekle
            await db.productions.insert_many(productions)
            print(f"✅ {len(productions)} üretim kaydı yüklendi")
        else:
            print("⚠️ Üretim verisi bulunamadı")
            
    except Exception as e:
        print(f"❌ Üretim verileri yüklenemedi: {e}")

async def import_cut_products():
    """Kesilmiş ürün verilerini import et (Sheet2)"""
    print("\n✂️ Kesilmiş ürün verileri yükleniyor...")
    
    try:
        df = pd.read_excel(EXCEL_FILE, sheet_name=1)
        
        print(f"Sheet columns: {df.columns.tolist()}")
        
        cut_products = []
        for index, row in df.iterrows():
            try:
                # Boş satırları atla
                if pd.isna(row.iloc[0]):
                    continue
                
                date_val = row.iloc[0]
                if isinstance(date_val, (int, float)):
                    continue
                    
                if isinstance(date_val, pd.Timestamp):
                    date_str = date_val.strftime('%Y-%m-%d')
                else:
                    date_str = str(date_val)
                
                original_material = str(row.iloc[1]) if not pd.isna(row.iloc[1]) else ""
                cut_size = str(row.iloc[2]) if not pd.isna(row.iloc[2]) else ""
                quantity = int(row.iloc[3]) if not pd.isna(row.iloc[3]) else 0
                used_material = str(row.iloc[4]) if not pd.isna(row.iloc[4]) else ""
                color = str(row.iloc[5]) if not pd.isna(row.iloc[5]) else "Doğal"
                
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
                print(f"Satır {index} atlandı: {e}")
                continue
        
        if cut_products:
            await db.cut_products.delete_many({})
            await db.cut_products.insert_many(cut_products)
            print(f"✅ {len(cut_products)} kesilmiş ürün kaydı yüklendi")
        else:
            print("⚠️ Kesilmiş ürün verisi bulunamadı")
            
    except Exception as e:
        print(f"❌ Kesilmiş ürün verileri yüklenemedi: {e}")

async def import_shipments():
    """Sevkiyat verilerini import et (Sheet3)"""
    print("\n📦 Sevkiyat verileri yükleniyor...")
    
    try:
        df = pd.read_excel(EXCEL_FILE, sheet_name=2)
        
        print(f"Sheet columns: {df.columns.tolist()}")
        
        shipments = []
        for index, row in df.iterrows():
            try:
                # Boş satırları atla
                if pd.isna(row.iloc[0]):
                    continue
                
                date_val = row.iloc[0]
                if isinstance(date_val, (int, float)):
                    continue
                    
                if isinstance(date_val, pd.Timestamp):
                    date_str = date_val.strftime('%Y-%m-%d')
                else:
                    date_str = str(date_val)
                
                customer = str(row.iloc[1]) if not pd.isna(row.iloc[1]) else ""
                ship_type = str(row.iloc[2]) if not pd.isna(row.iloc[2]) else "Normal"
                size = str(row.iloc[3]) if not pd.isna(row.iloc[3]) else ""
                m2 = float(row.iloc[4]) if not pd.isna(row.iloc[4]) else 0.0
                quantity = int(row.iloc[5]) if not pd.isna(row.iloc[5]) else 0
                color = str(row.iloc[6]) if not pd.isna(row.iloc[6]) else "Doğal"
                waybill_no = str(row.iloc[7]) if not pd.isna(row.iloc[7]) else ""
                
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
                print(f"Satır {index} atlandı: {e}")
                continue
        
        if shipments:
            await db.shipments.delete_many({})
            await db.shipments.insert_many(shipments)
            print(f"✅ {len(shipments)} sevkiyat kaydı yüklendi")
        else:
            print("⚠️ Sevkiyat verisi bulunamadı")
            
    except Exception as e:
        print(f"❌ Sevkiyat verileri yüklenemedi: {e}")

async def main():
    print("=" * 60)
    print("📁 SAR-2025-Veriler.xlsx dosyası yükleniyor...")
    print("=" * 60)
    
    # Tüm sheet'leri oku ve incele
    xls = pd.ExcelFile(EXCEL_FILE)
    print(f"\n📋 Excel'de bulunan sheet'ler: {xls.sheet_names}\n")
    
    # Her sheet'i import et
    await import_production_data()
    await import_cut_products()
    await import_shipments()
    
    print("\n" + "=" * 60)
    print("✅ Tüm veriler başarıyla yüklendi!")
    print("=" * 60)
    
    # İstatistikleri göster
    prod_count = await db.productions.count_documents({})
    cut_count = await db.cut_products.count_documents({})
    ship_count = await db.shipments.count_documents({})
    
    print(f"\n📊 Yüklenen Veri Özeti:")
    print(f"  - Üretim Kayıtları: {prod_count}")
    print(f"  - Kesilmiş Ürünler: {cut_count}")
    print(f"  - Sevkiyatlar: {ship_count}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(main())
