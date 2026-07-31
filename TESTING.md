# Phase 1 Testing & Debug Guide

## Debug Trace

The unlock flow has a debug trace that logs key state transitions.

### Backend Debug Trace

Enable with:
```bash
cd cyberquest_api
CYBERQUEST_DEBUG=true pnpm dev
```

Trace points:
- `[ProgressTrace] submit_start` - lesson submission begins
- `[ProgressTrace] module_completed` - module marked complete
- `[ProgressTrace] module_in_progress` - module still in progress
- `[ProgressTrace] submit_complete` - submission finished
- `[ProgressTrace] submit_error` - submission failed

### Frontend Debug Trace

Enabled automatically in development mode (`__DEV__`).

Trace points:
- `[UnlockTrace] isUnlocked` - unlock check result
- `[UnlockTrace] useSubmitLessonProgress success` - lesson submission success

## Running Tests

### Backend

```bash
cd cyberquest_api

# Install deps (if not already installed)
pnpm add -D jest @types/jest ts-jest supertest @types/supertest jest-environment-node

# Run all tests
pnpm test

# Run with watch
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run integration tests only
pnpm test:integration

# Run unit tests only
pnpm test:unit
```

### Frontend

```bash
cd cyberquest_mobile

# Install deps
pnpm add -D jest @types/jest ts-jest @testing-library/react-native @testing-library/jest-native jest-expo

# Run all tests
pnpm test

# Run with watch
pnpm test:watch
```

## Test Files

### Backend
- `src/__tests__/progressService.test.ts` - Unit tests for XP scoring logic
- `src/__tests__/progress.integration.test.ts` - Integration tests for progress API

### Frontend
- `src/__tests__/useHomeData.test.ts` - Unit tests for home screen unlock logic
- `src/__tests__/setup.ts` - Test mocks for React Native and Expo Router

## Debugging the Unlock Flow

When the next mission stays locked:

1. Enable backend debug: `CYBERQUEST_DEBUG=true pnpm dev`
2. Complete a lesson in the mobile app
3. Check backend terminal for `[ProgressTrace]` logs
4. Check mobile console for `[UnlockTrace]` logs
5. Look for:
   - `module_completed` in backend → module marked complete
   - `useSubmitLessonProgress success` in frontend → mutation succeeded
   - `isUnlocked` in frontend → unlock check result

Common issues:
- `module_in_progress` with `completedLessons < totalLessons` → ageGroup filter mismatch
- `isUnlocked` returns false with `moduleStatus=completed` → lectureId mismatch
- No `module_completed` log → lesson not counting as complete
