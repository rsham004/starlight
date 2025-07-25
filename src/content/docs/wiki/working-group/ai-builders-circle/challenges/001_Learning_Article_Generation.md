---
title: "Challenge 001: Markdown Article Generation"
description: "Markdown detailed article generation from audio transcript"
published: true
date: 2025-07-25T00:00:00.000Z
---

# ✅ Challenge 001: Markdown detailed article generation from audio transcript [COMPLETED]

---

## 👥 Collaborators

- Ravi Shamihoke

---

## 📞 Google Meet

https://meet.google.com/bxi-iikf-edr

---

## 🏆 Tier: 1 - Quick Win

---

## 🧠 Problem Statement

From an MP4 or MP3 file, generate transcript and use a prompt to generate a learning article in markdown format, elaborate all sections

---

## 🎯 Goal

Build a reusable way to **automate MPx to learning article generation** dynamically processing all input files from a given folder.

---

## ✅ Success Criteria

- A snippet or script that reads MPx files froma given folder, generates transcript and generates learning article using the prompt "create a learning article in markdown elaborate all sections" and downloads it to a specified output folder.

---

## 🛠️ Tech Stack & Inputs

- **Transcription**: AssemblyAI API for high-quality audio transcription
- **LLM**: Google Gemini 1.5 Flash for learning article generation
- **Audio Processing**: pydub for MP4 to MP3 conversion (with fallback support)
- **File Processing**: Python scripts for automated folder monitoring and batch processing
- **Output Management**: Automated markdown file generation with metadata tracking


---

## 📦 Suggested Architecture

```plaintext
[Input Folder] → [MP3/MP4 Files]
   ↓
[Audio Processing Script]
   ↓
[Transcription Service] → [Text Transcript]
   ↓
[LLM Processing] → [OpenAI API with prompt]
   ↓
[Markdown Generation] → [Learning Article]
   ↓
[Output Folder] → [Generated .md files]
```

**Component Breakdown:**

1. **File Scanner**: Recursively scan input folder for MP3/MP4 files
2. **Audio Transcription**: 
   - Options: OpenAI Whisper API, AssemblyAI, or local Whisper model
   - Convert audio to text transcript
3. **LLM Processing**:
   - Send transcript + prompt to OpenAI API
   - Prompt: "Create a detailed learning article in markdown format. Elaborate all sections with clear headings, explanations, and examples."
4. **File Output**: Save generated markdown to output folder with meaningful filename

**Example Implementation Flow:**
```python
for audio_file in input_folder:
    transcript = transcribe_audio(audio_file)
    article = generate_article(transcript, learning_prompt)
    save_markdown(article, output_folder)
```

---

## ✅ COMPLETED IMPLEMENTATION

**Status**: ✅ **COMPLETED** - Fully functional video-to-learning-article pipeline

**Implementation Location**: https://github.com/rsham004/audio_learning_article

### 🏗️ Architecture Implemented

```plaintext
[InputVideos/] → [MP4 Files]
   ↓
[process_videos.py] → [Audio Extraction via pydub]
   ↓
[AssemblyAI API] → [High-Quality Transcription]
   ↓
[article_generator.py] → [Gemini 1.5 Flash Processing]
   ↓
[Structured Learning Article] → [LearningArticles/ folder]
   ↓
[Cleanup] → [Original video deleted after success]
```

### 🔧 Key Components Built

1. **`process_videos.py`** - Main processing pipeline
   - Monitors `InputVideos/` folder for MP4 files
   - Extracts audio using pydub (with fallback for direct video processing)
   - Transcribes using AssemblyAI API
   - Generates learning articles via Gemini
   - Cleans up temporary files and original videos

2. **`article_generator.py`** - AI-powered article generation
   - Uses Google Gemini 1.5 Flash for content generation
   - Structured prompt engineering for consistent learning article format
   - Cost tracking and metadata generation
   - Professional article structure with sections:
     - Executive Summary
     - Learning Objectives
     - Core Concepts
     - Detailed Analysis
     - Practical Applications
     - Key Takeaways
     - Conclusion

3. **Supporting Files**:
   - `run_transcriber.bat` / `run_transcriber.sh` - Cross-platform execution scripts
   - `file_watcher.ps1` - PowerShell script for automated folder monitoring
   - `test_article_generation.py` - Testing utilities

### 📊 Results Achieved

**Sample Output Quality**: Generated comprehensive learning articles with:
- Professional structure and formatting
- Detailed concept explanations
- Practical applications
- Cost tracking (avg. $0.001 per article)
- Processing time: ~70 seconds per video
- Metadata tracking for transparency

**Example Generated Article**: "Building Charisma: From Charm to Commanding Presence"
- 1,715 output tokens
- Comprehensive 7-section structure
- Actionable insights and techniques
- Professional markdown formatting

### 🚀 Usage Instructions

1. **Setup Environment Variables**:
   ```bash
   ASSEMBLYAI_API_KEY=your_assemblyai_key
   GEMINI_API_KEY=your_gemini_key
   ```

2. **Install Dependencies**:
   ```bash
   pip install assemblyai google-generativeai pydub
   ```

3. **Process Videos**:
   - Place MP4 files in `InputVideos/` folder (media files are deleted later, make sure you have the original somewhere else if you need it)
   - Run `python process_videos.py`
   - Generated articles appear in `LearningArticles/` folder
   - Transcripts saved to `OutputMarkdown/` folder

### 💰 Cost Analysis

- **AssemblyAI**: ~$0.37 per hour of audio
- **Gemini 1.5 Flash**: ~$0.001 per article
- **Total**: Extremely cost-effective at scale

---

## 💬 Discussion Prompts

- ✅ **RESOLVED**: Implemented AssemblyAI for high-quality transcription
- ✅ **RESOLVED**: Built automated folder processing with cleanup
- **Future Enhancement**: Consider batch processing optimization for large video collections

---

## 🧠 Why This Matters

This implementation delivers:
- ✅ **Automated article generation** - Zero manual intervention required
- ✅ **Professional quality output** - Structured, comprehensive learning articles
- ✅ **Cost-effective processing** - Under $0.50 per video typically
- ✅ **Scalable architecture** - Can process multiple videos in batch
- ✅ **Clean automation** - Automatic cleanup and organization

---

## 📞 Related Pages

- [Challenge Library Overview](./challenge-library)
- [Contribution & IP Protocol](./contribution-ip)
- [The Foundry Operating System v2.1](./foundry-os)

---

## 🎉 Challenge Completed!

This challenge has been successfully completed by **Ravi Shamihoke**. The implementation provides a fully functional video-to-learning-article pipeline that meets all success criteria.

**Want to use this solution?** Check the implementation at https://github.com/rsham004/audio_learning_article

**Have ideas for improvements?** Consider contributing enhancements or taking on related challenges in the [Challenge Library](./Challenges_list.md)!





