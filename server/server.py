import os
from audio import transcribe_summarize_video, youtube_to_audio
from dotenv import load_dotenv
from flask import Flask, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
cors = CORS(app, origins="*")

os.environ["GCLOUD_PROJECT"] = os.environ["GOOGLE_CLOUD_BUCKET_NAME"]

@app.get("/api/load_video")
def load_video():
    try:
        youtube_url = request.args.get('url')
        youtube_to_audio(youtube_url)
        return youtube_url
    except Exception as e:
        print(e)
        raise 

@app.get("/api/transcribe_summarize_video")
def summarize_video():
    try:
        youtube_url = request.args.get('url')
        transcript, summary = transcribe_summarize_video(youtube_url)
        return {"transcript": transcript, "summary": summary}
    except Exception as e:
        print(e)
        raise 

if __name__ == "__main__":
    app.run(debug=True, port=8080)