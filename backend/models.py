from pydantic import BaseModel

class Login(BaseModel):
    login: str
    password: str

class Register(BaseModel):
    username: str
    password: str
    email: str

class Add_Event(BaseModel):
    name: str
    description: str
    organizer_id: int

class User2Event(BaseModel):
    event_id: int
    user_id: int