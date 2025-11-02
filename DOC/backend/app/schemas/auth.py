from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: str
    email: str
    role: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    
    class Config:
        from_attributes = True

