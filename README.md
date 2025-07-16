# Kuvaka Chat UI

A modern, responsive chat interface built with Next.js, Tailwind CSS, and TypeScript.  
**Live Demo:** [https://frontend-kuvaka-tech-assignment.vercel.app/](https://frontend-kuvaka-tech-assignment.vercel.app/)

---

## 🚀 Project Overview

Kuvaka AI is a demo chat application featuring:
- Real-time-like chat UI with simulated AI responses
- Phone-based authentication (with OTP simulation)
- Collapsible sidebar with recent conversations and search
- Dark/light mode toggle
- Mobile-first, accessible design
- Infinite scroll, pagination, and throttling for smooth UX

---

## 🖼️ Screenshots

![Screenshot 1](https://i.ibb.co/KzyVmbZ9/Screenshot-2025-07-17-000455.png)
![Screenshot 2](https://i.ibb.co/RTKQBF2p/Screenshot-2025-07-17-000723.png)
![Screenshot 3](https://i.ibb.co/bgfYhQPY/Screenshot-2025-07-17-000840.png)

---

## 🛠️ Setup & Run Instructions

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd gemini-frontend-kuvaka-tech-assignment
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**  
   Visit [http://localhost:3000](http://localhost:3000)

---

## 📁 Folder & Component Structure

```
src/
  app/                # Next.js app directory (routing, pages, global styles)
    auth/             # Auth page (phone login, OTP)
    chat/[id]/        # Individual chatroom pages
    globals.css       # Global styles and theme variables
    layout.tsx        # App layout
    page.tsx          # Landing page (dashboard)
  components/
    Sidebar.tsx       # Collapsible sidebar (recent chats, search, dark mode)
    ThemeProvider.tsx # Handles dark/light mode
    dashboard/        # Dashboard UI components
      - DarkModeToggle.tsx
      - ChatroomCard.tsx
      - ChatroomList.tsx
      - ChatroomListSkeleton.tsx
      - ChatroomOptions.tsx
      - RenameModal.tsx
    chat/             # Chat UI components
      - MessageInput.tsx
      - MessageBubble.tsx
      - ChatInterface.tsx
      - MessageList.tsx
      - LoadingSkeletons.tsx
      - TypingIndicator.tsx
    auth/             # Auth form components
      - CountryCodeSelector.tsx
      - LoginForm.tsx
      - OTPInput.tsx
      - PhoneInput.tsx
      - LoadingSkeleton.tsx
    ui/               # (Reserved for shared UI components)
  hooks/
    useCountries.ts   # Fetches and parses country data for phone login
    useDebounce.ts    # Debounce hook for search inputs
  store/
    chatroom.ts       # Zustand store for chatrooms/messages (pagination, infinite scroll)
    theme.ts          # Zustand store for dark mode
  lib/
    validation.ts     # Zod schemas for form validation
```

---

## ⚙️ Implementation Details

### Throttling
- **Where:** `src/components/chat/ChatInterface.tsx`
- **How:** Uses a `throttleRef` and `setTimeout` to delay/suppress rapid AI responses when sending messages, preventing spam.

### Pagination & Infinite Scroll
- **Where:** `src/store/chatroom.ts`, `src/components/chat/MessageList.tsx`
- **How:**  
  - Messages are loaded in chunks (20 at a time) using `loadMessages` and `loadMoreMessages`.
  - `MessageList` listens for scroll-to-top events and triggers `onLoadMore` to fetch older messages, simulating infinite scroll.
  - State tracks `hasMoreMessages`, `isLoadingPagination`, and `loadedCount` for each chatroom.

### Debouncing (Search Throttling)
- **Where:** `src/hooks/useDebounce.ts`, `src/components/Sidebar.tsx`
- **How:**  
  - The sidebar search input uses a custom `useDebounce` hook to delay search/filtering until the user stops typing.

### Form Validation
- **Where:** `src/lib/validation.ts`, `src/components/auth/LoginForm.tsx`
- **How:**  
  - Uses [Zod](https://zod.dev/) schemas for validating phone numbers and OTPs.
  - Integrated with `react-hook-form` for robust, type-safe validation and error handling.

---

## 📚 Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://zustand-demo.pmnd.rs/) (state management)
- [Zod](https://zod.dev/) (form validation)
- [react-hook-form](https://react-hook-form.com/) (forms)
- [react-hot-toast](https://react-hot-toast.com/) (notifications)

---

## 🤝 Contributing

Feel free to fork, open issues, or submit PRs!

---
