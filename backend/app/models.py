# app/models.py
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="hacker")  # Default role is 'hacker'
    created_on = Column(DateTime, nullable=True)

    checkins = relationship("Checkin", back_populates="user")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)

    checkins = relationship("Checkin", back_populates="event", cascade="all, delete-orphan")

class Checkin(Base):
    __tablename__ = "checkins"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    event_id = Column(Integer, ForeignKey('events.id'))
    checkin_time = Column(DateTime, nullable=False)
    
    user = relationship("User", back_populates="checkins")
    event = relationship("Event", back_populates="checkins")
    
