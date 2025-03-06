import os
import uuid
from typing import Any

from fastapi import APIRouter, HTTPException,status
from sqlmodel import func, select
from fastapi.responses import FileResponse

from app import crud
from app.api.deps import (
    SessionDep, CurrentUser,
)
from app.models import (
    Athlete,
    AthleteCreate,
    AthletePublic,
    AthletesPublic,
    AthleteUpdate,
    Message, User,
)

router = APIRouter(prefix="/athletes", tags=["athletes"])


@router.get("/", response_model=AthletesPublic)
def read_athletes(session: SessionDep, current_user: CurrentUser, skip: int = 0, limit: int = 100) -> Any:
    """
    Retrieve athletes.
    """
    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(Athlete)
        count = session.exec(count_statement).one()
        statement = (select(Athlete, User.full_name)
                     .join(User, Athlete.owner_id == User.id)
                     .offset(skip).limit(limit))
        athletes_ = session.exec(statement).all()
        athletes = [
            {
                **athlete.dict(),
                "unit": owner_name
            }
            for athlete, owner_name in athletes_
        ]
    else:
        count_statement = (
            select(func.count())
            .select_from(Athlete)
            .where(Athlete.owner_id == current_user.id)
        )
        count = session.exec(count_statement).one()
        statement = (
            select(Athlete)
            .where(Athlete.owner_id == current_user.id)
            .offset(skip)
            .limit(limit)
        )
        athletes = session.exec(statement).all()

    return AthletesPublic(data=athletes, count=count)


@router.post("/", response_model=AthletePublic)
def create_athlete(*, session: SessionDep,current_user: CurrentUser, athlete_in: AthleteCreate) -> Any:
    """
    Create new athlete.
    """
    athlete = crud.get_athlete_by_id_number(session=session, id_number=athlete_in.id_number)
    if athlete:
        raise HTTPException(
            status_code=400,
            detail="An athlete with this ID number already exists in the system.",
        )
    athlete = crud.create_athlete(session=session, athlete_create=athlete_in,owner_id=current_user.id)
    return athlete


@router.get("/{athlete_id}", response_model=AthletePublic)
def read_athlete_by_id(athlete_id: uuid.UUID, session: SessionDep) -> Any:
    """
    Get a specific athlete by id.
    """
    athlete = session.get(Athlete, athlete_id)
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")
    return athlete


@router.patch("/{athlete_id}", response_model=AthletePublic)
def update_athlete(
    *,
    session: SessionDep,
    athlete_id: uuid.UUID,
    athlete_in: AthleteUpdate,
) -> Any:
    """
    Update an athlete.
    """
    db_athlete = session.get(Athlete, athlete_id)
    if not db_athlete:
        raise HTTPException(
            status_code=404,
            detail="The athlete with this id does not exist in the system",
        )
    if athlete_in.id_number:
        existing_athlete = crud.get_athlete_by_id_number(session=session, id_number=athlete_in.id_number)
        if existing_athlete and existing_athlete.id != athlete_id:
            raise HTTPException(
                status_code=409, detail="Athlete with this ID number already exists"
            )

    db_athlete = crud.update_athlete(session=session, db_athlete=db_athlete, athlete_in=athlete_in)
    return db_athlete


@router.delete("/{athlete_id}")
def delete_athlete(
    session: SessionDep, athlete_id: uuid.UUID
) -> Message:
    """
    Delete an athlete.
    """
    athlete = session.get(Athlete, athlete_id)
    if not athlete:
        raise HTTPException(status_code=404, detail="Athlete not found")
    session.delete(athlete)
    session.commit()
    return Message(message="Athlete deleted successfully")

@router.get('/download-registration-form')
def download_registration_form(session: SessionDep, current_user: CurrentUser):
    file_path = "/Users/libiao/Desktop/full-stack-fastapi-template-master/LICENSE"

    # 检查文件是否存在
    if not os.path.exists(file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="文件不存在"
        )

    # 设置文件名
    filename = "运动员报名表.xlsx"

    # 返回文件响应
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
