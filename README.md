# next-form

A modern, type-safe form library for Next.js applications.

## 🚀 Features

- **Type-safe**: Built with TypeScript for complete type safety
- **Next.js optimized**: Designed specifically for Next.js applications
- **Server-side validation**: Seamless integration between client and server validation
- **Zero-config**: Works out of the box with sensible defaults
- **Lightweight**: Minimal bundle size impact

## 📦 Installation

```bash
npm install next-form
# or
yarn add next-form
# or
pnpm add next-form
# or
bun add next-form
```

## 🛠️ Development

This is a monorepo managed with Bun workspaces.

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- Node.js 18+ (for compatibility)

### Setup

```bash
# Clone the repository
git clone https://github.com/your-username/next-form.git
cd next-form

# Install dependencies
bun install

# Start development
bun run dev
```

### Available Scripts

```bash
# Development
bun run dev                 # Start development mode
bun run build              # Build the package
bun run typecheck          # Run TypeScript type checking

# Code Quality
bun run check              # Run Biome linting and formatting check
bun run check:fix          # Fix Biome issues automatically
bun run lint               # Run linting only
bun run lint:fix           # Fix linting issues
bun run format             # Format code
bun run format:check       # Check code formatting

# Documentation
bun run docs:dev           # Start docs development server
bun run docs:build         # Build documentation
bun run docs:preview       # Preview built documentation

# Utilities
bun run clean              # Clean build artifacts
bun run test               # Run tests
```

## 🏗️ Project Structure

```
next-form/
├── packages/
│   ├── next-form/         # Main package
│   │   ├── src/
│   │   │   ├── client.ts  # Client-side exports
│   │   │   ├── server.ts  # Server-side exports
│   │   │   ├── core/      # Core functionality
│   │   │   └── examples/  # Usage examples
│   │   └── package.json
│   └── docs/              # Documentation (Astro)
│       ├── src/
│       └── package.json
├── .github/
│   ├── workflows/         # CI/CD workflows
│   └── dependabot.yml     # Dependency updates
├── biome.json             # Biome configuration
└── package.json           # Root package.json
```

## 🔄 CI/CD Pipeline

This project uses GitHub Actions for continuous integration and deployment:

### Workflows

1. **CI (`ci.yml`)**: Runs on every push and pull request

   - Type checking with TypeScript
   - Code quality checks with Biome
   - Building packages and documentation
   - Security audits

2. **Release (`release.yml`)**: Runs when a release is published

   - Builds and publishes to npm
   - Supports both regular and prerelease versions

3. **Dependabot Auto-merge**: Automatically merges patch and minor dependency updates

### Setting up CI/CD

To set up the CI/CD pipeline for your fork:

1. **NPM Token**: Add your npm token as `NPM_TOKEN` in GitHub repository secrets
2. **Branch Protection**: Enable branch protection for `main` branch
3. **Dependabot**: Dependabot is configured to check for updates weekly

### Release Process

1. Create a new release on GitHub with a tag following semantic versioning (e.g., `v1.0.0`)
2. The release workflow will automatically:
   - Build the package
   - Update the version in `package.json`
   - Publish to npm

For prereleases, mark the release as "prerelease" and it will be published with the `beta` tag.

## 🧪 Code Quality

This project uses [Biome](https://biomejs.dev/) for linting and formatting:

- **Linting**: Catches common errors and enforces best practices
- **Formatting**: Ensures consistent code style
- **Import sorting**: Automatically organizes imports
- **Fast**: Much faster than ESLint + Prettier combination

Configuration is in `biome.json`.

## 📚 Documentation

Documentation is built with [Astro Starlight](https://starlight.astro.build/) and deployed to Vercel.

To contribute to documentation:

```bash
bun run docs:dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run quality checks: `bun run check`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Bun](https://bun.sh/)
- Documentation with [Astro](https://astro.build/)
- Code quality with [Biome](https://biomejs.dev/)
