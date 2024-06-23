from pytube import YouTube
import os
import shutil

def youtube_to_audio(url):
    temp_output_path = "temp_output_path"
    yt = YouTube(url)
    audio = yt.streams.filter(only_audio=True)
    audio[0].download(output_path=temp_output_path)

    file = os.listdir(temp_output_path)[0]
    shutil.move(os.path.join(temp_output_path, file), ".")
    os.rename((file), "yt_audio.mp3")
    shutil.rmtree(temp_output_path)

    return url


def audio_to_text(file):
    return 1