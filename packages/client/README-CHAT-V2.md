# Chat System V2 Architecture

This document explains the architecture of the new chat system (v2) that provides a more modular, maintainable, and scalable approach to handling chat functionality.

## Design Principles

- **Single Responsibility Principle**: Each store is responsible for a specific domain (sessions, messages, chat UI)
- **Separation of Concerns**: Clear separation between data management, UI state, and API interactions
- **State Layering**:
  - Server state managed by TanStack Query
  - Client state managed by Zustand
  - Derived state via selectors
- **Modular Architecture**: Composed of small, focused modules

## Core Components

### Stores

1. **ChatSessionStoreV2**
   - Manages chat sessions (create, delete, rename, etc.)
   - Handles temporary and permanent sessions
   - Tracks current session

2. **ChatMessageStoreV2**
   - Stores messages by session ID
   - Handles message CRUD operations
   - Supports streaming updates

3. **ChatStoreV2**
   - Manages chat UI state (loading, intent detection)
   - Coordinates between session and message stores
   - Handles message sending and intent processing

### Services

1. **ChatSessionServiceV2**
   - Encapsulates session operations with backend
   - Provides API for session CRUD operations

2. **ChatServiceV2**
   - Handles chat message processing
   - Manages intent detection
   - Handles message streaming

### UI Components

1. **ChatPageV2**
   - Main page component
   - Handles URL parameters for session routing

2. **ChatContainerV2**
   - Container for the chat interface
   - Manages chat input and messages display

3. **ChatSessionsV2**
   - Displays and manages chat sessions
   - Provides UI for session operations

4. **ChatMessageListV2**
   - Renders messages for the current session
   - Handles message-specific UI logic

5. **Message Bubbles**
   - `MessageBubbleV2`: Base component
   - `UserMessageBubbleV2`: User messages
   - `AIMessageBubbleV2`: AI responses

## Data Flow

1. User sends a message:
   - `ChatContainerV2` calls `sendMessage` from `ChatStoreV2`
   - `ChatStoreV2` coordinates creating/updating session and messages
   - Message is added to `ChatMessageStoreV2`

2. Session management:
   - `ChatSessionStoreV2` handles session state
   - `ChatSessionServiceV2` persists changes to backend
   - `useChatSessionsV2` hook fetches sessions from API

3. Message display:
   - `ChatMessageListV2` gets messages from `ChatMessageStoreV2`
   - Renders appropriate message bubbles based on message type

## User Scenarios

### Guest Mode
- Creates temporary sessions that aren't persisted
- All data is stored in memory only
- Sessions are lost on page refresh

### Authenticated User
- Creates persistent sessions stored in backend
- Can switch between sessions
- Can rename, clear, and delete sessions
- Sessions persist across page refreshes

## URL Routing

- `/chat-v2`: Base chat page
- `/chat-v2/:sessionId`: Opens specific chat session

## Key Improvements

1. **Modularity**: Clear separation between different concerns
2. **Performance**: Minimized re-renders through focused state updates
3. **Maintainability**: Smaller, more focused files with clear responsibilities
4. **Scalability**: Easy to add new features or message types
5. **State Management**: Proper separation of server vs. client state

## Migration Path

This v2 system can coexist with the v1 system, allowing for gradual migration of features and testing before full replacement. 
