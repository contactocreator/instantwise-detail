from fastapi import APIRouter

router = APIRouter()

@router.post("/")
async def analyze_reference():
    return {"status": "not_implemented"}
