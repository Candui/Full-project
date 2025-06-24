from pydantic import BaseModel

class TaskBase(BaseModel):
    title: str

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    done: bool

class Task(TaskBase):
    id: int
    done: bool

    class Config:
        from_attributes = True  # для pydantic v2, вместо orm_mode
