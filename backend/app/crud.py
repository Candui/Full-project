from sqlalchemy.orm import Session
from .schemas import TaskCreate
from .models import Task  # ← правильно!

def get_tasks(db):
    return db.query(Task).all()
# и так далее



def get_tasks(db: Session):
    return db.query(Task).all()

def create_task(db: Session, task: TaskCreate):
    db_task = Task(title=task.title)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int):
    task = db.query(Task).filter(Task.id == task_id).first()
    if task:
        db.delete(task)
        db.commit()
        return task
    return None

def update_task(db, task_id, task_update):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        return None
    if hasattr(task_update, "done"):
        db_task.done = task_update.done
    db.commit()
    db.refresh(db_task)
    return db_task
