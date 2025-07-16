import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Chatroom {
  id: string;
  title: string;
  createdAt: string;
}

export interface Message {
  id: string;
  chatroomId: string;
  content: string;
  type: 'text' | 'image';
  sender: 'user' | 'ai';
  timestamp: string;
  imageUrl?: string;
}

interface ChatroomStore {
  chatrooms: Chatroom[];
  messages: Record<string, Message[]>; // grouped by chatroom ID
  loadingStates: Record<string, {
    isLoadingMessages: boolean;
    isLoadingPagination: boolean;
    isTyping: boolean;
    hasMoreMessages: boolean;
    loadedCount: number;
  }>;
  
  // Chatroom methods
  addChatroom: (title: string) => string;
  deleteChatroom: (id: string) => void;
  renameChatroom: (id: string, newTitle: string) => void;
  initializeSampleChats: () => void;
  
  // Message methods
  addMessage: (chatroomId: string, content: string, type: 'text' | 'image', imageUrl?: string) => void;
  loadMessages: (chatroomId: string) => void;
  loadMoreMessages: (chatroomId: string) => void;
  setTyping: (chatroomId: string, isTyping: boolean) => void;
  simulateAIResponse: (chatroomId: string) => void;
  initializeDummyMessages: (chatroomId: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const sampleChats: Chatroom[] = [
  {
    id: 'sample-1',
    title: 'Getting Started with AI',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Web Development Tips',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'React Best Practices',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

// Dummy AI responses
const aiResponses = [
  "That's a great question! Let me help you with that.",
  "I understand what you're looking for. Here's my take on it...",
  "Interesting point! I'd approach this differently...",
  "Based on my knowledge, I'd recommend...",
  "That's a complex topic. Let me break it down for you...",
  "Great observation! Here's some additional context...",
  "I can definitely help with that. Consider this approach...",
  "You're on the right track! Let me add some insights...",
  "That's worth exploring further. Here's what I think...",
  "Excellent question! This is how I'd handle it...",
];

// Generate dummy messages for a chatroom
const generateDummyMessages = (chatroomId: string, count: number = 50): Message[] => {
  const messages: Message[] = [];
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now - (count - i) * 60 * 60 * 1000).toISOString();
    const isUserMessage = i % 2 === 0;
    
    messages.push({
      id: `msg-${chatroomId}-${i}`,
      chatroomId,
      content: isUserMessage 
        ? `This is user message ${i + 1}. Testing the chat interface with various lengths of text to see how it handles different scenarios.`
        : aiResponses[Math.floor(Math.random() * aiResponses.length)],
      type: 'text',
      sender: isUserMessage ? 'user' : 'ai',
      timestamp,
    });
  }
  
  return messages;
};

export const useChatroomStore = create<ChatroomStore>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      messages: {},
      loadingStates: {},
      
      addChatroom: (title: string) => {
        const newChatroom: Chatroom = {
          id: generateId(),
          title: title.trim(),
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms],
        }));
        
        return newChatroom.id;
      },
      
      deleteChatroom: (id: string) => {
        set((state) => {
          const newMessages = { ...state.messages };
          delete newMessages[id];
          
          const newLoadingStates = { ...state.loadingStates };
          delete newLoadingStates[id];
          
          return {
            chatrooms: state.chatrooms.filter(chatroom => chatroom.id !== id),
            messages: newMessages,
            loadingStates: newLoadingStates,
          };
        });
      },
      
      renameChatroom: (id: string, newTitle: string) => {
        set((state) => ({
          chatrooms: state.chatrooms.map(chatroom =>
            chatroom.id === id 
              ? { ...chatroom, title: newTitle.trim() }
              : chatroom
          ),
        }));
      },
      
      initializeSampleChats: () => {
        const { chatrooms } = get();
        if (chatrooms.length === 0) {
          set({ chatrooms: sampleChats });
        }
      },
      
      addMessage: (chatroomId: string, content: string, type: 'text' | 'image', imageUrl?: string) => {
        const newMessage: Message = {
          id: generateId(),
          chatroomId,
          content,
          type,
          sender: 'user',
          timestamp: new Date().toISOString(),
          imageUrl,
        };
        
        set((state) => ({
          messages: {
            ...state.messages,
            [chatroomId]: [...(state.messages[chatroomId] || []), newMessage],
          },
        }));
      },
      
      loadMessages: (chatroomId: string) => {
        const { messages } = get();
        
        if (messages[chatroomId]) {
          return; // Already loaded
        }
        
        set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            [chatroomId]: {
              isLoadingMessages: true,
              isLoadingPagination: false,
              isTyping: false,
              hasMoreMessages: true,
              loadedCount: 0,
            },
          },
        }));
        
        // Simulate loading delay
        setTimeout(() => {
          const dummyMessages = generateDummyMessages(chatroomId);
          const messagesToShow = dummyMessages.slice(-20); // Show last 20 messages
          
          set((state) => ({
            messages: {
              ...state.messages,
              [chatroomId]: messagesToShow,
            },
            loadingStates: {
              ...state.loadingStates,
              [chatroomId]: {
                ...state.loadingStates[chatroomId],
                isLoadingMessages: false,
                hasMoreMessages: dummyMessages.length > 20,
                loadedCount: 20,
              },
            },
          }));
        }, 500);
      },
      
      loadMoreMessages: (chatroomId: string) => {
        const { loadingStates } = get();
        const currentState = loadingStates[chatroomId];
        
        if (!currentState || !currentState.hasMoreMessages || currentState.isLoadingPagination) {
          return;
        }
        
        set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            [chatroomId]: {
              ...state.loadingStates[chatroomId],
              isLoadingPagination: true,
            },
          },
        }));
        
        setTimeout(() => {
          const dummyMessages = generateDummyMessages(chatroomId);
          const currentCount = currentState.loadedCount;
          const startIndex = Math.max(0, dummyMessages.length - currentCount - 20);
          const endIndex = dummyMessages.length - currentCount;
          const newMessages = dummyMessages.slice(startIndex, endIndex);
          
          set((state) => ({
            messages: {
              ...state.messages,
              [chatroomId]: [...newMessages, ...(state.messages[chatroomId] || [])],
            },
            loadingStates: {
              ...state.loadingStates,
              [chatroomId]: {
                ...state.loadingStates[chatroomId],
                isLoadingPagination: false,
                hasMoreMessages: startIndex > 0,
                loadedCount: currentCount + newMessages.length,
              },
            },
          }));
        }, 800);
      },
      
      setTyping: (chatroomId: string, isTyping: boolean) => {
        set((state) => ({
          loadingStates: {
            ...state.loadingStates,
            [chatroomId]: {
              ...state.loadingStates[chatroomId],
              isTyping,
            },
          },
        }));
      },
      
      simulateAIResponse: (chatroomId: string) => {
        const { setTyping } = get();
        
        // Start typing indicator
        setTyping(chatroomId, true);
        
        // Simulate AI response after 1.2 seconds
        setTimeout(() => {
          const aiResponse: Message = {
            id: generateId(),
            chatroomId,
            content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
            type: 'text',
            sender: 'ai',
            timestamp: new Date().toISOString(),
          };
          
          set((state) => ({
            messages: {
              ...state.messages,
              [chatroomId]: [...(state.messages[chatroomId] || []), aiResponse],
            },
            loadingStates: {
              ...state.loadingStates,
              [chatroomId]: {
                ...state.loadingStates[chatroomId],
                isTyping: false,
              },
            },
          }));
        }, 1200);
      },
      
      initializeDummyMessages: (chatroomId: string) => {
        const { messages } = get();
        if (!messages[chatroomId]) {
          get().loadMessages(chatroomId);
        }
      },
    }),
    {
      name: 'chatroom-store',
      version: 2,
    }
  )
); 