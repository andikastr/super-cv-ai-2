import os
import json
import asyncio
import re
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from google.genai import types
from src.schemas import AnalysisResponse, ImprovedCVResult, CVContactInfo

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# --- KONFIGURASI MODEL (MODEL ROUTING) ---
FAST_MODEL = "gemini-2.5-flash-lite"  
REASONING_MODEL = "gemini-2.5-flash" 

# Sanitasi Input
def sanitize_content(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

# Smart JSON Parsing
def clean_json_text(text: str) -> str:
    try:
        if "```json" in text:
            return text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            return text.split("```")[1].split("```")[0].strip()
        
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return match.group(0)
            
        return text.strip()
    except Exception:
        return text

# [MODIFIED] Menambahkan parameter `model_name`
async def generate_with_retry(contents, config, model_name, retries=3):
    """
    Melakukan panggilan ke AI dengan auto-retry.
    Sekarang menerima `model_name` secara dinamis.
    """
    last_exception = None
    for attempt in range(retries):
        try:
            response = await asyncio.to_thread(
                client.models.generate_content,
                model=model_name, # Menggunakan model yang di-inject
                contents=contents,
                config=config
            )
            return response
        except Exception as e:
            print(f"Gemini API ({model_name}) Attempt {attempt+1}/{retries} failed: {e}")
            last_exception = e
            if attempt < retries - 1:
                await asyncio.sleep(1 * (2 ** attempt))
    
    raise last_exception

async def extract_data_only(cv_text: str) -> ImprovedCVResult:
    clean_cv = sanitize_content(cv_text)

    prompt_text = f"""
    You are a strict data parser. 
    Extract the following CV text into a structured JSON format matching this schema.
    
    RULES:
    1. DO NOT rewrite, improve, or change the content. Extract it exactly as is.
    2. If a field is missing, use an empty string "" or empty list [].
    3. HYPERLINKS: If you find text in format "Text [URL]", render it as HTML: <a href='URL'>Text</a>.
    4. Do not use markdown for links, use strictly HTML <a> tags.
    
    CV TEXT:
    {clean_cv}

    OUTPUT SCHEMA: ImprovedCVResult (JSON)
    """
    try:
        
        response = await generate_with_retry(
            contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt_text)])],
            config=types.GenerateContentConfig(
                response_mime_type="application/json", 
                response_schema=ImprovedCVResult,
                temperature=0.0
            ),
            model_name=FAST_MODEL # <--- Explicitly use Fast Model
        )
        if response.parsed: return response.parsed
        return ImprovedCVResult(**json.loads(clean_json_text(response.text)))
    except Exception as e:
        print(f"Extract Error: {e}")
        return ImprovedCVResult(
            full_name="Candidate", professional_summary="", 
            contact_info=CVContactInfo(email="", phone="", location=""), 
            hard_skills=[], soft_skills=[], work_experience=[], education=[], projects=[]
        )


async def analyze_cv(cv_text: str, job_desc: str, current_date: str = None):
    
    if not current_date:
        current_date = datetime.now().strftime("%Y-%m-%d")

    clean_cv = sanitize_content(cv_text)

    is_auto_detect = False
    final_job_desc = job_desc
    # Logic pengecekan flag dari main.py
    if not job_desc or job_desc.strip() == "" or job_desc == "AUTO_DETECT_ROLE":
        is_auto_detect = True
        # Placeholder sementara agar variabel tidak kosong
        final_job_desc = "DYNAMIC_INFERENCE_MODE"

    async def _perform_analysis():
        if is_auto_detect:
            # Logic: 1. Baca CV -> 2. Tentukan Role -> 3. Nilai berdasarkan Role itu
            role_context_instruction = """
            *** NO JOB DESCRIPTION PROVIDED - AUTO-INFERENCE MODE ***
            1. **IDENTIFY ROLE**: First, deep-read the candidate's CV to determine their primary professional role (e.g., "Senior Business Development Manager", "Junior Data Analyst", "Marketing Specialist").
            2. **ESTABLISH STANDARD**: Mentally retrieve the standard industry Job Description and requirements for that SPECIFIC identified role.
            3. **ANALYZE**: Score and evaluate the candidate SOLELY based on how well they fit the standard requirements for the role you identified in step 1.
            
            *IMPORTANT*: In the 'overall_summary', explicitly state: "Analyzed based on inferred role: [Insert Role Name]"
            """
            
            # Kita kosongkan field JOB DESCRIPTION di prompt agar AI fokus ke instruksi di atas
            jd_display = "Not Provided (Please infer role from CV as instructed above)"
        else:
            # Jika ada JD asli (Url/Text), gunakan instruksi standar
            role_context_instruction = "Analyze the candidate CV strictly against the provided JOB DESCRIPTION below."
            jd_display = final_job_desc
        
        prompt_text = f"""
        You are a Senior Technical Recruiter and CV Expert.
        {role_context_instruction}. Use "You" to address the candidate directly.

        *** TIME CONTEXT (CRITICAL) ***:
        - Today's Date is: **{current_date}**.
        - Any experience listed with a year equal to or before the current year ({current_date.split('-')[0]}) is VALID.
        - DO NOT flag "{current_date.split('-')[0]}" (Current Year) as a "future date error".
        - "Present" or "Current" means valid up to today.

        *** LANGUAGE INSTRUCTION (CRITICAL) ***:
        1. **DETECT LANGUAGE**: Identify the dominant language used in the "CANDIDATE CV CONTENT".
        2. **OUTPUT LANGUAGE**: 
           - IF the CV is in **Indonesian** -> ALL your feedback, summaries, details, and action items MUST be in **INDONESIAN**.
           - IF the CV is in **English** -> ALL your feedback, summaries, details, and action items MUST be in **ENGLISH**.
        3. Do not mix languages (e.g., do not write English feedback for an Indonesian CV).

        JOB DESCRIPTION:
        {jd_display}

        CANDIDATE CV CONTENT:
        {clean_cv}

        Please perform a deep analysis based on these 6 specific criteria:
        1. **Candidate Overview**:
           - Extract the candidate's full name.
           - Give an overall score (1-100).
           - Provide detailed feedback summarizing strengths and weaknesses.
        
        2. **Writing Style (Score 0-100)**: 
           - Check for clarity, grammar, and typos.
        
        3. **CV Format & ATS (Score 0-100)**: 
           - Is the format ATS-friendly?
        
        4. **Skill Match (Score 0-100)**: 
           - How well do the hard skills and soft skills match the Job Description? Mostly focus on the hard skills.
        
        5. **Experience & Projects (Score 0-100)**:
           - **CRITICAL SCORING LOGIC**: Score STRICTLY based on **Relevance to the Job Description**, not just general seniority.
           - **Domain Alignment Check**: 
             - If the candidate has senior experience in a **different field** (e.g., Candidate is an ML Engineer, Job is Business Dev), the score MUST be **LOW (under 50)**.
             - If the candidate's past projects directly solve the problems listed in the JD, the score should be **HIGH**.
           - Define the main seniority level relative to the specific JD (Junior, Mid, Senior, Lead). 
           - CHECK DATES CAREFULLY: Do not incorrectly mark valid recent dates as future errors based on the 'Today's Date' provided above.

        6. **Keyword Relevance & Critical Gaps (Score 0-100)**:
           - Identify critical gaps.
           - **CRITICAL INSTRUCTION**: For EACH gap identified, provide a specific "action". 
             Example: Gap="Docker", Action="Build a simple microservice using Docker."

        *** REQUIRED JSON OUTPUT FORMAT ***
        You MUST output strictly JSON matching the AnalysisResponse schema.

        """
        
        try:
            
            response = await generate_with_retry(
                contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt_text)])],
                config=types.GenerateContentConfig(
                    response_mime_type="application/json", 
                    response_schema=AnalysisResponse,
                    temperature=0.0,
                    top_p=0.1,
                    top_k=20
                ),
                model_name=REASONING_MODEL 
            )
            if response.parsed: 
                return response.parsed
            else:
                return AnalysisResponse(**json.loads(clean_json_text(response.text)))
                
        except Exception as e:
            print(f"Analyze Error: {e}")
            return AnalysisResponse(
                candidate_name="Unknown", overall_score=0, overall_summary=f"Error: {str(e)}",
                writing_score=0, writing_detail="", ats_score=0, ats_detail="",
                skill_score=0, skill_detail="", experience_score=0, experience_detail="",
                keyword_score=0, critical_gaps=[]
            )

    # Eksekusi Paralel:
    # 1. Analisis butuh waktu lama & otak kuat -> REASONING_MODEL
    # 2. Ekstraksi data butuh cepat -> FAST_MODEL
    analysis_res, original_data = await asyncio.gather(
        _perform_analysis(),
        extract_data_only(clean_cv)
    )

    avg_score = (
        analysis_res.ats_score + 
        analysis_res.writing_score + 
        analysis_res.skill_score + 
        analysis_res.experience_score
    ) / 4
    analysis_res.overall_score = int(round(avg_score))

    return {
        "analysis": analysis_res.model_dump(),
        "cv_data": original_data.model_dump()
    }

async def customize_cv(cv_text: str, mode: str, context_data: str, current_date: str = None):
    
    if not current_date:
        current_date = datetime.now().strftime("%Y-%m-%d")

    clean_cv = sanitize_content(cv_text)

    if mode == 'job_desc':
        mode_context = f"TARGET JOB DESCRIPTION: {context_data}"
        goal = "Tailor the CV keywords to match the Target Job, but PRESERVE the candidate's history."
    else: 
        mode_context = f"ANALYSIS FEEDBACK: {context_data}"
        goal = "Improve the CV based on the weakness analysis provided."

    prompt_text = f"""
    You are an Expert Resume Writer. Your task is to REWRITE the candidate's CV to be world-class, ATS-friendly, and high-impact.
    
    CONTEXT:
    - Today's Date: {current_date}
    - {mode_context}
    
    GOAL: {goal}

    ORIGINAL CV CONTENT:
    {clean_cv}
    
    *** CRITICAL RULES ***:
    1. **NO DELETION**: Preserve all work history.
    2. **NO HALLUCINATIONS**: Do not invent skills.
    3. **LINKS**: Preserve all URLs. Convert "Text [URL]" to <a href='URL'>Text</a>.
    3. **DATE ACCURACY**: Ensure dates are formatted correctly relative to today ({current_date}). 
       If a job is current, ensure it is clear (e.g., "Jan 2024 - Present").
    4. **LANGUAGE CONSISTENCY (IMPORTANT)**: 
       - Detect the language of the 'ORIGINAL CV CONTENT'.
       - **Rewrite the CV in the SAME language.**
       - If the original CV is Indonesian, the output must be Indonesian.
       - If the original CV is English, the output must be English.
    
    *** WRITING INSTRUCTIONS ***:
    1. Summary: Metric-driven.
    2. Experience: Google XYZ formula.
    3. Skills: Re-organize based on priority.

    OUTPUT: Strictly JSON matching the ImprovedCVResult schema.
    """

    try:
        # [ROUTING] Customize CV memerlukan kemampuan menulis yang baik (Creative/Reasoning)
        
        response = await generate_with_retry(
            contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt_text)])],
            config=types.GenerateContentConfig(
                response_mime_type="application/json", 
                response_schema=ImprovedCVResult,
                temperature=0.2 # Sedikit kreativitas untuk penulisan
            ),
            model_name=REASONING_MODEL # <--- Explicitly use Strong Model
        )
        if response.parsed: return response.parsed
        return ImprovedCVResult(**json.loads(clean_json_text(response.text)))
    except Exception as e:
        print(f"Customize Error: {e}")
        return ImprovedCVResult(
            full_name="Error Generating CV", professional_summary=f"AI Error: {str(e)}",
            contact_info=CVContactInfo(email="", phone="", location=""),
            hard_skills=[], soft_skills=[], work_experience=[], education=[], projects=[]
        )