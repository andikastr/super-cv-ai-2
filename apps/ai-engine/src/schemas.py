from pydantic import BaseModel
from typing import List, Optional

# --- SCHEMA HASIL ANALISIS (Update sesuai Prompt Rekan Anda) ---
class AnalysisResult(BaseModel):
    candidate_name: str
    
    # 1. Candidate Overview
    overall_score: int
    overall_summary: str # Detailed feedback (strengths & weaknesses)
    
    # 2. Writing Style
    writing_score: int
    writing_detail: str # Clarity, grammar, passive voice check
    
    # 3. CV Format & ATS
    ats_score: int
    ats_detail: str # Clean structure, readability
    
    # 4. Skill Match
    skill_score: int
    skill_detail: str # Hard/Soft skills match
    
    # 5. Experience & Projects
    experience_score: int
    experience_detail: str # Relevance & Seniority check
    
    # 6. Keyword Relevance & Gaps
    keyword_score: int
    key_strengths: List[str] # Selling points
    missing_skills: List[str] # Critical gaps/missing elements

# --- SCHEMA CUSTOMIZE (Tetap Sama) ---
class CVContactInfo(BaseModel):
    email: str
    phone: str
    location: str
    linkedin: Optional[str] = None

class CVExperience(BaseModel):
    title: str
    company: str
    dates: str
    achievements: List[str]

class CVEducation(BaseModel):
    institution: str
    degree: str
    year: str

class CVProject(BaseModel):
    name: str
    description: str
    highlights: List[str]

class ImprovedCVResult(BaseModel):
    full_name: str
    professional_summary: str
    contact_info: CVContactInfo
    hard_skills: List[str]
    soft_skills: List[str]
    work_experience: List[CVExperience]
    education: List[CVEducation]
    projects: List[CVProject]