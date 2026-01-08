from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.concurrency import run_in_threadpool
from typing import Optional, Dict, Any
import json
from datetime import datetime


from src.schemas import AnalysisResponse, ImprovedCVResult
from src.services.extractor import extract_text_from_bytes
from src.services.ai_engine import analyze_cv, customize_cv 
from src.services.scraper import scrape_job_with_jina

app = FastAPI(title="CV Analyzer API", version="1.6.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.api_route("/health", methods=["GET", "HEAD"])
async def health_check():
    """Health check endpoint for Docker healthcheck"""
    return {"status": "healthy", "service": "ai-engine"}

@app.post("/api/analyze")
async def analyze_endpoint(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
    job_url: Optional[str] = Form(None),
    current_date: Optional[str] = Form(None) 
):
  
    final_jd = ""
    if job_description and job_description.strip():
        final_jd = job_description

    elif job_url and job_url.strip():
        try:
            print(f"Fetching JD from URL: {job_url}")
            # Mencoba scraping
            scraped_text = await scrape_job_with_jina(job_url)
            
            # Validasi tambahan: Jika Jina return 200 OK tapi teks kosong
            if not scraped_text or not scraped_text.strip():
                raise ValueError("Website dapat diakses namun konten kosong/tidak terbaca.")
                
            final_jd = scraped_text

        except Exception as e:
            print(f"Scraping Error: {e}")
            raise HTTPException(
                status_code=400, 
                detail=f"Gagal mengambil Job Description dari URL. Pastikan link publik/valid. Error: {str(e)}"
            )
    
    # [LOGIC BARU] Prioritas 3: Fallback ke General Analysis HANYA jika tidak ada input sama sekali
    # Blok ini tidak akan dieksekusi jika URL error, karena sudah terpotong oleh raise HTTPException di atas.
    if not final_jd:
        final_jd = "AUTO_DETECT_ROLE"

    
    content = await file.read()
    try:
        cv_text = await run_in_threadpool(
            extract_text_from_bytes, 
            content, 
            file.content_type
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Gagal membaca file: {str(e)}")

    if len(cv_text) < 50:
        raise HTTPException(status_code=400, detail="CV terlalu pendek atau kosong.")

   
    try:
        
        result = await analyze_cv(cv_text, final_jd, current_date)
        
        if not result:
            raise HTTPException(status_code=500, detail="AI Analysis returned empty result.")
            
        return result

    except Exception as e:
        print(f"AI Error: {e}")
        raise HTTPException(status_code=500, detail=f"AI Engine Error: {str(e)}")


@app.post("/api/customize", response_model=ImprovedCVResult)
async def customize_endpoint(
    file: UploadFile = File(...),
    mode: str = Form(...),
    job_description: Optional[str] = Form(None),
    analysis_context: Optional[str] = Form(None),
    current_date: Optional[str] = Form(None)
):
    final_context = ""
    
    if mode == "job_desc":
        if not job_description:
            raise HTTPException(400, "Mode 'job_desc' wajib menyertakan job_description.")
        final_context = job_description
        
    elif mode == "analysis":
        if not analysis_context:
            final_context = "Fix general weaknesses found in the CV."
        else:
            final_context = analysis_context 
    else:
        raise HTTPException(400, "Mode tidak valid.")

  
    content = await file.read()
    try:
        cv_text = await run_in_threadpool(
            extract_text_from_bytes, 
            content, 
            file.content_type
        )
    except Exception as e:
        raise HTTPException(400, f"Gagal membaca file: {str(e)}")

    
    try:
        result = await customize_cv(cv_text, mode, final_context, current_date)
        return result
    except Exception as e:
        print(f"Customize Error: {e}")
        raise HTTPException(500, "Gagal meng-generate CV baru.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True, timeout_keep_alive=30)