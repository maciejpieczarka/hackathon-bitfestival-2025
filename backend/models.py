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
    activity: list[int]
    
class ActivityResponse(BaseModel):
    id: int
    name: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    description: str | None
    activities: list[ActivityResponse]
    
    
