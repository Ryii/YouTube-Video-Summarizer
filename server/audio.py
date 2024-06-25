# import io
import os
import shutil

# from google.cloud import speech
# from google.cloud import speech_v2
from google.cloud import storage
from google.cloud.speech_v2 import SpeechClient
from google.cloud.speech_v2.types import cloud_speech
from pytube import YouTube

FILE_PATH = "yt_audio.mp3"

def youtube_to_audio(url):
    temp_output_path = "temp_output_path"
    yt = YouTube(url)
    audio = yt.streams.filter(only_audio=True)
    audio[0].download(output_path=temp_output_path)

    file = os.listdir(temp_output_path)[0]
    shutil.move(os.path.join(temp_output_path, file), ".")
    os.rename((file), FILE_PATH)
    shutil.rmtree(temp_output_path)

    return 0

def upload_youtube_audio_to_gcs_uri(youtube_url, bucket_name, blob_name):
    # Read YouTube url
    temp_output_path = "temp_output_path"
    yt = YouTube(youtube_url)
    audio = yt.streams.filter(only_audio=True)
    audio[0].download(output_path=temp_output_path)

    # (TODO) Upload to GCS 
    # Options: upload from memory, upload from file 

    # file = os.listdir(temp_output_path)[0]
    # shutil.move(os.path.join(temp_output_path, file), ".")
    # os.rename((file), FILE_PATH)
    # shutil.rmtree(temp_output_path)

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.upload_from_string(audio) # test this  
    # blob.make_public()

    return blob.public_url

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

    # Transcribe audio into text
    operation = speech_client.batch_recognize(request=request)

    print("Waiting for operation to complete...")
    response = operation.result(timeout=120)

    for result in response.results[gcs_uri].transcript.results:
        print(f"Transcript: {result.alternatives[0].transcript}")

    return response.results[gcs_uri].transcript

    # transcript_builder = []
    # # Each result is for a consecutive portion of the audio. Iterate through
    # # them to get the transcripts for the entire audio file.
    # for result in response.results:
    #     # The first alternative is the most likely one for this portion.
    #     transcript_builder.append(f"\nTranscript: {result.alternatives[0].transcript}")
    #     transcript_builder.append(f"\nConfidence: {result.alternatives[0].confidence}")

    # transcript = "".join(transcript_builder)
    # print(transcript)

    # return transcript

def delete_audio_from_gcs_uri(gcs_uri):
    # TODO
    return 0

def summarize_text(transcript): 
    # TODO: summarize with Cohere
    print('transcript', transcript)
    return ''

def summarize_video(youtube_url):
    try: 
        # TODO: check if url is already uploaded by reading bucket, only fetch if needed 
        gcs_uri = upload_youtube_audio_to_gcs_uri(youtube_url)
        transcript = audio_to_text(gcs_uri)
        summary = summarize_text(transcript)
        return summary
    except Exception as e: 
        print(e)
        raise e
