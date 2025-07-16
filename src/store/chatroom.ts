import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Chatroom {
  id: string;
  title: string;
  createdAt: string;
}

interface ChatroomStore {
  chatrooms: Chatroom[];
  addChatroom: (title: string) => void;
  deleteChatroom: (id: string) => void;
  renameChatroom: (id: string, newTitle: string) => void;
  initializeSampleChats: () => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const sampleChats: Chatroom[] = [
  {
    id: 'sample-1',
    title: 'Getting Started with AI',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'sample-2',
    title: 'Web Development Tips',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'sample-3',
    title: 'React Best Practices',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
  },
];

export const useChatroomStore = create<ChatroomStore>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      
      addChatroom: (title: string) => {
        const newChatroom: Chatroom = {
          id: generateId(),
          title: title.trim(),
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms],
        }));
      },
      
      deleteChatroom: (id: string) => {
        set((state) => ({
          chatrooms: state.chatrooms.filter(chatroom => chatroom.id !== id),
        }));
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
    }),
    {
      name: 'chatroom-store',
      version: 1,
    }
  )
); 