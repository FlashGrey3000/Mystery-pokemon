import ffmpeg
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import speech_recognition as sr
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace '*' with specific origins if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/stt")
async def speech_to_text(uploadFile: UploadFile):
    inputFilePath = "tmp/audio.webm"
    outputFilePath = "tmp/audio.wav"

    with open(inputFilePath, "wb") as f:
        f.write(await uploadFile.read())
    
    try:
        ffmpeg.input(inputFilePath).output(outputFilePath).run(quiet=True, overwrite_output=True)
    except Exception as e:
        print(f"unable to convert data: Error == {e}")
        return {"error": f"unable to convert data => {e}"}

    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(outputFilePath) as source:
            audio = recognizer.record(source)
            text = recognizer.recognize_google(audio)
            print(text)
            return {"text": text}
    except Exception as e:
        print(f"unable to convert data: Error == {e}")
        return {"error": f"unable to convert data => {e}"}
    finally:
        os.remove(inputFilePath)
        os.remove(outputFilePath)