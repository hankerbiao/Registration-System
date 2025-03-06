import uuid
from enum import Enum
from typing import Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    athletes_count: Optional[int] = None
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    athletes: list["Athlete"] = Relationship(back_populates="owner", cascade_delete=True)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID
    athletes_count: Optional[int] = None


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


class Gender(str, Enum):
    MALE = "男"
    FEMALE = "女"

class KumiteCategory(str, Enum):
    A = "甲组"
    B = "乙组"
    C = "丙组"

class MaleKumiteIndividual(str, Enum):
    KG_55 = "-55kg"
    KG_59 = "-59kg"
    KG_63 = "-63kg"
    KG_67 = "-67kg"
    KG_71 = "-71kg"
    KG_75 = "-75kg"
    KG_79 = "-79kg"
    KG_PLUS_79 = "+79kg"
    NOT_PARTICIPATING = "不参加"

class FemaleKumiteIndividual(str, Enum):
    KG_49 = "-49kg"
    KG_53 = "-53kg"
    KG_57 = "-57kg"
    KG_61 = "-61kg"
    KG_PLUS_61 = "+61kg"
    NOT_PARTICIPATING = "不参加"

class KumiteTeam(str, Enum):
    TEAM_1 = "团体1组"
    TEAM_2 = "团体2组"
    NOT_PARTICIPATING = "不参加"

class IndividualKata(str, Enum):
    HEIAN_NIDAN = "平安二段"
    HEIAN_SANDAN = "平安三段"
    BASSAI_DAI = "拔塞大 Bassai Dai"
    NOT_PARTICIPATING = "不参加"

class TeamCategory(str, Enum):
    TEAM_1 = "一队"
    TEAM_2 = "二队"
    KG_PLUS_61 = "不参加"

# Shared properties
class AthleteBase(SQLModel):
    name: str = Field(index=True, max_length=255)
    gender: str
    id_number: str = Field(unique=True, index=True, max_length=18)
    kumite_category: str
    kumite_individual: str
    kumite_team: str
    individual_kata: str
    mixed_double_kata: str
    team_kata: str
    mixed_team_kata: str

# Properties to receive via API on creation
class AthleteCreate(AthleteBase):
    pass

# Properties to receive via API on update, all are optional
class AthleteUpdate(SQLModel):
    name: Optional[str] = Field(default=None, max_length=255)
    gender: Optional[str] = None
    id_number: Optional[str] = Field(default=None, max_length=18)
    kumite_category: Optional[str] = None
    kumite_individual: Optional[str] = None
    kumite_team: Optional[str] = None
    individual_kata: Optional[str] = None
    mixed_double_kata: Optional[str] = None
    team_kata: Optional[str] = None
    mixed_team_kata: Optional[str] = None

# Database model, database table inferred from class name
class Athlete(AthleteBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="athletes")
# Properties to return via API, id is always required
class AthletePublic(AthleteBase):
    id: uuid.UUID
    unit: str = None

class AthletesPublic(SQLModel):
    data: list[AthletePublic]
    count: int