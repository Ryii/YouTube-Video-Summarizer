import os
import shutil

import cohere
from cloud_storage import delete_blob, upload_blob
from google.cloud.speech_v2 import SpeechClient
from google.cloud.speech_v2.types import cloud_speech
from pytube import YouTube

from config import COHERE_API_KEY, GC_BUCKET_NAME, GC_PROJECT_NAME

TEMP_FILE_PATH = "yt_audio.mp3"

def youtube_to_audio(url):
    # Download file 
    temp_output_path = "temp_output_path"
    yt = YouTube(url)
    audio = yt.streams.filter(only_audio=True)
    audio[0].download(output_path=temp_output_path)

    # Save to local
    file = os.listdir(temp_output_path)[0]
    shutil.move(os.path.join(temp_output_path, file), ".")
    os.rename((file), TEMP_FILE_PATH)
    shutil.rmtree(temp_output_path)

def remove_audio_file():
    if os.path.exists(TEMP_FILE_PATH):
        os.remove(TEMP_FILE_PATH)
        print(f"File '{TEMP_FILE_PATH}' removed successfully.")
    else:
        print(f"File '{TEMP_FILE_PATH}' does not exist.")

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
    print("Waiting for transcription to finish...")
    response = operation.result(timeout=180)

    transcript_builder = []
    for result in response.results[gcs_uri].transcript.results:
        transcript_builder.append(f"\nTranscript: {result.alternatives[0].transcript}")
    transcript = "".join(transcript_builder)

    return transcript

def summarize_text(transcript): 
    cohere_client = cohere.Client(COHERE_API_KEY)
    response = cohere_client.summarize( 
        text=transcript,
        length='medium',
        format='paragraph',
        model='summarize-xlarge',
        additional_command='',
        temperature=0.3,
    ) 
    
    return response.summary

def transcribe_summarize_video(youtube_url):
    youtube_to_audio(youtube_url)
    # TODO: check if url is already uploaded by reading bucket, only fetch if needed 
    upload_blob(GC_BUCKET_NAME, "yt_audio.mp3", "yt_audio")
    transcript = audio_to_text(GC_PROJECT_NAME, f"gs://{GC_BUCKET_NAME}/yt_audio")
    summary = summarize_text(transcript)
    delete_blob(GC_BUCKET_NAME, "yt_audio")
    remove_audio_file()

    return transcript, summary
