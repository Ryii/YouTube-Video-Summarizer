import os
import shutil

import cohere
from google.cloud.speech_v2 import SpeechClient
from google.cloud.speech_v2.types import cloud_speech
from pytube import YouTube

from server.cloud_storage import delete_blob, upload_blob

FILE_PATH = "yt_audio.mp3"

def youtube_to_audio(url):
    # Download file 
    temp_output_path = "temp_output_path"
    yt = YouTube(url)
    audio = yt.streams.filter(only_audio=True)
    audio[0].download(output_path=temp_output_path)

    # Save to local
    file = os.listdir(temp_output_path)[0]
    shutil.move(os.path.join(temp_output_path, file), ".")
    os.rename((file), FILE_PATH)
    shutil.rmtree(temp_output_path)

    return 0

def audio_to_text(project_id, gcs_uri):
    speech_client = SpeechClient()
    config = cloud_speech.RecognitionConfig(
        auto_decoding_config=cloud_speech.AutoDetectDecodingConfig(),
        language_codes=["en-US"],
        model="long",
    )
    file_metadata = cloud_speech.BatchRecognizeFileMetadata(uri=gcs_uri)

    request = cloud_speech.BatchRecognizeRequest(
        recognizer=f"projects/{project_id}/locations/global/recognizers/_",
        config=config,
        files=[file_metadata],
        recognition_output_config=cloud_speech.RecognitionOutputConfig(
            inline_response_config=cloud_speech.InlineOutputConfig(),
        ),
        processing_strategy=cloud_speech.BatchRecognizeRequest.ProcessingStrategy.DYNAMIC_BATCHING,
    )

    operation = speech_client.batch_recognize(request=request)

    print("Waiting for operation to complete...")
    response = operation.result(timeout=180)

    transcript_builder = []
    for result in response.results[gcs_uri].transcript.results:
        transcript_builder.append(f"\nTranscript: {result.alternatives[0].transcript}")

    transcript = "".join(transcript_builder)
    print("Transcript:", transcript)
    return transcript

def summarize_text(transcript): 
    co = cohere.Client(os.environ.get("COHERE_API_KEY"))
    response = co.summarize( 
        text=transcript,
        length='medium',
        format='paragraph',
        model='summarize-xlarge',
        additional_command='',
        temperature=0.3,
    ) 
    print('Summary:', response.summary)

    return response.summary

def transcribe_summarize_video(youtube_url):
    youtube_to_audio(youtube_url)
    # TODO: check if url is already uploaded by reading bucket, only fetch if needed 
    upload_blob("cohere_project_2024_bucket", "yt_audio.mp3", "yt_audio")
    transcript = audio_to_text("cohere-project-2024", "gs://cohere_project_2024_bucket/yt_audio")
    summary = summarize_text(transcript)
    delete_blob("cohere_project_2024_bucket", "yt_audio")

    return transcript, summary
