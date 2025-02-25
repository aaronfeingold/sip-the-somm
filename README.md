# SIP The Owl (Somm-in-Palm)

A virtual sommelier application that helps you find the perfect wine pairings for your meals.

![SIP The Owl Logo](/public/sipTheOwl.svg)

## Overview

SIP The Owl (Somm-in-Palm) is an AI-powered sommelier that analyzes your food and wine menu images to suggest optimal pairings. With a sassy, pretentious persona, SIP makes wine recommendations fun and accessible while providing expert advice.

## Features

- **Image Analysis**: Upload photos of your food and wine menus
- **AI-Powered Recommendations**: Get personalized wine pairing suggestions based on your dishes
- **Chat Interface**: Discuss and refine recommendations with SIP
- **Token Management**: Efficiently tracks API usage
- **Persistent Conversations**: Return to previous discussions

## Technologies

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit with Redux Persist
- **AI Integration**: OpenAI API
- **UI Components**: Custom components with shadcn/ui

## Getting Started

### Prerequisites

- Node.js v18
- npm
- OpenAI API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sip-the-somm.git
   cd sip-the-somm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3001](http://localhost:3001).

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
sip-the-somm/
├── public/               # Static assets
│   ├── sipTheOwl.svg     # Owl logo
│   └── wineLoader.gif    # Loading animation
├── src/
│   ├── actions/          # Server actions
│   ├── app/              # Next.js app router pages
│   ├── components/       # UI components
│   │   ├── chat/         # Chat-specific components
│   │   └── ui/           # Reusable UI components
│   ├── lib/              # Utility functions
│   ├── store/            # Redux store configuration
│   └── types/            # TypeScript type definitions
└── ...configuration files
```

## Token Management

The application includes a token management system to:
- Track token usage within conversations
- Warn users when approaching token limits
- Prevent exceeding OpenAI API token limits

## License

[MIT License](LICENSE)
