from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import users, admin
from contextlib import asynccontextmanager

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app.router.lifespan_context = lifespan

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
