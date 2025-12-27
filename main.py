from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
import requests
import random

app = FastAPI(title="Viani Skin & Body Problem Detection API")

# Allow frontend access (React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Jinja2Templates(directory="templates")

@app.get("/")
def home():
    return {"message": "Welcome to Viani Skin & Body Problem Detection API"}

@app.post("/analyze/")
async def analyze_problem(
    description: str = Form(...),
    image: UploadFile = None
):
    """
    Analyze both text description and (optional) image input.
    """
    analysis_result = {}
    desc_lower = description.lower()

    # 🧠 TEXT ANALYSIS SECTION
    if any(word in desc_lower for word in ["acne", "pimple", "zit", "oily skin"]):
        analysis_result = {
            "condition": "Acne",
            "causes": "Clogged pores and excess oil production.",
            "suggestion": "Use a mild oil-free cleanser and avoid touching your face.",
            "seriousness": "low"
        }

    elif any(word in desc_lower for word in ["rash", "rashes", "itching", "irritation", "allergy", "red spots"]):
        analysis_result = {
            "condition": "Skin Rash or Allergy",
            "causes": "Reaction to allergens, heat, or sweat.",
            "suggestion": "Apply calamine lotion or hydrocortisone cream. Keep area clean.",
            "seriousness": "medium"
        }

    elif any(word in desc_lower for word in ["scar", "mark", "wound", "injury", "cut", "bruise"]):
        analysis_result = {
            "condition": "Skin or Body Scar",
            "causes": "Post-injury or acne marks on skin/body.",
            "suggestion": "Use scar-reducing cream and moisturize regularly.",
            "seriousness": "low"
        }

    elif any(word in desc_lower for word in ["burn", "burnt", "blister"]):
        analysis_result = {
            "condition": "Skin Burn",
            "causes": "Thermal or chemical damage to skin layers.",
            "suggestion": "Cool the area with water, avoid breaking blisters, and use burn cream.",
            "seriousness": "high"
        }

    elif any(word in desc_lower for word in ["dry", "flaky", "rough skin"]):
        analysis_result = {
            "condition": "Dry Skin",
            "causes": "Dehydration or lack of moisture.",
            "suggestion": "Use moisturizer regularly and avoid hot showers.",
            "seriousness": "low"
        }

    else:
        analysis_result = {
            "condition": "Unclear",
            "causes": "Could not determine based on text alone.",
            "suggestion": "Consider uploading an image for better detection.",
            "seriousness": "unknown"
        }

    # 🩺 IMAGE ANALYSIS (Optional + Fallback)
    image_prediction = None
    if image:
        try:
            img_bytes = await image.read()
            image_model_url = "https://api-inference.huggingface.co/models/google/vit-base-patch16-224"
            headers = {"Authorization": "Bearer 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"}

            response = requests.post(image_model_url, headers=headers, data=img_bytes)
            print("HF Status:", response.status_code)

            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    top = result[0]
                    image_prediction = {
                        "predicted_label": top.get("label", "Unknown Object"),
                        "confidence": round(top.get("score", 0) * 100, 2),
                        "mode": "Hugging Face Model"
                    }
                else:
                    raise ValueError("No valid predictions returned from HF model.")
            else:
                raise ConnectionError(f"HF API failed with status {response.status_code}")

        except Exception as e:
            print("⚠️ Hugging Face unavailable, switching to fallback mode:", e)

            # 🧩 Fallback mode (local demo prediction)
            fallback_labels = [
                {"label": "Acne", "confidence": random.uniform(80, 95)},
                {"label": "Skin Rash", "confidence": random.uniform(75, 90)},
                {"label": "Scar", "confidence": random.uniform(78, 93)},
                {"label": "Burn", "confidence": random.uniform(82, 96)},
                {"label": "Dry Skin", "confidence": random.uniform(70, 88)},
            ]
            chosen = random.choice(fallback_labels)
            image_prediction = {
                "predicted_label": chosen["label"],
                "confidence": round(chosen["confidence"], 2),
                "mode": "Offline Fallback (Demo)"
            }

    # 🧾 FINAL RESPONSE
    final_response = {
        "text_analysis": analysis_result,
        "image_analysis": image_prediction if image_prediction else None,
        "recommendation": (
            "If symptoms persist or worsen, please consult a certified dermatologist."
            if analysis_result["seriousness"] in ["medium", "high"]
            else "Follow home care suggestions and monitor the condition."
        ),
        "status": "success"
    }

    return JSONResponse(content=final_response)
