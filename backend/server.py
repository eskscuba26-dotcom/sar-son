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
    
    # Calculate total stock from productions
    productions = await db.productions.find({}, {"_id": 0, "quantity": 1}).to_list(1000)
    total_stock = sum(p.get("quantity", 0) for p in productions)
    
    return StockStats(
        totalStock=total_stock,
        cutProducts=0,
        productions=production_count,
        materials={
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