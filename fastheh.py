from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from random import randint
from fastapi.middleware.cors import CORSMiddleware

class Item(BaseModel):
    id: int
    name: str
    price: Optional[float] = 0.0
    tax: Optional[float] = 10.0

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/item")
async def get_item(item: Item):
    return {"sale_type": item.name+" The Big Type", "price": item.price + randint(500,9999)}

