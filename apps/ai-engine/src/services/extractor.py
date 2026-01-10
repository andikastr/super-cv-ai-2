import io
from fastapi import UploadFile, HTTPException
import pdfplumber
import docx


def extract_text_from_bytes(content: bytes, content_type: str) -> str:
    file_stream = io.BytesIO(content)
    text = ""

    try:
        if content_type == "application/pdf":
            # [FIX] Menggunakan pdfplumber untuk hasil lebih akurat & layout terjaga
            with pdfplumber.open(file_stream) as pdf:
                for page in pdf.pages:
                    # Logic Custom: Extract text + Hyperlinks
                    # 1. Ambil semua kata dengan posisi
                    words = page.extract_words()
                    # 2. Ambil semua hyperlink
                    links = page.hyperlinks
                    
                    # 3. Mapping link ke kata (intersection check)
                    for link in links:
                        link_bbox = (link['x0'], link['top'], link['x1'], link['bottom'])
                        link_uri = link['uri']
                        
                        # Cari kata yang bersinggungan dengan bbox link
                        # Kita inject URL ke kata terakhir yang match agar rapi
                        matched_words = []
                        for word in words:
                            # Cek overlap sederhana
                            if (word['x0'] < link['x1'] and word['x1'] > link['x0'] and
                                word['top'] < link['bottom'] and word['bottom'] > link['top']):
                                matched_words.append(word)
                        
                        if matched_words:
                            # Append URL ke kata terakhir yang match link ini
                            last_word = matched_words[-1]
                            if f"[{link_uri}]" not in last_word['text']: # Prevent duplicates
                                last_word['text'] += f" [{link_uri}]"
                    
                    # 4. Reconstruct text dari words yang sudah dimodifikasi
                    # Menggunakan logic sederhana layout preservation
                    if words:
                        # Sort by top (y) then left (x)
                        words.sort(key=lambda w: (w['top'], w['x0']))
                        
                        current_top = words[0]['top']
                        line_text = ""
                        page_text = ""
                        
                        for word in words:
                            # Jika beda baris cukup jauh, new line
                            if abs(word['top'] - current_top) > 5: # tolerance 5pt
                                page_text += line_text.strip() + "\n"
                                line_text = ""
                                current_top = word['top']
                            line_text += word['text'] + " "
                        
                        page_text += line_text.strip() + "\n"
                        text += page_text

        elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            doc = docx.Document(file_stream)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        
        else:
            raise ValueError("Format file tidak didukung. Gunakan PDF atau DOCX.")

    except Exception as e:
        raise ValueError(f"Gagal mengekstrak teks: {str(e)}")

    return text.strip()


async def extract_text_from_file(file: UploadFile) -> str:
    content = await file.read()
    try:
        
        return extract_text_from_bytes(content, file.content_type)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))