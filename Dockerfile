# SeaSentinel AI (SIH 26057) - Production AI Inference Engine
# Optimized for Hugging Face Spaces (Docker SDK), Render.com, and Cloud Containers
FROM python:3.10-slim

# Prevent Python from writing .pyc files and enable unbuffered logging
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=7860 \
    HOME=/home/user

# Install essential system libraries for OpenCV headless and PyTorch
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set up non-root user (Hugging Face Spaces UID 1000 standard)
RUN useradd -m -u 1000 user
WORKDIR /app

# Upgrade pip and install CPU-optimized PyTorch and Torchvision
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Install application dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code, models, and weights
COPY backend ./backend
COPY model ./model
COPY backend_main.py ./backend_main.py

# Set active model environment path pointing to the 5-class checkpoint
ENV SEASENTINEL_MODEL_PATH=/app/model/best.pt

# Ensure permissions for the non-root user
RUN chown -R user:user /app /home/user

USER user

# Expose container port (Default 7860 for Hugging Face Spaces)
EXPOSE 7860

# Health check to ensure model is loaded and ready
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:7860/health || exit 1

# Start FastAPI backend server
CMD ["sh", "-c", "uvicorn backend.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
