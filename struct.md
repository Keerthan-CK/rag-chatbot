.
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page (public homepage)
│   │
│   ├── login/                  # Auth routes
│   │   └── page.tsx
│   │
│   ├── dashboard/              # Protected routes
│   │   ├── layout.tsx          # Dashboard layout (with sidebar, later)
│   │   ├── page.tsx            # Dashboard home (shows user info, empty for now)
│   │   │
│   │   ├── documents/          # Upload & manage docs
│   │   │   └── page.tsx
│   │   │
│   │   ├── chat/               # RAG chat interface
│   │   │   └── page.tsx
│   │   │
│   │   └── settings/           # User settings
│   │       └── page.tsx
│   │
│   └── api/                    # Route handlers (server functions)
│       ├── process-doc/route.ts  # Handles text extraction, chunking, embeddings
│       └── auth/route.ts         # (optional) custom auth endpoints if needed
│
├── components/                 # Reusable UI components
│   ├── AuthForm.tsx
│   ├── FileUploader.tsx
│   └── Sidebar.tsx
│
├── hooks/
│   └── useAuth.ts              # Custom hook for Supabase session
│
├── lib/
│   └── supabaseClient.ts       # Supabase client instance
│
├── middleware.ts               # Protects /dashboard routes
│
├── public/                     # Static assets
│   └── middle.gif
│
├── styles/
│   └── globals.css             # Tailwind CSS imports
│
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── tsconfig.json
