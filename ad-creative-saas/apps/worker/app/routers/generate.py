from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def generate_image():
    return {"status": "not_implemented"}
