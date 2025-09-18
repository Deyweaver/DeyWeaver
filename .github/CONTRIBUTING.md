# Contributing to DeyWeaver

## 🎉 Welcome

Thank you for your interest in contributing to DeyWeaver! We're excited to have you join our community of developers working on this AI-integrated productivity tool. Your contributions help make DeyWeaver better for everyone.

DeyWeaver is an open-source productivity application that helps users organize their day, prioritize tasks, and optimize time management through intelligent AI-powered scheduling.

## 📋 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful, professional, and considerate in all interactions. We expect all contributors to foster an inclusive environment where everyone feels safe to participate.

A formal Code of Conduct will be added in the future. Until then, we expect all participants to:
- Be respectful and inclusive
- Use welcoming and inclusive language
- Be collaborative and supportive
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

Before contributing to DeyWeaver, ensure you have the following installed:

- **Node.js** (v18 or newer recommended)
- **npm** or **yarn** package manager
- **Git** for version control
- A **Google AI API Key** for testing AI features

### Repository Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/DeyWeaver.git
   cd DeyWeaver
   ```
3. **Add the original repository as upstream**:
   ```bash
   git remote add upstream https://github.com/Deyweaver/DeyWeaver.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
   ```
   *You can obtain a Google API key from [Google AI Studio](https://aistudio.google.com/app/apikey)*

6. **Start the development server**:
   ```bash
   npm run dev
   ```
   This starts the Next.js app (usually on `http://localhost:9002`) and the Genkit development server.

7. **Verify your setup**:
   ```bash
   npm run typecheck
   ```

## 📁 Project Structure

DeyWeaver follows a standard Next.js 15 App Router structure:

```
├── .github/              # GitHub templates and workflows
├── docs/                 # Project documentation and blueprints
├── public/               # Static assets (images, icons, etc.)
├── src/
│   ├── ai/              # AI flows and Genkit configurations
│   ├── app/             # Next.js App Router pages and layouts
│   ├── components/      # Reusable React components
│   │   ├── ui/          # ShadCN UI base components
│   │   └── */           # Feature-specific components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and configurations
│   └── types/           # TypeScript type definitions
├── components.json      # ShadCN UI configuration
├── next.config.ts       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🌿 Branching Strategy

### Branch Naming Convention

Use descriptive branch names with the following prefixes:

- `feature/` - New features (e.g., `feature/ai-task-breakdown`)
- `fix/` - Bug fixes (e.g., `fix/calendar-sync-error`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `chore/` - Maintenance tasks (e.g., `chore/update-dependencies`)
- `refactor/` - Code refactoring (e.g., `refactor/component-structure`)
- `test/` - Adding or updating tests (e.g., `test/add-unit-tests`)
- `perf/` - Performance improvements (e.g., `perf/optimize-ai-calls`)

### Keeping Branches Updated

Always keep your branch up to date with the main branch:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git checkout your-feature-branch
git rebase main
```

## 🐛 Issue Reporting

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check the README** and documentation for solutions
3. **Verify the issue** exists in the latest version

### What to Include in Bug Reports

When reporting bugs, please include:

- **Clear description** of the issue
- **Steps to reproduce** the behavior
- **Expected vs. actual behavior**
- **Environment details**:
  - Operating System (Windows/macOS/Linux)
  - Browser and version
  - Node.js version
  - Any relevant console errors or logs
- **Screenshots or screen recordings** if applicable

Use our [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md) for consistency.

### Labels

<!-- TODO: Define label scheme - maintainers should update this section -->
Common labels include: `bug`, `enhancement`, `documentation`, `good first issue`, `help wanted`, `priority-high`, `priority-medium`, `priority-low`

## 💡 Feature Requests

We welcome feature requests! However, for significant changes:

1. **Open an issue first** to discuss the proposed feature
2. **Explain the problem** the feature would solve
3. **Describe your proposed solution**
4. **Consider the project scope** - ensure it aligns with DeyWeaver's AI-powered productivity focus

Use our [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).

## 🛠️ Development Workflow

### Step-by-Step Process

1. **Create a new branch** from the main branch:
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Write or update tests** for your changes (when applicable)

4. **Update documentation** if your changes affect user-facing functionality

5. **Test your changes**:
   ```bash
   npm run typecheck  # Check TypeScript compilation
   npm run dev       # Test in development mode
   ```

6. **Commit your changes** following our commit message guidelines

7. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Open a Pull Request** against the main branch

## 🎨 Code Style & Quality

### Tech Stack Standards

DeyWeaver uses:
- **Frontend**: Next.js (App Router), React 18, TypeScript
- **UI Components**: ShadCN UI
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini models via Genkit
- **State Management**: React Hook Form, TanStack Query
- **Charts**: Recharts

### Formatting & Linting

Currently, the project uses Next.js built-in linting. When contributing:

1. **Follow TypeScript best practices**
2. **Use proper type definitions** - avoid `any` types
3. **Follow existing component patterns** in the codebase
4. **Ensure TypeScript compilation passes**:
   ```bash
   npm run typecheck
   ```

### Code Quality Guidelines

- **Component Structure**: Use functional components with hooks
- **File Organization**: Follow the existing folder structure
- **Naming Conventions**: 
  - Use PascalCase for components
  - Use camelCase for functions and variables
  - Use kebab-case for file names
- **Import Organization**: Group imports (React, libraries, local components)
- **Props and Types**: Define proper TypeScript interfaces for props
- **Error Handling**: Implement proper error boundaries and try-catch blocks

### Documentation Style

- **Comments**: Use JSDoc for complex functions
- **README updates**: Update relevant documentation for new features
- **Code clarity**: Write self-documenting code with descriptive variable names

## 📝 Commit Message Guidelines

We follow the **Conventional Commits** specification for clear and searchable commit history.

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks (dependencies, build tools, etc.)
- `perf:` - Performance improvements
- `build:` - Build system changes
- `ci:` - CI/CD configuration changes

### Examples

```bash
feat(ai): add intelligent task breakdown feature
fix(calendar): resolve Google Calendar sync issue
docs(readme): update installation instructions
refactor(components): reorganize UI component structure
chore(deps): update Next.js to version 15.5.3
```

### Best Practices

- Use **imperative mood** ("add" not "added" or "adds")
- Keep subject line under **50 characters**
- Capitalize the subject line
- Don't end subject line with a period
- Use body to explain **what** and **why**, not **how**

## 🤖 AI Tooling Guidelines

DeyWeaver embraces AI assistance in development while maintaining human oversight and code quality.

### Acceptable AI Tool Usage

**✅ Encouraged AI assistance:**
- **Code generation** for boilerplate and repetitive code
- **Documentation writing** and improvement
- **Bug investigation** and debugging assistance
- **Code explanation** and learning
- **Test case generation** and edge case identification
- **Refactoring suggestions** and optimization ideas

**🤝 With Human Review:**
- All AI-generated code must be **thoroughly reviewed** by the contributor
- **Test AI-generated code** to ensure it works as expected
- **Understand the code** before committing - don't blindly copy-paste
- **Adapt AI suggestions** to match project conventions and standards

### AI Tools Integration

**GitHub Copilot:**
- Use for code completion and suggestions
- Review all suggestions before accepting
- Ensure generated code follows project patterns

**ChatGPT/Claude/Other LLMs:**
- Great for explaining complex concepts
- Use for generating test cases and documentation
- Always validate technical accuracy

### Human Oversight Requirements

- **Code Review**: All AI-assisted code must be reviewed by a human
- **Testing**: Thoroughly test AI-generated functionality
- **Documentation**: Ensure AI-generated docs are accurate and clear
- **Security**: Never commit sensitive data or credentials, even if suggested by AI
- **Quality**: Maintain the same quality standards regardless of how code was generated

## 🔄 Pull Request Process

### Pull Request Checklist

Before submitting your PR, ensure:

- [ ] Code follows project conventions and style guidelines
- [ ] TypeScript compilation passes (`npm run typecheck`)
- [ ] All new functionality is tested manually
- [ ] Documentation is updated if needed
- [ ] Commit messages follow conventional commits format
- [ ] PR title clearly describes the changes
- [ ] PR description explains the motivation and approach

### PR Template

When creating a pull request, include:

```markdown
## Description
Brief description of changes and motivation

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] All TypeScript checks pass
- [ ] Tested on different browsers/devices (if applicable)

## Screenshots (if applicable)
Add screenshots for UI changes

## AI Assistance
- [ ] I have reviewed all AI-generated code
- [ ] AI-generated code has been tested and validated
- [ ] AI suggestions have been adapted to project standards
```

### Review Process

1. **Automated checks** will run on your PR
2. **Maintainer review** for code quality and project alignment
3. **Feedback incorporation** - address any requested changes
4. **Final approval** and merge by maintainers

## 🏷️ Release Process

Releases are handled by maintainers. Contributors should:
- Focus on individual features and fixes
- Follow semantic versioning principles in impact assessment
- Document breaking changes clearly

## 🤝 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and community chat
- **Email**: Reach out to [aryanbrite@gmail.com](mailto:aryanbrite@gmail.com) for sensitive matters

## 🙏 Recognition

All contributors will be recognized in our releases and documentation. Thank you for helping make DeyWeaver better!

---

*Happy coding! 🚀*