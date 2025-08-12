from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
import motor.motor_asyncio
import os
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()  # Load .env file

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
db = client[DB_NAME]

app = FastAPI(title="Asset Management with MongoDB")

# Helper to convert ObjectId to str
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)
    
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="string")

# Asset Pydantic model
class Asset(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id")
    asset_tag: str
    host_name: str
    asset_type: Optional[str] = None
    make: Optional[str] = None
    model: Optional[str] = None
    serial_no: Optional[str] = None
    processor: Optional[str] = None
    os: Optional[str] = None
    os_version: Optional[str] = None
    ram: Optional[str] = None
    storage: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    remark: Optional[str] = None
    warranty_status: Optional[str] = None
    warranty_expiration_date: Optional[str] = None  # ISO date string

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

# Create Asset (without id)
class AssetCreate(BaseModel):
    asset_tag: str
    host_name: str
    asset_type: Optional[str] = None
    make: Optional[str] = None
    model: Optional[str] = None
    serial_no: Optional[str] = None
    processor: Optional[str] = None
    os: Optional[str] = None
    os_version: Optional[str] = None
    ram: Optional[str] = None
    storage: Optional[str] = None
    location: Optional[str] = None
    status: Optional[str] = None
    remark: Optional[str] = None
    warranty_status: Optional[str] = None
    warranty_expiration_date: Optional[str] = None

@app.post("/assets/", response_model=Asset)
async def create_asset(asset: AssetCreate):
    existing = await db.assets.find_one({"asset_tag": asset.asset_tag})
    if existing:
        raise HTTPException(status_code=400, detail="Asset with this tag already exists")
    asset_dict = asset.dict()
    result = await db.assets.insert_one(asset_dict)
    created_asset = await db.assets.find_one({"_id": result.inserted_id})
    return Asset(**created_asset)

@app.get("/assets/{asset_id}", response_model=Asset)
async def get_asset(asset_id: str):
    if not ObjectId.is_valid(asset_id):
        raise HTTPException(status_code=400, detail="Invalid asset ID")
    asset = await db.assets.find_one({"_id": ObjectId(asset_id)})
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return Asset(**asset)

@app.get("/assets/", response_model=List[Asset])
async def list_assets(
    q: Optional[str] = Query(None, description="Search query"),
    skip: int = 0,
    limit: int = 25,
):
    query = {}
    if q:
        query = {
            "$or": [
                {"asset_tag": {"$regex": q, "$options": "i"}},
                {"host_name": {"$regex": q, "$options": "i"}},
                {"make": {"$regex": q, "$options": "i"}},
                {"model": {"$regex": q, "$options": "i"}},
            ]
        }
    cursor = db.assets.find(query).skip(skip).limit(limit)
    results = []
    async for doc in cursor:
        results.append(Asset(**doc))
    return results

@app.put("/assets/{asset_id}", response_model=Asset)
async def update_asset(asset_id: str, asset: AssetCreate):
    if not ObjectId.is_valid(asset_id):
        raise HTTPException(status_code=400, detail="Invalid asset ID")
    existing = await db.assets.find_one({"_id": ObjectId(asset_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Asset not found")
    await db.assets.update_one({"_id": ObjectId(asset_id)}, {"$set": asset.dict()})
    updated = await db.assets.find_one({"_id": ObjectId(asset_id)})
    return Asset(**updated)

@app.delete("/assets/{asset_id}", status_code=204)
async def delete_asset(asset_id: str):
    if not ObjectId.is_valid(asset_id):
        raise HTTPException(status_code=400, detail="Invalid asset ID")
    result = await db.assets.delete_one({"_id": ObjectId(asset_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Asset not found")
    return None

