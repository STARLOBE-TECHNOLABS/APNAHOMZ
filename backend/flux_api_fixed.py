import os
import io
import base64
import torch
from uuid import uuid4
from typing import Optional

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from PIL import Image

from diffusers import FluxPipeline, FluxImg2ImgPipeline

# --------------------------------------------------
# Force HuggingFace cache into volume disk
# --------------------------------------------------

os.environ["HF_HOME"] = "/workspace/huggingface"
os.environ["TRANSFORMERS_CACHE"] = "/workspace/huggingface"

# Optional memory fragmentation fix
os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True"

app = FastAPI()

print("Loading FLUX models from local volume...")

MODEL_PATH = "/workspace/flux_model"

# --------------------------------------------------
# Load BOTH pipelines (txt2img and img2img)
# --------------------------------------------------

# Text-to-image pipeline
pipe_txt2img = FluxPipeline.from_pretrained(
    MODEL_PATH,
    torch_dtype=torch.bfloat16,
    device_map="balanced",
    local_files_only=True
)
pipe_txt2img.enable_attention_slicing()
pipe_txt2img.enable_vae_slicing()

# Image-to-image pipeline
pipe_img2img = FluxImg2ImgPipeline.from_pretrained(
    MODEL_PATH,
    torch_dtype=torch.bfloat16,
    device_map="balanced",
    local_files_only=True
)
pipe_img2img.enable_attention_slicing()
pipe_img2img.enable_vae_slicing()

print("Models loaded successfully.")

class GenerateRequest(BaseModel):
    prompt: str
    width: int = Field(default=1024, ge=512, le=2048)
    height: int = Field(default=1024, ge=512, le=2048)
    steps: int = Field(default=30, ge=1, le=50)
    guidance: float = Field(default=3.5, ge=1.0, le=20.0)
    image: Optional[str] = None
    strength: float = Field(default=0.75, ge=0.0, le=1.0)
    negative_prompt: Optional[str] = None

# --------------------------------------------------
# Base64 Decoder
# --------------------------------------------------

def decode_base64_image(base64_string: str) -> Image.Image:
    try:
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        if image.mode != "RGB":
            image = image.convert("RGB")
        return image
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image data: {str(e)}")

# --------------------------------------------------
# Generate Endpoint
# --------------------------------------------------

@app.post("/generate")
def generate_image(data: GenerateRequest):
    try:
        print("Received generation request")

        if data.image:
            print(f"Running image-to-image with strength={data.strength}")
            
            init_image = decode_base64_image(data.image)
            
            # Resize to requested dimensions
            if init_image.size != (data.width, data.height):
                init_image = init_image.resize((data.width, data.height), Image.LANCZOS)
            
            result = pipe_img2img(
                prompt=data.prompt,
                image=init_image,
                strength=data.strength,
                guidance_scale=data.guidance,
                num_inference_steps=data.steps,
            )
        else:
            print("Running text-to-image")
            
            result = pipe_txt2img(
                prompt=data.prompt,
                height=data.height,
                width=data.width,
                guidance_scale=data.guidance,
                num_inference_steps=data.steps,
            )

        image = result.images[0]

        filename = f"/workspace/output_{uuid4()}.png"
        image.save(filename)

        print(f"Image saved to: {filename}")

        return FileResponse(filename, media_type="image/png")

    except Exception as e:
        print(f"Generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/health")
def health_check():
    return {"status": "healthy"}
