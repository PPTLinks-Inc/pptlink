# Audio Notification Documentation

This document describes the audio notification system used in PPTLink for alerting the host when someone requests to speak during a presentation.

## Audio File Location

The audio notification file is hosted on Cloudinary:
```
https://res.cloudinary.com/dsmydljex/video/upload/v1732362719/assets/mic-request_nnca38_nj9fmv.mp3
```

This is an MP3 audio file that plays when specific events occur during a live presentation.

## How the Audio System Works

### 1. Audio Initialization

**Location:** `src/components/interface/store/audioStore.ts` (line 645)

When a user joins a presentation, the audio notification is initialized:

```typescript
const audio = new Audio("https://res.cloudinary.com/dsmydljex/video/upload/v1732362719/assets/mic-request_nnca38_nj9fmv.mp3");
audio.volume = 1;
audio.load();

useRtmStore.setState({ audio });
```

The audio element is:
- Created as an HTML Audio element
- Set to maximum volume (1)
- Preloaded for instant playback
- Stored in the RTM (Real-Time Messaging) store for global access

### 2. Audio Storage

**Location:** `src/components/interface/store/rtmStore.ts` (line 37)

The audio is stored in the RTM store state:

```typescript
interface RtmStore {
    // ... other properties
    audio: HTMLAudioElement | null;
    // ... other properties
}
```

This makes the audio accessible throughout the application.

### 3. Audio Playback Scenarios

The audio notification plays in **two main scenarios**:

#### Scenario 1: Request to Speak Notification (PRIMARY USE CASE)

**Location:** `src/components/interface/store/rtmStore.ts` (lines 290-307)

When a participant requests permission to speak:

```typescript
handleUserDataChange: function () {
    let presenceEvents: RTMEvents.PresenceEvent[] = [];
    let timeout: NodeJS.Timeout;

    return function (event: RTMEvents.PresenceEvent) {
        presenceEvents.push(event);
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            let playAudio = false;
            for (const event of presenceEvents) {
                if (event.stateChanged.micState === String(MIC_STATE.REQ_MIC)) {
                    playAudio = true;
                }
                get().presencesEvent(event);
            }
            if (playAudio) {
                toast({
                    description: "Someone requested to speak"
                });
                get().audio?.play().catch((error) => {
                    console.error("Error playing audio", error);
                });
            }
            presenceEvents = [];
        }, 1000);
    }
}
```

**Process:**
1. The system monitors presence events from participants
2. Events are batched together with a 1-second debounce
3. When a participant's `micState` changes to `REQ_MIC` (Request Microphone)
4. A toast notification appears: "Someone requested to speak"
5. The audio notification plays to alert the host
6. Any playback errors are logged to the console

#### Scenario 2: Mic Muted Notification (SECONDARY USE CASE)

**Location:** `src/components/interface/store/rtmStore.ts` (lines 134-144)

When a participant tries to speak but their mic is muted:

```typescript
else if (messageData.message === MIC_STATE.MIC_MUTED || messageData.message === MIC_STATE.MIC_OFF) {
    if (messageData.message === MIC_STATE.MIC_MUTED) {
        const audio = get().audio;
        if (audio) {
            audio.play().catch((error) => {
                console.error("Error playing audio", error);
            });
            toast({
                description: "Unmute your mic to speak"
            });
        }
    }
    else if (messageData.message === MIC_STATE.MIC_OFF) {
        toast({ description: "Your microphone is muted by the host" });
    }
    useAudioStore.getState().setMicState(messageData.message);
}
```

**Process:**
1. When a message is received indicating mic state change
2. If the mic is muted (`MIC_MUTED`), the audio plays
3. A toast notification appears: "Unmute your mic to speak"
4. If the mic is turned off by host (`MIC_OFF`), only a toast appears (no audio)

## Microphone States

The system uses the following microphone states (defined in `src/constants/routes`):

- `REQ_MIC`: User is requesting permission to speak
- `CAN_SPK`: User is allowed to speak
- `MIC_MUTED`: User's microphone is muted
- `MIC_OFF`: User's microphone is turned off by the host

## Priority System

Users are sorted by their mic state with the following priority:

```typescript
const statusPriority: { [key: string]: number } = {
    REQ_MIC: 1,      // Highest priority
    CAN_SPK: 2,
    MIC_MUTED: 3,
    MIC_OFF: 4       // Lowest priority
};
```

Users requesting to speak (`REQ_MIC`) appear at the top of the participants list.

## Event Flow Diagram

```
Participant Requests to Speak
         ↓
RTM Presence Event Fired
         ↓
Event Added to presenceEvents Array
         ↓
1-Second Debounce Timer
         ↓
Check if micState === REQ_MIC
         ↓
     [YES] → Play Audio + Show Toast Notification
         ↓
Host is Notified
```

## Technical Implementation Details

### Real-Time Messaging (RTM)

The system uses Agora RTM SDK for real-time communication:
- **RTM Client:** Handles real-time messaging between participants
- **Presence Events:** Track user state changes (joining, leaving, mic state changes)
- **Message Events:** Handle direct messages and system notifications

### Error Handling

All audio playback includes error handling:
```typescript
audio?.play().catch((error) => {
    console.error("Error playing audio", error);
});
```

This prevents crashes if:
- The audio file fails to load
- Browser autoplay policies block the audio
- The audio element is not initialized

### User Experience Considerations

1. **Debouncing:** Events are batched with a 1-second delay to prevent audio spam if multiple users request to speak simultaneously
2. **Optional Chaining:** `audio?.play()` ensures the code doesn't crash if audio is null
3. **Visual + Audio Feedback:** Both toast notifications and audio provide redundant notification channels
4. **Volume Control:** Audio is set to maximum volume (1) to ensure host doesn't miss requests

## Related Files

- **audioStore.ts** - Initializes the audio element and manages audio/video state
- **rtmStore.ts** - Handles RTM events and plays audio notifications
- **messageStore.ts** - Manages chat messages
- **presentationStore.ts** - Manages presentation state
- **constants/routes** - Defines MIC_STATE constants

## Future Improvements

Potential enhancements to consider:

1. **Local Audio File:** Host audio file locally instead of Cloudinary for faster loading
2. **Custom Sounds:** Allow hosts to select different notification sounds
3. **Volume Control:** Add user preference for notification volume
4. **Visual-Only Mode:** Option to disable audio and use only visual notifications
5. **Multiple Audio Cues:** Different sounds for different types of notifications

## Troubleshooting

### Audio Not Playing

**Common causes:**
1. **Browser Autoplay Policy:** Modern browsers block autoplay until user interacts with the page
2. **Network Issues:** Cloudinary URL might be blocked or slow
3. **Audio Element Not Initialized:** Check that audioStore initialization completed
4. **Audio File URL Changed:** Verify Cloudinary URL is still valid

**Solutions:**
- Check browser console for errors
- Ensure user has interacted with the page before audio playback
- Verify network access to Cloudinary
- Test audio URL directly in browser

### Audio Playing Multiple Times

**Cause:** Multiple presence events triggering audio simultaneously

**Solution:** The debouncing mechanism (1-second timeout) should prevent this, but check for rapid state changes

## Summary

The audio notification system provides real-time alerts to hosts when participants:
1. Request permission to speak (primary use case)
2. Try to speak while muted (secondary use case)

The audio file is hosted on Cloudinary and managed through the Zustand state management system, with playback triggered by Agora RTM presence events.
