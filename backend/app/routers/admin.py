import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload, selectinload
from typing import List
from app.database import get_db
from app.models import Checkin, User, Event
from app.schemas import UserCreate, User as UserSchema, EventCreate, Event as EventSchema, CheckinCreate, Checkin as CheckinSchema
from app.utils import get_password_hash
from app.auth import get_current_user

router = APIRouter()

async def get_current_admin_user(current_user: UserSchema = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=400, detail="Not enough permissions")
    return current_user

@router.get("/users", response_model=List[UserSchema])
async def read_users(db: AsyncSession = Depends(get_db), current_user: UserSchema = Depends(get_current_admin_user)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users

@router.post("/users", response_model=UserSchema)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_db), current_user: UserSchema = Depends(get_current_admin_user)):
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, hashed_password=hashed_password, role=user.role)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.put("/users/{user_id}", response_model=UserSchema)
async def update_user(user_id: int, user: UserCreate, db: AsyncSession = Depends(get_db), current_user: UserSchema = Depends(get_current_admin_user)):
    result = await db.execute(select(User).filter(User.id == user_id))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.username = user.username
    db_user.email = user.email
    db_user.hashed_password = get_password_hash(user.password)
    db_user.role = user.role
    await db.commit()
    await db.refresh(db_user)
    return db_user

@router.delete("/users/{user_id}", response_model=UserSchema)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db), current_user: UserSchema = Depends(get_current_admin_user)):
    result = await db.execute(select(User).filter(User.id == user_id))
    db_user = result.scalar_one_or_none()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    await db.delete(db_user)
    await db.commit()
    return db_user

@router.post("/events", response_model=EventSchema)
async def create_event(event: EventCreate, db: AsyncSession = Depends(get_db), current_user: UserSchema = Depends(get_current_admin_user)):
    db_event = Event(name=event.name, description=event.description, start_time=event.start_time, end_time=event.end_time)
    db.add(db_event)
    await db.commit()
    await db.refresh(db_event)
    return db_event

@router.get("/events", response_model=List[EventSchema])
async def read_events(db: AsyncSession = Depends(get_db), current_user: UserSchema = Depends(get_current_admin_user)):
    result = await db.execute(select(Event))
    events = result.scalars().all()
    return events

@router.get("/events/{event_id}", response_model=EventSchema)
async def get_event(event_id: int, db: AsyncSession = Depends(get_db), current_user: UserSchema = Depends(get_current_admin_user)):
    result = await db.execute(select(Event).filter(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event

@router.get("/events/{event_id}/checkins", response_model=List[CheckinSchema])
async def get_event_checkins(event_id: int, db: AsyncSession = Depends(get_db), current_user: UserSchema = Depends(get_current_admin_user)):
    result = await db.execute(
        select(Checkin).filter(Checkin.event_id == event_id).options(joinedload(Checkin.user))
    )
    checkins = result.scalars().all()
    return checkins

@router.delete("/events/{event_id}", response_model=EventSchema)
async def delete_event(event_id: int, db: AsyncSession = Depends(get_db), current_user: UserSchema = Depends(get_current_admin_user)):
    result = await db.execute(select(Event).filter(Event.id == event_id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    await db.delete(event)
    await db.commit()
    return event

@router.post("/checkins", response_model=CheckinSchema)
async def create_checkin(checkin: CheckinCreate, db: AsyncSession = Depends(get_db), current_user: UserSchema = Depends(get_current_admin_user)):
    # Check if the user exists
    user_result = await db.execute(
        select(User).filter(User.id == checkin.user_id)
    )
    user = user_result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if the user has already checked in for the event
    existing_checkin_result = await db.execute(
        select(Checkin).filter(Checkin.user_id == checkin.user_id, Checkin.event_id == checkin.event_id)
    )
    existing_checkin = existing_checkin_result.scalar_one_or_none()
    
    if existing_checkin:
        raise HTTPException(status_code=400, detail="User has already checked in for this event")
    
    # Create a new check-in if it doesn't exist
    utc_now = datetime.datetime.now(datetime.timezone.utc)
    naive_utc_now = utc_now.replace(tzinfo=None)
    db_checkin = Checkin(
        user_id=checkin.user_id,
        event_id=checkin.event_id,
        checkin_time=naive_utc_now  # Ensure naive datetime
    )
    db.add(db_checkin)
    await db.commit()
    await db.refresh(db_checkin)
    
    # Eager load user and event relationships
    result = await db.execute(
        select(Checkin)
        .options(selectinload(Checkin.user), selectinload(Checkin.event))
        .filter(Checkin.id == db_checkin.id)
    )
    db_checkin = result.scalar_one()

    return db_checkin

@router.get("/get_checkins", response_model=List[CheckinSchema])
async def read_checkins(db: AsyncSession = Depends(get_db), current_user: UserSchema = Depends(get_current_admin_user)):
    result = await db.execute(select(Checkin).options(selectinload(Checkin.user), selectinload(Checkin.event)))
    checkins = result.scalars().all()
    return checkins
