    FROM python:3.11-slim AS builder

    # Create the app directory
    RUN mkdir /app

    # Set the working directory inside the container
    WORKDIR /app

    # Set Environment Variables
    # Prevents python from writing pyc files to disk
    ENV PYTHONDONTWRITEBYTECODE=1
    ENV PYTHONUNBUFFERED=1 

    # Copy the django project and install dependencies
    COPY requirements.txt /app/

    RUN pip install --no-cache-dir -r requirements.txt


    # Stage 2: Production stage
    FROM python:3.11-slim

    RUN useradd -m -r appuser && \
        mkdir /app && \
        chown -R appuser /app

    # Copy python dependencies from the builder stage
    COPY --from=builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/
    COPY --from=builder /usr/local/bin/ /usr/local/bin/

    WORKDIR /app

    #copy application code
    COPY --chown=appuser:appuser . .

    # Set environment variables to optimize Python
    ENV PYTHONDONTWRITEBYTECODE=1
    ENV PYTHONUNBUFFERED=1 

    USER appuser

    EXPOSE 8000

    # Start the application using Gunicorn
    CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--threads", "2", "smartwayz_backend.wsgi:application"]

