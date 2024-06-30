# app/schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    id: int
    username: str
    email: str
    created_on: Optional[datetime]  # Make this field optional

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    role: Optional[str] = "hacker"  # Adding the role field with default value

    

class User(UserBase):
    role: str

class EventBase(BaseModel):
    name: str
    description: Optional[str] = None
    start_time: datetime
    end_time: datetime

    class Config:
        orm_mode = True

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int

    class Config:
        orm_mode = True

class CheckinCreate(BaseModel):
    user_id: int
    event_id: int

class Checkin(BaseModel):
    checkin_time: datetime
    id: int
    user: Optional[UserBase]  # Include user in the Checkin schema for relationships

    class Config:
        orm_mode = True

class CheckinResponse(Checkin):
    event: Event

    class Config:
        orm_mode = True


class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
