# KINO.VIP - Multilingual Movie Platform

🎬 A modern movie streaming platform with automatic translation support, built with Next.js 16.

## ✨ Features

- 🌍 **Multilingual Support** - Russian and English with automatic content translation
- 🎥 **Movie Database** - Powered by Kinopoisk API
- 🔍 **Advanced Search** - Find movies and series easily
- ⭐ **Top Movies** - Browse top 250, popular, and awaited films
- ❤️ **Favorites** - Save your favorite movies
- 📜 **Watch History** - Track what you've watched
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui
- 🔐 **Authentication** - Secure user authentication with Stack Auth

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Kinopoisk API key from [kinopoiskapiunofficial.tech](https://kinopoiskapiunofficial.tech/)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd kino
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
KINOPOISK_API_KEY_1=your_api_key_here
# Optional: Add more keys for rotation
KINOPOISK_API_KEY_2=your_second_key
```

4. Run the development server:

```bash
npm run dev
```

5. Open your browser:

- Root URL (auto-redirects to Russian): [http://localhost:3000](http://localhost:3000)
- Russian version: [http://localhost:3000/ru](http://localhost:3000/ru)
- English version: [http://localhost:3000/en](http://localhost:3000/en)

## 🌐 Multilingual System

### How It Works

The platform uses **next-intl** for internationalization with automatic content translation:

1. **UI Elements** - Translated via JSON files (`messages/ru.json`, `messages/en.json`)
2. **API Content** - Automatically translated from Russian to English using Google Translate API
3. **URL Structure** - All pages have language prefix (`/ru/`, `/en/`)

### Supported Languages

- 🇷🇺 Russian (default)
- 🇺🇸 English

### What Gets Translated

- Movie titles and descriptions
- Genres and countries
- Slogans and additional info
- All UI elements and navigation

For more details, see [docs/MULTILINGUAL.md](docs/MULTILINGUAL.md)

## 📁 Project Structure

```
src/
├── app/
│   ├── [locale]/          # Localized pages
│   │   ├── about/[id]/   # Movie details
│   │   ├── watch/[id]/   # Movie player
│   │   ├── search/       # Search page
│   │   ├── top/          # Top movies
│   │   ├── favorites/    # User favorites
│   │   └── history/      # Watch history
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── Header.tsx
│   ├── Hero.tsx
│   └── NavigationPanel.tsx
├── lib/                 # Utilities
│   ├── api.ts          # Kinopoisk API client
│   ├── translate.ts    # Translation utilities
│   └── utils.ts
├── i18n/               # Internationalization config
│   ├── routing.ts
│   └── request.ts
└── middleware.ts       # Next.js middleware

messages/               # Translation files
├── ru.json
└── en.json
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Internationalization**: next-intl
- **Authentication**: Stack Auth
- **Database**: Prisma + PostgreSQL
- **API**: Kinopoisk Unofficial API
- **Translation**: Google Translate API

## 📖 Documentation

- [Multilingual Setup Guide](docs/MULTILINGUAL.md)
- [Setup Instructions (Russian)](docs/SETUP.ru.md)

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## 🌟 Key Features Explained

### Automatic Translation

Content from Kinopoisk API (Russian only) is automatically translated to English when users switch languages. Translation is done client-side using Google Translate API.

**Translation Caching:**

- Translations are cached in browser localStorage
- Cache persists between sessions for faster loading
- Automatic cleanup when cache exceeds 1000 entries
- Each movie and text is translated only once
- Significantly improves performance on repeat visits

### Language Switching

Users can switch languages via the dropdown menu in the header (🌐 icon). The page automatically reloads with the selected language.

### API Key Rotation

The platform supports multiple API keys for automatic rotation when rate limits are reached. Add additional keys in `.env`:

```env
KINOPOISK_API_KEY_1=key1
KINOPOISK_API_KEY_2=key2
KINOPOISK_API_KEY_3=key3
```

## 📝 License

This project is for educational purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Made with ❤️ using Next.js and modern web technologies
