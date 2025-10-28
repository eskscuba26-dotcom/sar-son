from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ===== Models =====

# Auth Models
class LoginRequest(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    role: str = "admin"

# Production Models
class ProductionCreate(BaseModel):
    date: str
    machine: str
    thickness: str
    width: str
    length: str
    m2: float
    quantity: int
    masuraType: str
    color: str
    colorCategory: str

class Production(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: str
    machine: str
    thickness: str
    width: str
    length: str
    m2: float
    quantity: int
    masuraType: str
    color: str
    colorCategory: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Stock Stats Model
class StockStats(BaseModel):
    totalStock: int = 0
    cutProducts: int = 0
    productions: int = 0
    materials: dict = {
        "gaz": 0,
        "petkim": 0,
        "estol": 0,
        "talk": 0,
        "masura100": 0,
        "masura120": 0,
        "masura150": 0,
        "masura200": 0,
        "sari": 0,
    }

# Stock Models
class StockItem(BaseModel):
    type: str
    thickness: str
    width: str
    length: str
    color: str
    colorCategory: str
    m2: float
    quantity: int


# ===== Auth Routes =====
@api_router.post("/auth/login", response_model=UserResponse)
async def login(request: LoginRequest):
    # Simple auth for now - check against default admin
    if request.username == "admin" and request.password == "SAR2025!":
        return UserResponse(
            id=str(uuid.uuid4()),
            username=request.username,
            role="admin"
        )
    raise HTTPException(status_code=401, detail="Kullanıcı adı veya şifre hatalı")


# ===== Production Routes =====
@api_router.get("/production", response_model=List[Production])
async def get_productions():
    productions = await db.productions.find({}, {"_id": 0}).to_list(1000)
    return productions

@api_router.post("/production", response_model=Production)
async def create_production(production: ProductionCreate):
    prod_dict = production.model_dump()
    prod_obj = Production(**prod_dict)
    
    doc = prod_obj.model_dump()
    await db.productions.insert_one(doc)
    return prod_obj

@api_router.put("/production/{prod_id}")
async def update_production(prod_id: str, production: ProductionCreate):
    result = await db.productions.update_one(
        {"id": prod_id},
        {"$set": production.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Production not found")
    return {"message": "Updated successfully"}

@api_router.delete("/production/{prod_id}")
async def delete_production(prod_id: str):
    result = await db.productions.delete_one({"id": prod_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Production not found")
    return {"message": "Deleted successfully"}


# ===== Stock Routes =====
@api_router.get("/stock")
async def get_stock():
    # For now, return empty list
    return []

@api_router.get("/stock/stats", response_model=StockStats)
async def get_stock_stats():
    # Count productions
    production_count = await db.productions.count_documents({})
    
    # Calculate total stock: Productions - Normal Shipments
    productions = await db.productions.find({}, {"_id": 0, "quantity": 1}).to_list(1000)
    total_produced = sum(p.get("quantity", 0) for p in productions)
    
    # Get normal shipments
    shipments = await db.shipments.find({}, {"_id": 0, "type": 1, "quantity": 1}).to_list(1000)
    total_shipped = sum(int(s.get("quantity", 0)) for s in shipments if s.get("type") == "Normal")
    
    # Remaining stock
    total_stock = total_produced - total_shipped
    
    # Calculate cut products TOTAL QUANTITY (not count)
    cut_products_list = await db.cut_products.find({}, {"_id": 0, "quantity": 1}).to_list(1000)
    cut_products_total = sum(int(cp.get("quantity", 0)) for cp in cut_products_list)
    
    # Calculate material stocks (Giriş - Tüketim = Kalan)
    # Get materials entries
    materials = await db.materials.find({}, {"_id": 0}).to_list(1000)
    
    # Get daily consumption
    consumptions = await db.daily_consumption.find({}, {"_id": 0}).to_list(1000)
    
    # Initialize material stocks (GAZ yok artık!)
    material_stocks = {
        "petkim": 0.0,
        "estol": 0.0,
        "talk": 0.0,
        "masura100": 0,
        "masura120": 0,
        "masura150": 0,
        "masura200": 0,
        "sari": 0.0,
    }
    
    # Add material entries (Giriş)
    for mat in materials:
        material_name = mat.get("material", "").upper()
        quantity = float(mat.get("quantity", 0))
        
        if "PETKİM" in material_name or "PETKIM" in material_name:
            material_stocks["petkim"] += quantity
        elif "ESTOL" in material_name:
            material_stocks["estol"] += quantity
        elif "TALK" in material_name:
            material_stocks["talk"] += quantity
        elif "MASURA 100" in material_name:
            material_stocks["masura100"] += int(quantity)
        elif "MASURA 120" in material_name:
            material_stocks["masura120"] += int(quantity)
        elif "MASURA 150" in material_name:
            material_stocks["masura150"] += int(quantity)
        elif "MASURA 200" in material_name:
            material_stocks["masura200"] += int(quantity)
        elif "SARI" in material_name or "SARI" in material_name.upper():
            material_stocks["sari"] += quantity
    
    # Subtract daily consumption (Çıkış) - YENİ ALANLAR
    for consumption in consumptions:
        petkim = float(consumption.get("petkim", 0))
        estol = float(consumption.get("estol", 0))
        talk = float(consumption.get("talk", 0))
        
        material_stocks["petkim"] -= petkim
        material_stocks["estol"] -= estol
        material_stocks["talk"] -= talk
    
    # Subtract masura usage from productions
    production_list = await db.productions.find({}, {"_id": 0, "masuraType": 1, "quantity": 1}).to_list(1000)
    for prod in production_list:
        masura_type = prod.get("masuraType", "")
        quantity = int(prod.get("quantity", 0))
        
        if "100" in masura_type:
            material_stocks["masura100"] -= quantity
        elif "120" in masura_type:
            material_stocks["masura120"] -= quantity
        elif "150" in masura_type:
            material_stocks["masura150"] -= quantity
        elif "200" in masura_type:
            material_stocks["masura200"] -= quantity
    
    # Round to 2 decimals for float values
    material_stocks["petkim"] = round(material_stocks["petkim"], 2)
    material_stocks["estol"] = round(material_stocks["estol"], 2)
    material_stocks["talk"] = round(material_stocks["talk"], 2)
    material_stocks["sari"] = round(material_stocks["sari"], 2)
    
    return StockStats(
        totalStock=total_stock,
        cutProducts=cut_products_total,
        productions=production_count,
        materials=material_stocks
    )


# ===== Cut Products Routes =====
@api_router.get("/cut-products")
async def get_cut_products():
    cut_products = await db.cut_products.find({}, {"_id": 0}).to_list(1000)
    return cut_products

@api_router.post("/cut-products")
async def create_cut_product(data: dict):
    data['id'] = str(uuid.uuid4())
    await db.cut_products.insert_one(data)
    return {"message": "Created", "id": data['id']}

@api_router.delete("/cut-products/{id}")
async def delete_cut_product(id: str):
    result = await db.cut_products.delete_one({"id": id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"message": "Deleted"}

# ===== Shipments Routes =====
@api_router.get("/shipments")
async def get_shipments():
    shipments = await db.shipments.find({}, {"_id": 0}).to_list(1000)
    return shipments

@api_router.post("/shipments")
async def create_shipment(data: dict):
    data['id'] = str(uuid.uuid4())
    await db.shipments.insert_one(data)
    return {"message": "Created", "id": data['id']}

@api_router.delete("/shipments/{id}")
async def delete_shipment(id: str):
    result = await db.shipments.delete_one({"id": id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"message": "Deleted"}

@api_router.get("/materials")
async def get_materials():
    materials = await db.materials.find({}, {"_id": 0}).to_list(1000)
    return materials

@api_router.post("/materials")
async def create_material(data: dict):
    data['id'] = str(uuid.uuid4())
    await db.materials.insert_one(data)
    return {"message": "Created", "id": data['id']}

@api_router.get("/daily-consumption")
async def get_daily_consumption():
    consumptions = await db.daily_consumption.find({}, {"_id": 0}).to_list(1000)
    return consumptions

@api_router.post("/daily-consumption")
async def create_daily_consumption(data: dict):
    data['id'] = str(uuid.uuid4())
    await db.daily_consumption.insert_one(data)
    return {"message": "Created", "id": data['id']}

@api_router.get("/cost-analysis")
async def get_cost_analysis():
    costs = await db.cost_analysis.find({}, {"_id": 0}).to_list(1000)
    return costs

@api_router.post("/cost-analysis")
async def create_cost_analysis(data: dict):
    data['id'] = str(uuid.uuid4())
    await db.cost_analysis.insert_one(data)
    return {"message": "Created", "id": data['id']}

@api_router.get("/users")
async def get_users():
    users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    return users

@api_router.get("/exchange-rates")
async def get_exchange_rates():
    rate = await db.exchange_rates.find_one({}, {"_id": 0})
    if rate:
        return {"usd": rate.get('usd', 0), "eur": rate.get('eur', 0), "lastUpdated": rate.get('lastUpdated', '')}
    return {"usd": 42.00, "eur": 48.00}

@api_router.put("/exchange-rates")
async def update_exchange_rates(data: dict):
    data['lastUpdated'] = datetime.now(timezone.utc).isoformat()
    await db.exchange_rates.update_one({}, {"$set": data}, upsert=True)
    return {"message": "Updated"}


# ===== Root Route =====
@api_router.get("/")
async def root():
    return {"message": "SAR Ambalaj API v1.0"}

# ===== Stock Routes =====
@api_router.get("/stock")
async def get_stock():
    """
    Dinamik stok hesaplama:
    Stok = Üretim - Sevkiyat
    Ürün tipine, kalınlığa, ene, metreye, renge göre gruplandırılmış
    """
    try:
        # 1. Tüm üretim kayıtlarını al
        productions = await db.productions.find({}).to_list(None)
        
        # 2. Tüm sevkiyat kayıtlarını al
        shipments = await db.shipments.find({}).to_list(None)
        
        # 3. Üretim verilerini grupla
        production_groups = {}
        for prod in productions:
            thickness = prod.get('thickness', '')
            width = prod.get('width', '')
            length = prod.get('length', '')
            color = prod.get('color', '')
            
            # Key oluştur: kalınlık_en_metre_renk
            key = f"{thickness}_{width}_{length}_{color}"
            
            if key not in production_groups:
                production_groups[key] = {
                    'type': 'Normal',
                    'thickness': thickness,
                    'width': width,
                    'length': length,
                    'color': color,
                    'colorCategory': prod.get('colorCategory', 'Doğal'),
                    'm2': prod.get('m2', 0),
                    'quantity': 0
                }
            
            production_groups[key]['quantity'] += prod.get('quantity', 0)
        
        # 4. Sevkiyat verilerini grupla
        shipment_groups = {}
        for ship in shipments:
            # Sevkiyat size'ından kalınlık, en, metre çıkar
            size = ship.get('size', '')
            ship_type = ship.get('type', 'Normal')
            color = ship.get('color', '')
            
            # Size parsing: "2mm x 100cm x 300m" veya "1.8mm x 50cm x 137.5cm"
            parts = size.split(' x ')
            if len(parts) >= 3:
                thickness = parts[0].replace('mm', '').strip()
                width = parts[1].replace('cm', '').strip()
                length_part = parts[2].strip()
                
                # Key oluştur
                key = f"{thickness} mm_{width}_{length_part}_{color}"
                
                if key not in shipment_groups:
                    shipment_groups[key] = 0
                
                shipment_groups[key] += int(ship.get('quantity', 0))
        
        # 5. Stok hesapla (Üretim - Sevkiyat)
        stock_items = []
        for key, prod_data in production_groups.items():
            quantity = prod_data['quantity']
            
            # Sevkiyatı düş
            if key in shipment_groups:
                quantity -= shipment_groups[key]
            
            # Sadece stokta olan veya negatif olanları göster
            if quantity != 0:
                stock_items.append({
                    'type': prod_data['type'],
                    'thickness': prod_data['thickness'],
                    'width': prod_data['width'],
                    'length': prod_data['length'],
                    'color': prod_data['color'],
                    'colorCategory': prod_data['colorCategory'],
                    'm2': prod_data['m2'],
                    'quantity': quantity
                })
        
        # 6. Kesilmiş ürünleri ekle
        cut_products = await db.cut_products.find({}).to_list(None)
        cut_groups = {}
        
        for cut in cut_products:
            cut_size = cut.get('cutSize', '')
            color = cut.get('color', '')
            
            key = f"cut_{cut_size}_{color}"
            
            if key not in cut_groups:
                # cutSize parsing: "1.8mm x 50cm x 137.5cm"
                parts = cut_size.split(' x ')
                if len(parts) >= 3:
                    cut_groups[key] = {
                        'type': 'Kesilmiş',
                        'thickness': parts[0].replace('mm', '').strip(),
                        'width': parts[1].replace('cm', '').strip(),
                        'length': parts[2].strip(),
                        'color': color,
                        'colorCategory': cut.get('colorCategory', 'Doğal'),
                        'm2': 0.69,  # Kesilmiş ürün m2
                        'quantity': 0
                    }
            
            cut_groups[key]['quantity'] += int(cut.get('quantity', 0))
        
        # Kesilmiş ürün sevkiyatlarını düş
        for ship in shipments:
            if ship.get('type') == 'Kesilmiş':
                size = ship.get('size', '')
                color = ship.get('color', '')
                key = f"cut_{size}_{color}"
                
                if key in cut_groups:
                    cut_groups[key]['quantity'] -= int(ship.get('quantity', 0))
        
        # Kesilmiş ürünleri stock_items'a ekle
        for cut_data in cut_groups.values():
            if cut_data['quantity'] != 0:
                stock_items.append(cut_data)
        
        # 7. Sırala (önce tip, sonra kalınlık)
        stock_items.sort(key=lambda x: (
            0 if x['type'] == 'Normal' else 1,
            float(x['thickness']) if x['thickness'] else 0,
            int(x['width']) if x['width'] else 0
        ))
        
        return stock_items
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()