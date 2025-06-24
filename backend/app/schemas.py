from pydantic import BaseModel

class TaskBase(BaseModel):
    title: str

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    done: bool = False

    class Config:
        from_attributes = True  # для Pydantic v2, раньше было orm_mode = True
