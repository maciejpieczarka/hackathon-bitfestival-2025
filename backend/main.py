from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from database_models import User, Base, Event
from models import Login, Register, Add_Event
from passlib.context import CryptContext
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from typing import Annotated

Base.metadata.create_all(bind=engine)

app = FastAPI()

security = HTTPBasic()

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def auth(user, credentials):
    if not user:
        return False

    if not pwd_context.verify(credentials.password, user.password):
        return False

    return True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_password_hash(password):
    return pwd_context.hash(password)

Base.metadata.create_all(bind=engine)

@app.post('/register')
def register(register: Register, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(
        (User.username == register.username) | (User.email == register.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )

    hashed_password = get_password_hash(register.password)

    new_user = User(
        username=register.username,
        password=hashed_password,
        email=register.email
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"status": "200"}

@app.post('/login')
def login(credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        return {"status": "401"}

    return {"status": "200", "username": credentials.username, "password": credentials.password}

@app.post('/add_event')
def add_event(event: Add_Event, credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        return {"status": "401"}

    new_event = Event(
        name=event.name,
        event_time=event.event_time,
        description=event.description,
        organizer_id=user.id,
        category=event.category
    )

    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    return {"status": "200"}

@app.delete('/delete_event/{event_id}')
def delete_event(event_id: int, credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        return {"status": "401"}

    event_to_delete = db.query(Event).filter(Event.id == event_id).first()

    if not event_to_delete:
        return {"status": "404"}

    if event_to_delete.organizer_id != user.id:
        return {"status": "403"}

    db.delete(event_to_delete)
    db.commit()

    return {"status": "200"}