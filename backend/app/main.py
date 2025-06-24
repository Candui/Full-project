from fastapi import FastAPI, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from .schemas import Task, TaskCreate
from .crud import get_tasks, create_task, delete_task
from .database import SessionLocal, engine
from .models import Base

Base.metadata.create_all(bind=engine)

app = FastAPI()

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
