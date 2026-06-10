# Joinly Meeting Platform MCP Server

AI agents for online meetings across Zoom, Microsoft Teams, and Google Meet.

## Features

- **Multi-Platform Support**: Works with Zoom, Teams, and Google Meet
- **Live Transcription**: Real-time meeting transcripts via Deepgram/Whisper
- **Voice Participation**: AI agent can speak in meetings (ElevenLabs/Kokoro TTS)
- **Chat Integration**: Send and receive meeting chat messages
- **Recording**: Start/stop meeting recordings
- **Participant Management**: Track meeting participants
- **Browser Automation**: Uses Playwright for seamless meeting joins

## Supported Platforms

| Platform | Join | Speak | Transcript | Chat | Record |
|----------|------|-------|------------|------|--------|
| Zoom | ✓ | ✓ | ✓ | ✓ | ✓ |
| Microsoft Teams | ✓ | ✓ | ✓ | ✓ | ✓ |
| Google Meet | ✓ | ✓ | ✓ | ✓ | ✓ |

## Authentication

```bash
JOINLY_API_KEY=your_api_key
```

Get API key from: https://joinly.ai/signup

## Tools

### Meeting Management
- `join_meeting` - Join meeting via URL (auto-detects platform)
- `leave_meeting` - Leave current meeting
- `list_active_meetings` - List all active meeting sessions
- `get_meeting_info` - Get meeting details and status

### Transcription
- `get_transcript` - Get live or complete meeting transcript
  - Real-time updates during meeting
  - Speaker identification
  - Timestamp for each utterance

### Voice & Chat
- `speak_in_meeting` - AI agent speaks text in meeting
  - Natural TTS voice
  - Supports multiple languages
- `send_chat_message` - Send message to meeting chat

### Recording
- `record_meeting` - Start meeting recording
- `stop_recording` - Stop recording and get file URL

### Participants
- `get_participants` - List meeting participants
  - Name, role (host/participant)
  - Audio/video status

## Meeting URL Formats

### Zoom
```
https://zoom.us/j/1234567890?pwd=abcdefg
```

### Microsoft Teams
```
https://teams.microsoft.com/l/meetup-join/...
```

### Google Meet
```
https://meet.google.com/abc-defg-hij
```

## Transcript Format

```json
{
  "meeting_id": "zoom_123456",
  "platform": "zoom",
  "transcript": [
    {
      "speaker": "John Doe",
      "text": "Hello everyone, let's start the meeting",
      "timestamp": "2024-06-09T10:00:00Z",
      "confidence": 0.95
    }
  ],
  "is_live": true
}
```

## Usage

```bash
docker run -it \
  -e JOINLY_API_KEY=your_api_key \
  mcp-flakes/joinly
```

### Join Meeting and Get Transcript

```json
{
  "tool": "join_meeting",
  "args": {
    "url": "https://zoom.us/j/1234567890",
    "display_name": "AI Assistant"
  }
}
```

### Speak in Meeting

```json
{
  "tool": "speak_in_meeting",
  "args": {
    "meeting_id": "zoom_123456",
    "text": "Thank you for the update. I'll follow up on that.",
    "voice": "en-US-male"
  }
}
```

## Common Use Cases

### Meeting Note-Taking
- Join meetings as silent observer
- Capture live transcripts
- Generate summaries and action items

### Customer Support
- Join support calls
- Provide real-time assistance
- Escalate to human when needed

### Sales & Demos
- Join sales calls
- Answer technical questions
- Demonstrate products

### Training & Onboarding
- Join training sessions
- Answer participant questions
- Provide resources in chat

### Accessibility
- Live captions for hearing-impaired
- Voice assistance for visually-impaired
- Multi-language translation

## Transcription Options

### Speech-to-Text Providers
- **Deepgram** (default): Low latency, high accuracy
- **Faster-Whisper**: Local, offline transcription
- **Google GenAI**: Cloud-based, multi-language

### Text-to-Speech Providers
- **ElevenLabs**: High-quality, natural voices
- **Kokoro ONNX**: Local, offline TTS
- **System TTS**: Platform native voices

## Privacy & Compliance

- **Data Storage**: Transcripts stored temporarily (configurable)
- **Recording Consent**: Bot announces presence in meeting
- **GDPR Compliant**: EU data residency options
- **SOC 2**: Security compliance
- **Encryption**: End-to-end for API keys and transcripts

## Rate Limits

- Free tier: 10 meetings/month
- Pro tier: 100 meetings/month
- Enterprise: Unlimited
- Concurrent meetings: 3 per account

## System Requirements

- **Browser**: Chromium (via Playwright)
- **Audio**: Working audio input/output
- **Network**: Stable internet connection (2+ Mbps)
- **Python**: 3.12+ required

## Troubleshooting

### "Failed to join meeting"
- Check meeting URL format
- Verify meeting hasn't started/ended
- Check network connectivity

### "Audio not working"
- Install system audio drivers
- Check browser permissions
- Verify audio device availability

### "Transcript not updating"
- Check API key validity
- Verify transcription service is running
- Check network for dropped packets

## Documentation

- [GitHub Repository](https://github.com/joinly-ai/joinly)
- [API Documentation](https://docs.joinly.ai)
- [Playwright Docs](https://playwright.dev)
- [Deepgram API](https://developers.deepgram.com)
