# Contributing to DeyWeaver

Thank you for your interest in contributing to **DeyWeaver**! We're excited to have you as part of our community. This guide will help you understand how to contribute effectively to this AI-powered task management and scheduling application.

DeyWeaver is an innovative project that combines intelligent scheduling with modern web technologies, and we welcome contributions that help make this tool even better for users around the world.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Branching Strategy](#branching-strategy)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)
- [Development Workflow](#development-workflow)
- [Code Style & Quality](#code-style--quality)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Testing](#testing)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Security & Secrets](#security--secrets)
- [Use of AI Tools & GitHub Copilot](#use-of-ai-tools--github-copilot)
- [Documentation](#documentation)
- [Release Process](#release-process)
- [Communication Channels](#communication-channels)
- [Attribution & Credits](#attribution--credits)
- [Acknowledgment](#acknowledgment)

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for everyone. While we don't have a formal Code of Conduct document yet, we expect all contributors to:

- Be respectful and inclusive in all interactions
- Use welcoming and professional language
- Be collaborative and supportive of others
- Focus on what is best for the community and project
- Show empathy towards other community members

We encourage respectful behavior and constructive feedback in all project interactions.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or newer recommended)
- **npm** or **yarn** package manager
- **Git** for version control
- A **Google AI API Key** (for AI features)

### Installation

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/DeyWeaver.git
   cd DeyWeaver
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
   ```
   *You can obtain a Google API key from [Google AI Studio](https://aistudio.google.com/app/apikey)*

5. **Start the development server**:
   ```bash
   npm run dev
   ```
   This will start the Next.js app (usually on `http://localhost:9002`) and the Genkit development server.

6. **Verify the setup** by visiting the local development URL

## Project Structure

<!-- TODO: Expand this section with detailed folder structure -->
The project follows a standard Next.js application structure:

```
DeyWeaver/
├── .github/           # GitHub templates and workflows
├── docs/             # Project documentation
├── public/           # Static assets
├── src/              # Source code
│   ├── ai/           # AI/Genkit integration
│   ├── components/   # React components
│   ├── lib/          # Utility functions and configurations
│   └── app/          # Next.js app router pages
├── package.json      # Project dependencies and scripts
└── README.md         # Project overview
```

*TODO: Add more detailed structure documentation as the project evolves*

## Branching Strategy

We use a structured branching approach to keep the codebase organized:

- **`main`** - Production-ready code
- **`feature/feature-name`** - New features (e.g., `feature/ai-schedule-optimization`)
- **`fix/issue-description`** - Bug fixes (e.g., `fix/calendar-sync-error`)
- **`docs/topic`** - Documentation updates (e.g., `docs/contributing-guide`)
- **`chore/task-description`** - Maintenance tasks (e.g., `chore/update-dependencies`)

### Branch Naming Guidelines

- Use lowercase letters and hyphens
- Be descriptive but concise
- Include the issue number when applicable: `feature/123-task-reallocation`

## Issue Reporting

When reporting bugs, please include:

### Bug Reports
- **Clear title** describing the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs **actual behavior**
- **Environment information**:
  - Operating system
  - Browser version
  - Node.js version
  - DeyWeaver version/commit
- **Screenshots or recordings** when applicable
- **Console errors** (if any)
- **Additional context** that might be relevant

Use the bug report template in `.github/ISSUE_TEMPLATE/bug_report.md` when available.

## Feature Requests

Before proposing new features:

1. **Search existing issues** to avoid duplicates
2. **Start a discussion** for significant changes
3. **Consider the project scope** and alignment with DeyWeaver's goals
4. **Provide detailed use cases** and user benefits

Use the feature request template in `.github/ISSUE_TEMPLATE/feature_request.md` when available.

## Development Workflow

1. **Fork and clone** the repository
2. **Create a feature branch** from `main`
3. **Make your changes** following our coding standards
4. **Write or update tests** for your changes
5. **Run linting and formatting** tools
6. **Test your changes** thoroughly
7. **Commit your changes** following our commit guidelines
8. **Push to your fork** and create a pull request
9. **Respond to feedback** during code review

### Local Development Commands

```bash
# Start development server
npm run dev

# Run linting (setup in progress)
npm run lint

# Type checking
npm run typecheck

# Build for production
npm run build

# Start Genkit development server
npm run genkit:dev
```

## Code Style & Quality

<!-- TODO: Add specific linting and formatting configurations once established -->

We maintain code quality through:

- **TypeScript** for type safety
- **ESLint** for code linting (configuration in progress)
- **Prettier** for code formatting (TODO: configure)
- **Consistent naming conventions**
- **Component organization** following React best practices

*TODO: Document specific linting rules and formatting standards*

## Commit Message Guidelines

We follow **Conventional Commits** specification for clear and consistent commit history:

### Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```bash
feat(ai): add dynamic task reallocation feature

fix(calendar): resolve sync issues with Google Calendar

docs(contributing): add AI tools usage policy

style(components): format task card components

chore(deps): update dependencies to latest versions
```

## Testing

<!-- TODO: Document testing strategy and commands once test framework is established -->

*TODO: Add testing guidelines when test infrastructure is implemented*

Currently, manual testing is performed:
1. Test core functionality after changes
2. Verify AI features work with valid API keys
3. Check responsive design across devices
4. Validate accessibility features

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows project conventions
- [ ] Changes have been tested locally
- [ ] Documentation is updated if needed
- [ ] Commit messages follow Conventional Commits
- [ ] **AI assistance disclosed** (if applicable - see AI Tools section)

### PR Description Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Testing
- [ ] Tested locally
- [ ] All existing functionality works
- [ ] New functionality works as expected

## AI Assistance Disclosure
- [ ] No AI tools were used for this contribution
- [ ] AI tools were used with human review and understanding
- [ ] Large sections generated by AI have been disclosed below

If AI tools were used, please describe:
- Which tools (GitHub Copilot, etc.)
- What parts of the code were AI-assisted
- How you verified the AI-generated content

## Related Issues
Closes #[issue number]
```

### Review Process

1. **Automated checks** will run on your PR
2. **Code review** by maintainers
3. **Testing** of the changes
4. **Approval** and merge by maintainers

## Security & Secrets

### Important Security Guidelines

- **Never commit secrets** (API keys, passwords, tokens) to the repository
- Use **environment variables** for sensitive configuration
- **Report security vulnerabilities** privately to aryanbrite@gmail.com
- Follow **responsible disclosure** practices

### Sensitive Data

- API keys should be in `.env.local` (not committed)
- User data should be handled with appropriate privacy measures
- Follow the security guidelines outlined in `security.md`

## Use of AI Tools & GitHub Copilot

**We explicitly allow and encourage the use of AI tools, including GitHub Copilot, under the following conditions:**

- **Human supervision and review**: All AI-generated code must be thoroughly reviewed, understood, and validated by the contributor
- **Understanding requirement**: Contributors must fully understand any AI-generated code before submitting
- **Disclosure for large sections**: If AI tools generate substantial portions of code (>50 lines or significant logic), this must be disclosed in the pull request
- **License compliance**: Ensure AI-generated content complies with the project's MIT license and doesn't violate any licensing terms
- **Security and performance validation**: AI-generated code must be verified for security vulnerabilities and performance implications
- **No sensitive data in prompts**: Never include API keys, passwords, or sensitive information in AI tool prompts
- **Quality standards**: AI-assisted code must meet the same quality standards as manually written code

### AI Assistance Disclosure

When using AI tools, please include this information in your PR:

```markdown
## AI Assistance Used
- **Tools**: GitHub Copilot / ChatGPT / Other (specify)
- **Scope**: Describe which parts were AI-assisted
- **Review**: Confirm you reviewed and understand all AI-generated code
- **Testing**: Describe how you validated the AI-generated functionality
```

This policy encourages innovation while maintaining code quality and transparency.

## Documentation

### When to Update Documentation

- **API changes**: Update inline documentation and README
- **New features**: Add usage examples and feature descriptions
- **Behavior changes**: Update relevant documentation
- **Configuration changes**: Update setup and deployment guides

### Documentation Standards

- Use clear, concise language
- Include code examples where helpful
- Keep README.md up to date with major changes
- Update inline code comments for complex logic

## Release Process

<!-- TODO: Define release process once project reaches stable version -->

*TODO: Document release versioning and deployment process*

Currently managed by project maintainers. Release planning will be documented as the project matures.

## Communication Channels

### Primary Channels

- **GitHub Issues**: Bug reports, feature requests, and discussions
- **Pull Requests**: Code review and contribution discussions

### Future Channels

*TODO: Add Discord/Slack community links when established*
*TODO: Add discussion forums when available*

## Attribution & Credits

### Project Leadership

- **Aryan Singh ([@aryan6673](https://github.com/aryan6673))**: Project creator and maintainer
- All contributors are recognized in the project's commit history

### Acknowledgments

We thank:
- The open-source community for tools and libraries
- Google for AI/Gemini support and cloud credits
- All contributors who help improve DeyWeaver

### Contributor Recognition

Contributors will be acknowledged in:
- Git commit history
- Release notes for significant contributions
- Future contributor documentation

## Acknowledgment

By contributing to DeyWeaver, you agree to:

1. **Follow these guidelines** and maintain project standards
2. **License your contributions** under the MIT License
3. **Disclose AI assistance** when applicable as outlined in our AI tools policy
4. **Respect the community** and maintain professional conduct
5. **Understand that contributions** may be modified or rejected at maintainer discretion

---

Thank you for contributing to DeyWeaver! Your efforts help create a better tool for task management and scheduling. If you have questions about these guidelines, please open an issue for discussion.

**Happy coding! 🚀**