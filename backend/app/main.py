from fastapi import FastAPI, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from .schemas import Task, TaskCreate, TaskUpdate
from .crud import get_tasks, create_task, delete_task, update_task
from .database import SessionLocal, engine
from .models import Base
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Для DEV! На PROD укажи только доверенные домены.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/healthcheck")
def healthcheck():
    return {"status": "ok"}

@app.get("/tasks", response_model=List[Task])
def read_tasks(db: Session = Depends(get_db)):
    return get_tasks(db)

@app.post("/tasks", response_model=Task)
def add_task(task: TaskCreate, db: Session = Depends(get_db)):
    return create_task(db, task)

@app.delete("/tasks/{task_id}", response_model=Task)
def remove_task(task_id: int, db: Session = Depends(get_db)):
    result = delete_task(db, task_id)
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    return result

# === PATCH (отметить выполнено/не выполнено) ===
@app.patch("/tasks/{task_id}", response_model=Task)
def patch_task(task_id: int, task_update: TaskUpdate, db: Session = Depends(get_db)):
    result = update_task(db, task_id, task_update)
    if not result:
        raise HTTPException(status_code=404, detail="Task not found")
    return result
