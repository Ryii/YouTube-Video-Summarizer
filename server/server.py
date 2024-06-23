from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from audio import youtube_to_audio

load_dotenv()

app = Flask(__name__)
cors = CORS(app, origins="*")

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
        link = request.args.get('url')
        return_val = youtube_to_audio(link)
        return return_val
    except Exception as e:
        print(e)


# def post_video_link(url: str):
#     try:
#         extract_audio_from_youtube(url)
#         transcribe_audio()

#         # extract phrases from serialized deepgram payload
#         word_segments = extract_segments(json.load(open("yt_audio.json")))
#         texts = [t["text"].strip() for t in word_segments]

#         # embed documents
#         doc_embeddings = create_embeddings(
#             texts, os.environ.get("MODEL")
#         )  # All embeddings for the texts

#         pickle.dump(doc_embeddings, open("doc_embeddings", "wb"))
#         pickle.dump(word_segments, open("word_segments", "wb"))

#         return {
#             "status_code": 200,
#             "status_txt": "OK",
#             "success": {"message": "image uploaded", "code": 200},
#             "video": {
#                 "date": datetime.now(),
#                 "filename": "video.mp4",
#                 "mime": "video/youtube",
#                 "url": url,
#             },
#         }
#     except Exception as e:
#         print(e)
#         raise HTTPException(status_code=500, detail="Unable to process request")


if __name__ == "__main__":
    app.run(debug=True, port=8080)