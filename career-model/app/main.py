from typing import Union
from fastapi import FastAPI
from app.predict import predict, Student, PredictionResult
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "https://https://team-cakepop.fly.dev/",
    "http://localhost",
    "http://localhost:4567",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/prediction")
async def prediction(student: Student) -> PredictionResult: return predict(student)