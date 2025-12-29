# ai-engine/Dockerfile
FROM python:3.9-slim

WORKDIR /app

# 1. Install System Dependencies 
# Required for potential PDF/Word processing libraries (libpoppler, libxml2)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpoppler-cpp-dev \
    pkg-config \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# 2. Install Python Dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 3. CRITICAL: Re-structure for Import Compatibility
# We copy the local 'src' folder to '/app/app' inside the container.
# This makes Python see 'app' as a package, allowing "from app.schemas import ..."
COPY src/ ./app/

# 4. Copy the entrypoint
COPY main.py .

# 5. Expose & Run
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]