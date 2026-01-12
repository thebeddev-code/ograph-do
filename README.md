# Ograph-do
A To-Do app that makes todos management feel more intuitive and natural, by visualizing your todos on a dynamic clock graph. 

## Features

- [ ] Visualization of todos on clock-graph
- [Y] Todo CRUD
- [ ] Responsive design works on desktop and mobile
- [ ] Persisted state using local storage

## Prerequisites

- Node.js ≥ 18
- npm, yarn, pnpm, or bun

## Installation

```bash
# Clone the repository
git clone https://github.com/thebeddev-code/ograph-do.git
cd ograph-do/apps/web

# Install dependencies (choose your package manager)
pnpm install      # or yarn install, npm install, bun install
```

## Getting Started

```bash
# Start the app
pnpm run dev      # or yarn dev, npm dev, bun dev
```

```bash
# Start the mock-server
pnpm run dev:server      # or yarn dev, npm dev, bun dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the app.

## Building for Production

```bash
npm run build    # or yarn build, pnpm build, bun build
npm start        # or yarn start, pnpm start, bun start
```

The optimized production build will be output to the `dist` (or `build`) directory.

## Scripts Overview

| Script  | Description                                        |
| ------- | -------------------------------------------------- |
| `dev`   | Launches the development server with hot‑reloading |
| `build` | Generates an optimized production build            |
| `start` | Serves the production build locally                |
| `lint`  | Runs ESLint to check code quality                  |

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is licensed under the **AGPL License**. See `LICENSE` for details.
