import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
from src.schemas import AnalysisResult, ImprovedCVResult, CVContactInfo

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_NAME = "gemini-3-flash-preview" 

def clean_json_text(text: str) -> str:
    try:
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
        return text.strip()
    except Exception:
        return text

# --- FUNGSI 1: ANALYZE (Prompt Rekan Anda) ---
async def analyze_cv(cv_text: str, job_desc: str) -> AnalysisResult:
    # Prompt Rekan Anda + JSON Instruction
    prompt_text = f"""
    You are a Senior Technical Recruiter and CV Expert. 
    Analyze the following Candidate CV against the provided Job Description and make the words "You" for the candidate, not He/She.

    JOB DESCRIPTION:
    {job_desc}

    CANDIDATE CV CONTENT:
    {cv_text}

    Please perform a deep analysis based on these 6 specific criteria:

    1. **Candidate Overview**:
       - Extract the candidate's full name.
       - Make overall score (1-100).
       - Provide detailed feedback for overall score including strengths and weaknesses.
    
    2. **Writing Style (Score 0-100)**: 
       - Check for clarity, grammar, and typos.
       - Identify weak phrasing (excessive passive voice) vs action-oriented language.
    
    3. **CV Format & ATS (Score 0-100)**: 
       - Is the format ATS-friendly? (Clean structure, standard fonts).
       - Is it machine-readable?
    
    4. **Skill Match (Score 0-100)**: 
       - How well do the hard skills and soft skills match the Job Description?
    
    5. **Experience & Projects (Score 0-100)**: 
       - Evaluate if work history/projects are relevant.
       - Does the experience level (Seniority) match?

    6. **Keyword Relevance (Score 0-100)**:
       - List primary selling points (strengths).
       - List critical gaps or missing elements.

    *** REQUIRED JSON OUTPUT FORMAT ***
    You MUST output strictly strictly JSON matching this schema (do not output markdown text outside JSON):
    {{
        "candidate_name": "Name found in CV",
        "overall_score": 0,
        "overall_summary": "Detailed feedback using 'You'...",
        "writing_score": 0,
        "writing_detail": "Feedback on grammar/voice...",
        "ats_score": 0,
        "ats_detail": "Feedback on format...",
        "skill_score": 0,
        "skill_detail": "Feedback on matching skills...",
        "experience_score": 0,
        "experience_detail": "Feedback on relevance...",
        "keyword_score": 0,
        "key_strengths": ["Strength 1", "Strength 2"],
        "missing_skills": ["Gap 1", "Gap 2"]
    }}
    """
    
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt_text)])],
            config=types.GenerateContentConfig(
                response_mime_type="application/json", 
                response_schema=AnalysisResult,
                temperature=0.2 
            )
        )
        if response.parsed: return response.parsed
        return AnalysisResult(**json.loads(clean_json_text(response.text)))
    except Exception as e:
        print(f"Analyze Error: {e}")
        # Return fallback
        return AnalysisResult(
            candidate_name="Unknown", overall_score=0, overall_summary=f"Error: {str(e)}",
            writing_score=0, writing_detail="", ats_score=0, ats_detail="",
            skill_score=0, skill_detail="", experience_score=0, experience_detail="",
            keyword_score=0, key_strengths=[], missing_skills=[]
        )

# --- FUNGSI 2: CUSTOMIZE (Improved Logic) ---
async def customize_cv(cv_text: str, mode: str, context_data: str) -> ImprovedCVResult:
    # 1. Instruksi Mode
    if mode == 'job_desc':
        mode_instruction = f"""
        *** MODE: JOB DESCRIPTION TARGETING ***
        TARGET JOB: {context_data}
        INSTRUCTIONS:
        - ATS Optimization: Inject keywords from Target Job into Summary & Skills.
        - Relevance: Prioritize experiences matching the job duties.
        """
    else: # analysis
        mode_instruction = f"""
        *** MODE: WEAKNESS FIXING (BASED ON ANALYSIS) ***
        ANALYSIS FEEDBACK: {context_data}
        INSTRUCTIONS:
        - Fix Gaps: Add missing skills identified in feedback if logical.
        - Fix Metrics: If feedback says "lack of numbers", add estimated metrics (e.g., "Increased X by ~20%").
        """

    # 2. Prompt Rewrite (Elite Writer)
    prompt_text = f"""
    You are an Elite Resume Writer (Top 1%). Rewrite this CV to be world-class.
    
    {mode_instruction}

    *** WRITING RULES ***
    1. **Summary:** 3-4 sentences, high impact. Format: "[Title] with [Years] exp... Expert in [Skills]..."
    2. **Experience:** Use **Google XYZ Formula** ("Accomplished X, measured by Y, by doing Z").
       - Start bullets with Power Verbs (Spearheaded, Engineered).
       - **Quantify Results:** Add numbers/metrics to every bullet point possible.
    
    ORIGINAL CV:
    {cv_text}

    OUTPUT: Return strictly JSON (ImprovedCVResult schema).
    """

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[types.Content(role="user", parts=[types.Part.from_text(text=prompt_text)])],
            config=types.GenerateContentConfig(response_mime_type="application/json", response_schema=ImprovedCVResult)
        )
        if response.parsed: return response.parsed
        return ImprovedCVResult(**json.loads(clean_json_text(response.text)))
    except Exception as e:
        print(f"Customize Error: {e}")
        return ImprovedCVResult(
            full_name="Error", professional_summary=f"Error: {str(e)}",
            contact_info=CVContactInfo(email="", phone="", location=""),
            hard_skills=[], soft_skills=[], work_experience=[], education=[], projects=[]
        )