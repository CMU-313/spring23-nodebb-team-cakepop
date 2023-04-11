from typing import Union
from fastapi import FastAPI
from predict import predict
from pydantic import BaseModel

app = FastAPI()

class getStudentData(BaseModel):
    student_id: str
    major: str
    age: str
    gender: str 
    gpa: str
    extra_curricular: str
    num_programming_languages: str
    num_past_internships: str

@app.post("/prediction")
async def prediction(data: getStudentData):
    return predict(data)