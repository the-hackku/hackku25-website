from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from pydantic import EmailStr, ValidationError
from fastapi.security import OAuth2PasswordRequestForm
from app.database import get_db
from app.models import User, Checkin
from app.schemas import UserCreate, User as UserSchema, Token, CheckinResponse as CheckinSchema
from app.utils import get_password_hash, verify_password
from app.auth import create_access_token, get_current_user
from sqlalchemy.orm import joinedload
from typing import List
import datetime
import pytz

router = APIRouter()

@router.post("/register", response_model=UserSchema)
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Custom email validation
    try:
        EmailStr._validate(user.email)
    except ValidationError:
        raise HTTPException(status_code=400, detail="Invalid email")
    
    # Check if the email or username already exists
    existing_user_result = await db.execute(
        select(User).filter((User.email == user.email) | (User.username == user.username))
    )
    existing_user = existing_user_result.scalar_one_or_none()
    if existing_user:
        if existing_user.email == user.email:
            raise HTTPException(status_code=400, detail="Email already registered")
        elif existing_user.username == user.username:
            raise HTTPException(status_code=400, detail="Username already taken")

    # Hash the password and create the user
    hashed_password = get_password_hash(user.password)
    utc_now = datetime.datetime.now(pytz.utc)  # Ensure UTC timezone
    naive_utc_now = utc_now.replace(tzinfo=None)  # Convert to naive datetime
    db_user = User(
        username=user.username, 
        email=user.email, 
        hashed_password=hashed_password, 
        role=user.role, 
        created_on=naive_utc_now  # Use naive datetime
    )
    
    db.add(db_user)
    try:
        await db.commit()
        await db.refresh(db_user)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(status_code=400, detail="An error occurred during registration")
    
    return db_user

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.email == form_data.username))
    user = result.scalar_one_or_none()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.username, "user_id": user.id})  # Include user_id in token
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: UserSchema = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).filter(User.id == current_user.id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.get("/me/checkins", response_model=List[CheckinSchema])
async def read_user_checkins(current_user: UserSchema = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Checkin).filter(Checkin.user_id == current_user.id).options(joinedload(Checkin.event))
    )
    checkins = result.scalars().all()
    return checkins
