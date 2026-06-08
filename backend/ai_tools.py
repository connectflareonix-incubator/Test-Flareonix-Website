"""Flareonix AI Tools - Claude Sonnet 4.5 powered generators"""
import os
import uuid
from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from emergentintegrations.llm.chat import LlmChat, UserMessage


CLAUDE_MODEL = "claude-sonnet-4-5-20250929"


def _key() -> str:
    k = os.environ.get("EMERGENT_LLM_KEY")
    if not k:
        raise HTTPException(status_code=500, detail="LLM key not configured")
    return k


# ==================== TOOL CONFIGS ====================

TOOL_CONFIGS = {
    "caption": {
        "name": "Caption Generator",
        "system": (
            "You are Flareonix's social-media caption expert. Write 5 viral, scroll-stopping "
            "captions for the user's brief. Each caption: punchy, on-brand, includes 3-5 "
            "relevant hashtags, ends with a CTA or hook. Number them 1-5. Use emojis sparingly "
            "(max 2 per caption). No fluff, no explanations."
        ),
    },
    "ad-copy": {
        "name": "Ad Copy Writer",
        "system": (
            "You are Flareonix's performance marketing copywriter. Generate 3 high-converting "
            "ad-copy variants (Meta + Google compatible) for the user's product/service. "
            "For each variant include: HEADLINE (max 30 chars), PRIMARY TEXT (max 125 chars), "
            "DESCRIPTION (max 90 chars), and a CTA. Format clearly with labels. "
            "Speak to the target audience, lead with a hook, and emphasise outcome."
        ),
    },
    "business-idea": {
        "name": "Business Idea Generator",
        "system": (
            "You are Flareonix's startup ideator for ambitious Indian youth. Given the user's "
            "skills/interests/budget, propose 3 validated, lean business ideas. For each idea "
            "include: TITLE, ONE-LINER, TARGET CUSTOMER, MVP IN 30 DAYS, REVENUE MODEL, "
            "INDIA-SPECIFIC EDGE. Be concrete, ground-level, no generic SaaS clichés."
        ),
    },
    "content-calendar": {
        "name": "Content Calendar",
        "system": (
            "You are Flareonix's content strategist. Build a 7-day content calendar for the "
            "user's niche. Output a markdown table with columns: Day | Platform | Content Type "
            "| Hook/Idea | CTA. Mix Reels, carousels, stories, and tweets. Each idea must be "
            "punchy, actionable, and aligned to growth."
        ),
    },
    "email-writer": {
        "name": "Email Writer",
        "system": (
            "You are Flareonix's cold-email expert. Write a short, personalised cold email "
            "based on the user's goal and recipient. Include: subject line (under 8 words), "
            "opener (1 line, hyper-specific), value (2-3 lines, outcome-led), CTA (1 line, "
            "low-friction ask). Keep total body under 90 words. No corporate jargon."
        ),
    },
    "pitch-deck": {
        "name": "Pitch Deck Assistant",
        "system": (
            "You are Flareonix's pitch-deck coach for early-stage founders. Given the user's "
            "startup brief, output a 10-slide investor-ready outline. For each slide give: "
            "SLIDE TITLE, KEY MESSAGE (1 line), and 3 BULLETS. Slides: 1) Vision, 2) Problem, "
            "3) Solution, 4) Market, 5) Product, 6) Traction, 7) Business Model, 8) "
            "Competition, 9) Team, 10) Ask. Be sharp and specific."
        ),
    },
}


# ==================== MODELS ====================

class GenerateRequest(BaseModel):
    tool: str
    prompt: str = Field(..., min_length=5, max_length=2000)
    session_id: Optional[str] = None


class GenerationDoc(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_email: str
    tool: str
    tool_name: str
    prompt: str
    response: str
    session_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# ==================== ROUTER ====================

def build_router(db, get_current_user):
    router = APIRouter(prefix="/api/ai", tags=["ai-tools"])

    @router.get("/tools")
    async def list_tools():
        """Public list of available tools"""
        return [{"slug": k, "name": v["name"]} for k, v in TOOL_CONFIGS.items()]

    @router.post("/generate")
    async def generate(req: GenerateRequest, user: dict = Depends(get_current_user)):
        """Generate content using Claude Sonnet 4.5"""
        cfg = TOOL_CONFIGS.get(req.tool)
        if not cfg:
            raise HTTPException(status_code=400, detail="Unknown tool")

        session_id = req.session_id or f"ai_{user['user_id']}_{req.tool}_{uuid.uuid4().hex[:8]}"

        try:
            chat = LlmChat(
                api_key=_key(),
                session_id=session_id,
                system_message=cfg["system"],
            ).with_model("anthropic", CLAUDE_MODEL)

            response_text = await chat.send_message(UserMessage(text=req.prompt))
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"AI generation failed: {str(e)[:200]}")

        doc = GenerationDoc(
            user_id=user["user_id"],
            user_email=user["email"],
            tool=req.tool,
            tool_name=cfg["name"],
            prompt=req.prompt,
            response=response_text,
            session_id=session_id,
        ).model_dump()
        doc["created_at"] = doc["created_at"].isoformat()
        await db.ai_generations.insert_one(doc)

        return {
            "id": doc["id"],
            "tool": req.tool,
            "tool_name": cfg["name"],
            "prompt": req.prompt,
            "response": response_text,
            "session_id": session_id,
            "created_at": doc["created_at"],
        }

    @router.get("/history")
    async def history(user: dict = Depends(get_current_user)):
        """Get current user's last 50 generations"""
        items = await db.ai_generations.find(
            {"user_id": user["user_id"]}, {"_id": 0}
        ).sort("created_at", -1).to_list(50)
        return items

    @router.delete("/history/{gen_id}")
    async def delete_generation(gen_id: str, user: dict = Depends(get_current_user)):
        """Delete a generation owned by the user"""
        res = await db.ai_generations.delete_one(
            {"id": gen_id, "user_id": user["user_id"]}
        )
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Not found")
        return {"success": True}

    return router
