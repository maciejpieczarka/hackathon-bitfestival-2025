from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import and_
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from database_models import Activity, User, Base, Event, User2Event, UserInputDataVector
from models import ActivityResponse, Join_Event, Register, Add_Event, DataVector, UserResponse
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

@app.post('/join_event')
def join_event(join_data: Join_Event, credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        return {"status": "401"}

    event = db.query(Event).filter(Event.id == join_data.event_id).first()
    if not event:
        return {"status": "404"}

    existing_join = db.query(User2Event).filter(
        User2Event.event_id == join_data.event_id,
        User2Event.user_id == user.id
    ).first()

    if existing_join:
        return {"status": "400"}

    if event.organizer_id == user.id:
        return {"status": "400"}

    user2event = User2Event(
        event_id=join_data.event_id,
        user_id=user.id
    )

    db.add(user2event)
    db.commit()
    db.refresh(user2event)

    return {"status": "200"}

@app.post('/user_input_data')
def user_input_data(data_vector: DataVector, credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        return {"status": "401"}
    
    activity_obj = db.query(Activity).filter(Activity.id.in_(data_vector.activity)).all()
    user.activities = activity_obj
    db.commit()
    db.refresh(user)
    
    existing_vector = db.query(UserInputDataVector).filter(UserInputDataVector.user_id == user.id).first()
    
    if existing_vector:
        db.delete(existing_vector)
        db.commit()

    new_data_vector = UserInputDataVector(
        user_id=user.id,
        mood=data_vector.mood,
        energy=data_vector.energy,
        collaboration_style=data_vector.collaboration_style
    )

    db.add(new_data_vector)
    db.commit()
    db.refresh(new_data_vector)
    
    distances = {}
    
    for user_vector in db.query(UserInputDataVector).join(User).filter(UserInputDataVector.user_id != user.id, User.activities.any(Activity.id.in_(data_vector.activity))).all():
        distance = ((user_vector.mood - new_data_vector.mood) ** 2 +
                    (user_vector.energy - new_data_vector.energy) ** 2 +
                    (user_vector.collaboration_style - new_data_vector.collaboration_style) ** 2) ** 0.5
        distances[user_vector.user_id] = distance
    sorted_distances = sorted(distances.items(), key=lambda x: x[1])
    users_to_recommend = [user_id for user_id, distance in sorted_distances[:100]]
    users = db.query(User).filter(User.id.in_(users_to_recommend)).all()
    return {"users": [ UserResponse(username=u.username, email=u.email, activities=[ActivityResponse(id=a.id, name=a.name) for a in u.activities]) for u in users ]}