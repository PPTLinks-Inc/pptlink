# Audio File Quick Reference

## Audio File URL
```
https://res.cloudinary.com/dsmydljex/video/upload/v1732362719/assets/mic-request_nnca38_nj9fmv.mp3
```

## File Type
MP3 Audio

## Where It's Initialized
**File:** `src/components/interface/store/audioStore.ts`  
**Line:** 645

```typescript
const audio = new Audio("https://res.cloudinary.com/dsmydljex/video/upload/v1732362719/assets/mic-request_nnca38_nj9fmv.mp3");
audio.volume = 1;
audio.load();
useRtmStore.setState({ audio });
```

## Where It's Used

### 1. Request to Speak (Main Use)
**File:** `src/components/interface/store/rtmStore.ts`  
**Line:** 304

When a participant's `micState` changes to `REQ_MIC`, the audio plays along with a toast: "Someone requested to speak"

### 2. Mic Muted Alert
**File:** `src/components/interface/store/rtmStore.ts`  
**Line:** 138

When a participant receives a `MIC_MUTED` message, the audio plays along with a toast: "Unmute your mic to speak"

## How to Update the Audio File

### Option 1: Update Cloudinary URL
Edit line 645 in `src/components/interface/store/audioStore.ts`:
```typescript
const audio = new Audio("YOUR_NEW_CLOUDINARY_URL");
```

### Option 2: Use Local File
1. Add your audio file to the `public` folder
2. Update line 645 in `src/components/interface/store/audioStore.ts`:
```typescript
const audio = new Audio("/your-audio-file.mp3");
```

## Quick Test

To test if the audio works:
1. Open browser console
2. Navigate to a live presentation
3. Have a participant request to speak
4. You should hear the audio notification

## See Also
- Full documentation: `AUDIO_NOTIFICATION_DOCUMENTATION.md`
- Audio store: `src/components/interface/store/audioStore.ts`
- RTM store: `src/components/interface/store/rtmStore.ts`
