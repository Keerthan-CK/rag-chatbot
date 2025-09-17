# The R.A.G Chatbot 

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.54-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Framer Motion](https://img.shields.io/badge/Framer--Motion-12.23-ff69b4?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

![Demo GIF](./public/rag.gif)  
![App Screenshot](./public/chat.png)  

---

## ✨ Features  
- 📄 Upload PDFs / Docs / Text files  
- 💬 Chat with documents using **RAG + Gemini AI**  
- ⚡ Real-time streaming responses  
- 🎨 Beautiful UI built with **TailwindCSS, Lucide Icons, Motion, and Lottie**  
- 🔐 Magic Link authentication (Supabase)  
- 📚 Knowledge chunking & embeddings with **LangChain**  

## 🚀 Getting Started

### Clone the repo
```bash
git clone https://github.com/your-username/rag-chatbot.git
cd rag-chatbot

## Install dependencies
npm install
# or
pnpm install
# or
yarn install
```
---

## 🛠️ Tech Stack

- Frontend: Next.js 15, React 19, Tailwind CSS 4, Motion, Lottie
- UI Tools: Lucide React, MUI Sidebar, HoverBorderGradient, GridPattern
- Backend: Express, Supabase Auth, PostgreSQL
- AI & RAG: LangChain, Google Generative AI (Gemini), Embeddings
- File Processing: pdf-parse, mammoth (DOCX → text)

---

# 📦 Dependencies Highlight

Some niche but super helpful packages:

-langchain → for building RAG pipelines
- @google/generative-ai → Gemini API SDK
- mammoth → clean .docx → text extraction
- pdf-parse → parse PDF text
- motion → smooth animations
- lottie-react → animated loaders / effects
- react-mui-sidebar → easy sidebar
- tw-animate-css → Tailwind + animate.css utility
