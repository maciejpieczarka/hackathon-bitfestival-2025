from pydantic import BaseModel
from datetime import datetime

class Login(BaseModel):
    login: str
    password: str

class Register(BaseModel):
    username: str
    password: str
    email: str

class Add_Event(BaseModel):
    name: str
    event_time: datetime
    description: str
    category: int

class Join_Event(BaseModel):
    event_id: int
    user_id: int  
    
class DataVector(BaseModel):
    mood: int
    energy: int
    collaboration_style: int
    activity: int
    
class UserResponse(BaseModel):
    username: str
    email: str
    
