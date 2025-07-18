from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel

Base = declarative_base()

class Asset(Base):
    __tablename__ = "assets"
    id = Column(Integer, primary_key=True, index=True)
    assetTag = Column(String)
    hostName = Column(String)
    assetType = Column(String)
    make = Column(String)
    model = Column(String)
    serialNo = Column(String)
    processor = Column(String)
    os = Column(String)
    osVersion = Column(String)
    ram = Column(String)
    hddSsd = Column(String)
    location = Column(String)
    status = Column(String)
    remark = Column(String)
    warrantyStatus = Column(String)
    warrantyExpirationDate = Column(String)
    assignedTo = Column(String)
    purchase_date = Column(String)

class AssetSchema(BaseModel):
    assetTag: str
    hostName: str
    assetType: str
    make: str
    model: str
    serialNo: str
    processor: str
    os: str
    osVersion: str
    ram: str
    hddSsd: str
    location: str
    status: str
    remark: str
    warrantyStatus: str
    warrantyExpirationDate: str
    assignedTo: str
    purchase_date: str

    class Config:
        orm_mode = True