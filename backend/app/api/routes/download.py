import os
from fastapi import APIRouter, HTTPException,status
from fastapi.responses import FileResponse
from app.api.deps import (
    SessionDep, CurrentUser,
)

router = APIRouter(prefix="/download", tags=["download"])


@router.get('/download-registration-form')
def download_registration_form(session: SessionDep, current_user: CurrentUser):
    file_path = "/Users/libiao/Desktop/full-stack-fastapi-template-master/工作簿2.xlsx"

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
