import os

from audio import transcribe_summarize_video, youtube_to_audio
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
cors = CORS(app, origins="*")

os.environ["GCLOUD_PROJECT"] = "cohere_project_2024_bucket"

@app.route("/api/users", methods=['GET'])
def users():
    return jsonify(
        {
            "users": [
                'arpan',
                'zach',
                'jessie'
            ]
        }
    )

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
        return transcript, summary
    except Exception as e:
        print(e)
        raise 

if __name__ == "__main__":
    app.run(debug=True, port=8080)