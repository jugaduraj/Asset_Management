from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Base, Asset, AssetSchema
import sys

sys.path.append('/app')

Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS (allow React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/assets")
def get_assets():
    db = SessionLocal()
    return db.query(Asset).all()

@app.post("/assets")
def create_asset(asset: AssetSchema):
    db: Session = SessionLocal()
    db_asset = Asset(**asset.dict())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

@app.delete("/assets/{asset_id}")
def delete_asset(asset_id: int):
    db = SessionLocal()
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    db.delete(asset)
    db.commit()
    return {"message": "Asset deleted"}

@app.put("/assets/{asset_id}")
def update_asset(asset_id: int, asset_data: AssetSchema):
    db = SessionLocal()
    asset = db.query(Asset).filter(Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    for key, value in asset_data.dict().items():
        setattr(asset, key, value)
    db.commit()
    db.refresh(asset)
    return asset
