# SaaS Starter Kit

A modern, production-ready SaaS starter kit built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## 🚀 Features

- ⚡ Next.js 14 with App Router
- 🎨 Tailwind CSS v4 with CSS variables for theming
- ✨ shadcn/ui components
- 🛠 TypeScript
- 🔍 ESLint + Prettier
- 🐶 Husky for Git hooks
- 📦 Built-in component generator
- 🎭 Dark mode support
- 📱 Fully responsive design

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Linting**: [ESLint](https://eslint.org/)
- **Code Formatting**: [Prettier](https://prettier.io/)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/)

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bennguyen-dev/saas-starter-kit.git
   cd saas-starter-kit
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   # or
   pnpm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Development

### Available Scripts

- `dev`: Start the development server
- `build`: Build the application for production
- `start`: Start the production server
- `lint`: Run ESLint
- `format`: Format code with Prettier
- `format:check`: Check code formatting

### Adding Components

Use the shadcn CLI to add new components:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add form
```

## 🎨 Theming

This project uses CSS variables for theming. You can customize the theme by modifying the variables in `src/app/globals.css`.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Vercel](https://vercel.com/)
