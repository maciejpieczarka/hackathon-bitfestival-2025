from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True)
    password = Column(String(255))
    email = Column(String(255), unique=True, index=True)

    events = relationship("Event", back_populates="organizer")

class Event(Base):
    __tablename__ = 'events'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    event_time = Column(DateTime, index=True)
    description = Column(String(1000), index=True)
    organizer_id = Column(ForeignKey('users.id'), index=True)
    created_at = Column(DateTime, server_default=func.now())

    organizer = relationship("User", back_populates="events")

class User2Event(Base):
    __tablename__ = 'user2event'

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(ForeignKey('event.id'), index=True)
    user_id = Column(ForeignKey('users.id'), index=True)