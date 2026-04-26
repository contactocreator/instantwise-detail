from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def generate_copy():
    return {"status": "not_implemented"}
