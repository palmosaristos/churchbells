#!/usr/bin/env python3
"""
Script to generate bell chime sequences (1-12 chimes) from a single chime audio file.
"""
from pydub import AudioSegment
from pydub.playback import play
import os

def generate_chime_sequence(source_file, output_file, num_chimes, silence_duration_ms=1500):
    """
    Generate a bell chime sequence with N repetitions.
    
    Args:
        source_file: Path to the single chime MP3
        output_file: Path for the output MP3
        num_chimes: Number of chimes (1-12)
        silence_duration_ms: Silence between chimes in milliseconds (default 1500ms = 1.5s)
    """
    print(f"Loading source file: {source_file}")
    single_chime = AudioSegment.from_mp3(source_file)
    
    print(f"Single chime duration: {len(single_chime)}ms")
    
    silence = AudioSegment.silent(duration=silence_duration_ms)
    
    result = AudioSegment.empty()
    
    for i in range(num_chimes):
        result += single_chime
        if i < num_chimes - 1:
            result += silence
    
    print(f"Total sequence duration: {len(result)}ms ({len(result)/1000:.1f}s)")
    
    print(f"Exporting to: {output_file}")
    result.export(output_file, format="mp3", bitrate="128k")
    
    print(f"✓ Created {output_file} with {num_chimes} chime(s)")
    return result

if __name__ == "__main__":
    source = "attached_assets/cloche en DO_1762343078193.mp3"
    output_dir = "public/audio/generated"
    
    os.makedirs(output_dir, exist_ok=True)
    
    print("=" * 60)
    print("Testing: Creating cathedral_2.mp3 (2 chimes)")
    print("=" * 60)
    
    output = os.path.join(output_dir, "cathedral_2.mp3")
    generate_chime_sequence(source, output, num_chimes=2, silence_duration_ms=1500)
    
    print("\n✓ Test completed! Check the file in:", output)
