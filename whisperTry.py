import ffmpeg
import os
from fastapi import FastAPI, File, UploadFile
import speech_recognition as sr
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace '*' with specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/speech-to-text")
async def speech_to_text(file: UploadFile):
    input_path = "tmp/temp_audio.webm"
    output_path = "tmp/temp_audio.wav"
    with open(input_path, "wb") as f:
        f.write(await file.read())
    
    # Convert WebM to WAV
    try:
        ffmpeg.input(input_path).output(output_path).run(quiet=True, overwrite_output=True)
    except Exception as e:
        return {"error": f"Failed to convert audio: {str(e)}"}
    
    # Use the WAV file for speech recognition
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(output_path) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)
            print(text)
            return {"text": text}
    except Exception as e:
        return {"error": f"Speech recognition failed: {str(e)}"}
    finally:
        # Clean up temporary files
        os.remove(input_path)
        os.remove(output_path)
