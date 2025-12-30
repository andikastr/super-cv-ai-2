import io
from fastapi import UploadFile, HTTPException
import pypdf
import docx

# --- 1. CORE FUNCTION (Synchronous) ---
# Fungsi ini menerima 'bytes' (bukan UploadFile).
# Kita hilangkan 'async' agar bisa dijalankan di run_in_threadpool.
def extract_text_from_bytes(content: bytes, content_type: str) -> str:
    file_stream = io.BytesIO(content)
    text = ""

    try:
        if content_type == "application/pdf":
            reader = pypdf.PdfReader(file_stream)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        
        elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            doc = docx.Document(file_stream)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        
        else:
            # Opsional: Deteksi header file jika content_type dari frontend salah
            raise ValueError("Format file tidak didukung. Gunakan PDF atau DOCX.")

    except Exception as e:
        raise ValueError(f"Gagal mengekstrak teks: {str(e)}")

    return text.strip()

# --- 2. WRAPPER FUNCTION (Async) ---
# Ini wrapper untuk backward compatibility jika ada kode lain yang memanggilnya langsung
async def extract_text_from_file(file: UploadFile) -> str:
    content = await file.read()
    try:
        # Panggil core function
        return extract_text_from_bytes(content, file.content_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))