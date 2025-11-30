from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import and_
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from database_models import Activity, Group, User, Base, Event, User2Event, User2Group, UserInputDataVector
from models import ActivityResponse, EventResponse, GroupCreate, GroupResponse, Join_Event, Register, Add_Event, DataVector, UserResponse, UserShortResponse
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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    return {"status": "200", "username": credentials.username, "password": credentials.password}

@app.post('/add_event')
def add_event(event: Add_Event, credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )

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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    event_to_delete = db.query(Event).filter(Event.id == event_id).first()

    if not event_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND
        )

    if event_to_delete.organizer_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN
        )

    db.delete(event_to_delete)
    db.commit()

    return {"status": "200"}

@app.post('/join_event')
def join_event(join_data: Join_Event, credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    event = db.query(Event).filter(Event.id == join_data.event_id).first()
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND
        )

    existing_join = db.query(User2Event).filter(
        User2Event.event_id == join_data.event_id,
        User2Event.user_id == user.id
    ).first()

    if existing_join:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already joined the event")

    if event.organizer_id == user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already joined the event")

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
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
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
    # Sortowanie i wybór 100 najbliższych
    sorted_distances = sorted(distances.items(), key=lambda x: x[1])
    users_to_recommend = [user_id for user_id, distance in sorted_distances[:100]]

    distance_max = (100 ** 2 +
                    100 ** 2 +
                    100 ** 2) ** 0.5
    
    users = db.query(User).filter(User.id.in_(users_to_recommend)).all()
    users_sorted = sorted(users, key=lambda u: users_to_recommend.index(u.id))
    return {"users": [ UserResponse(id=u.id, username=u.username, email=u.email, description=u.description, activities=[ActivityResponse(id=a.id, name=a.name) for a in u.activities], fit=1-(distances[u.id]/distance_max)) for u in users_sorted ]}

@app.get('/users')
def get_users(credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    users = db.query(User).all()
    return {"users": [ UserResponse(id=u.id, username=u.username, description=u.description, email=u.email, activities=[ActivityResponse(id=a.id, name=a.name) for a in u.activities]) for u in users ]}

@app.post('/group')
def create_group(group: GroupCreate, credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )
    
    if db.query(Group).filter(Group.group_name == group.group_name).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Group name already exists"
        )

    new_group = Group(
        group_name=group.group_name,
        group_description=group.group_description,
        category_id=group.group_category
    )

    db.add(new_group)
    db.commit()
    db.refresh(new_group)

    user2group = User2Group(
        user_id=user.id,
        group_id=new_group.id
    )

    db.add(user2group)
    db.commit()
    db.refresh(user2group)

    return {"group": GroupResponse(id=new_group.id, group_name=new_group.group_name, group_description=new_group.group_description, group_category=ActivityResponse(id=new_group.category.id, name=new_group.category.name))}

@app.get('/groups_unassigned')
def get_groups_unassigne(credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )
        
    user_group_ids = [g.id for g in user.groups]
    groups = db.query(Group).filter(~Group.id.in_(user_group_ids)).all()
    return {"groups": [ GroupResponse(id=g.id, group_name=g.group_name, group_description=g.group_description, group_category=ActivityResponse(id=g.category.id, name=g.category.name), users=[UserShortResponse(id=u.id, username=u.username, email=u.email) for u in g.users]) for g in groups ]}

@app.get('/groups_assigned')
def get_groups_assigned(credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )
        
    groups = user.groups
    return {"groups": [ GroupResponse(id=g.id, group_name=g.group_name, group_description=g.group_description, group_category=ActivityResponse(id=g.category.id, name=g.category.name), users=[UserShortResponse(id=u.id, username=u.username, email=u.email) for u in g.users]) for g in groups ]}

@app.post('/join_group/{group_id}')
def join_group(group_id: int, credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()
    print(group_id)
    if not auth(user, credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND
        )

    existing_join = db.query(User2Group).filter(
        User2Group.group_id == group_id,
        User2Group.user_id == user.id
    ).first()

    if existing_join:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already joined the group")

    user2group = User2Group(
        group_id=group_id,
        user_id=user.id
    )

    db.add(user2group)
    db.commit()
    db.refresh(user2group)

    return {"status": "200"}

@app.post('/leave_group/{group_id}')
def leave_group(group_id: int, credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    user2group = db.query(User2Group).filter(
        and_(
            User2Group.group_id == group_id,
            User2Group.user_id == user.id
        )
    ).first()

    if not user2group:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User is not a member of the group")

    db.delete(user2group)
    db.commit()
    
    if db.query(User2Group).filter(User2Group.group_id == group_id).first() is None:
        group_to_delete = db.query(Group).filter(Group.id == group_id).first()
        db.delete(group_to_delete)
        db.commit()

    return {"status": "200"}

@app.get('/get_events')
def get_events(credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    events = db.query(Event).all()

    organizer_ids = {e.organizerid for e in events}
    organizers = {u.id: u.username for u in db.query(User).filter(User.id.in_(organizer_ids)).all()}

    return {
        "events": [
            EventResponse(
                id=e.id,
                name=e.name,
                event_time=e.event_time,
                description=e.description,
                organizer_username=organizers.get(e.organizer_id),
                created_at=e.created_at,
                category=e.category
            ) for e in events
        ]
    }

@app.get('/get_events/{category}')
def get_events(category: str, credentials: Annotated[HTTPBasicCredentials, Depends(security)], db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == credentials.username).first()

    if not auth(user, credentials):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED
        )

    activity_id = db.query(Activity).filter(Activity.name == category).first()

    events = db.query(Event).filter(Event.category == activity_id.id).all()

    organizer_ids = {e.organizerid for e in events}
    organizers = {u.id: u.username for u in db.query(User).filter(User.id.in_(organizer_ids)).all()}

    return {
        "events": [
            EventResponse(
                id=e.id,
                name=e.name,
                event_time=e.event_time,
                description=e.description,
                organizer_username=organizers.get(e.organizer_id),
                created_at=e.created_at,
                category=e.category
            ) for e in events
        ]
    }
