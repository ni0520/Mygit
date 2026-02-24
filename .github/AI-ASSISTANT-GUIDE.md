# AI Assistant Guide for Mygit Repository

This document provides comprehensive guidance for AI coding assistants (Claude Code, GitHub Copilot Workspace, etc.) working with this repository. Following these instructions ensures tasks are executed completely, accurately, and consistently.

## 🎯 Core Principles

When working on this repository, AI assistants must:

1. **Complete Tasks Fully**: Never leave work partially done. Ensure all aspects of a task are completed before finishing.
2. **Follow Existing Patterns**: Study the codebase patterns before making changes. Consistency is key.
3. **Test Before Committing**: Always run tests and linting before considering a task complete.
4. **Maintain Security**: This is a demo project, but security best practices must always be followed.
5. **Keep It Simple**: Avoid over-engineering. Match the simplicity and clarity of existing code.

## 📋 Repository Overview

**Type**: Node.js web application (Express + EJS)
**Purpose**: Demo project showcasing haiku display with images, designed for GitHub Codespaces
**Main Branch**: main
**Development Branch**: develop

### Key Files

- `index.js` - Main Express application (37 lines)
- `haikus.json` - Static haiku data (5 haikus)
- `views/index.ejs` - Main template (27 lines)
- `test/app.test.js` - Test suite (21 lines)
- `package.json` - Dependencies and scripts

## 🛠️ Technology Stack

| Component       | Technology                      | Version               |
| --------------- | ------------------------------- | --------------------- |
| Runtime         | Node.js                         | Latest LTS            |
| Framework       | Express.js                      | ^4.22.1               |
| Template Engine | EJS                             | ^3.1.10               |
| Testing         | Node.js test runner + Supertest | Built-in + ^7.0.0     |
| Linting         | ESLint                          | ^9.20.1 (flat config) |
| Formatting      | Prettier                        | ^3.5.2                |
| Dev Server      | Nodemon                         | ^2.0.19               |

## 🚀 Essential Commands

### Before Starting Any Task

```bash
# Verify current state
npm test
npm run lint
npm run format
```

### Development Workflow

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Check linting
npm run lint

# Check formatting
npm run format

# Start production server
npm start
```

### Testing the Application

```bash
# Start the dev server (runs on port 3000)
npm run dev

# In another terminal, test endpoints
curl http://localhost:3000/
curl http://localhost:3000/healthz
```

## 📐 Code Style Requirements

### JavaScript Style

- **Module System**: CommonJS (`require`/`module.exports`)
- **Variable Declaration**: `const` by default, `let` only when reassignment needed
- **String Quotes**: Double quotes (`"`)
- **Semicolons**: Required
- **Modern Features**: Use destructuring, template literals, arrow functions
- **Iteration**: Prefer `for...of`, `.entries()`, `.forEach()` over C-style loops

### Example Patterns

**✅ Good - Modern Destructuring**

```javascript
for (const [i, { image, text }] of haikus.entries()) {
  // Single destructure, no repeated lookups
  console.log(i, image, text);
}
```

**❌ Bad - C-style with Repeated Lookups**

```javascript
for (let i = 0; i < haikus.length; i++) {
  const image = haikus[i].image; // Repeated array access
  const text = haikus[i].text;
}
```

**✅ Good - Express Route**

```javascript
app.get("/endpoint", (req, res) => {
  res.status(200).json({ data: value });
});
```

**✅ Good - Error Middleware**

```javascript
app.use((err, req, res, next) => {
  console.error("Error description:", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    error: "error_type",
  });
});
```

**✅ Good - Test Pattern**

```javascript
test("description of what is being tested", async () => {
  const response = await request(app).get("/endpoint");

  assert.equal(response.status, 200);
  assert.equal(response.body.property, expectedValue);
});
```

## 🔒 Security Requirements

### Critical Security Rules

1. **XSS Prevention**: Always use escaped output in EJS templates (`<%= ... %>`)
2. **Input Validation**: Validate and sanitize all user input before processing
3. **Error Handling**: Never expose internal errors to clients
4. **Headers**: Check `res.headersSent` before sending responses in error handlers
5. **Dependencies**: Keep dependencies up to date (security patches)

### Current Security Posture

- ✅ Templates use escaped output (`<%= ... %>`)
- ✅ Centralized error handling middleware
- ✅ No user input currently (static JSON data)
- ⚠️ If adding user input features, implement validation first

## ⚡ Performance Guidelines

1. **Static Assets**: Use `express.static` with `maxAge` for caching

   ```javascript
   app.use(express.static("public", { maxAge: "1d" }));
   ```

2. **Efficient Loops**: Use `.entries()` or `for...of` with destructuring
3. **Avoid Repeated Lookups**: Destructure once, use many times
4. **No Sync Operations**: Never use synchronous file operations in request handlers

## 🧪 Testing Requirements

### Test Framework

- **Runner**: Node.js built-in test runner (`node:test`)
- **Assertions**: `node:assert/strict`
- **HTTP Testing**: Supertest

### Writing Tests

```javascript
const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../index");

test("description", async () => {
  const response = await request(app).get("/path");

  assert.equal(response.status, 200);
  assert.match(response.text, /expected pattern/);
});
```

### Test Coverage Requirements

- ✅ Test successful requests (200 responses)
- ✅ Test error cases (4xx, 5xx responses)
- ✅ Verify response structure (status, headers, body)
- ✅ Test health check endpoint
- ✅ All new endpoints must have tests

## 📁 Project Structure

```
.
├── .github/
│   ├── workflows/          # CI/CD workflows
│   ├── copilot-instructions.md  # GitHub Copilot guidance
│   └── AI-ASSISTANT-GUIDE.md    # This file
├── public/
│   ├── css/               # Stylesheets
│   └── images/            # Static images
├── test/
│   └── app.test.js        # Test suite
├── views/
│   └── index.ejs          # Main template
├── index.js               # Express application
├── haikus.json            # Data file
├── package.json           # Dependencies and scripts
├── eslint.config.js       # ESLint configuration
└── process.json           # Process manager config
```

## 🔄 Task Execution Checklist

When assigned a task, follow this workflow:

### 1. Understanding Phase

- [ ] Read the task requirements completely
- [ ] Identify which files need to be modified
- [ ] Review existing patterns in those files
- [ ] Check for existing tests related to the change

### 2. Planning Phase

- [ ] Determine the minimal change needed
- [ ] Identify potential security implications
- [ ] Plan test coverage for the change
- [ ] Consider backward compatibility

### 3. Implementation Phase

- [ ] Make changes following existing patterns
- [ ] Keep changes minimal and focused
- [ ] Add or update tests for new functionality
- [ ] Update documentation if needed

### 4. Verification Phase

- [ ] Run `npm test` - all tests must pass
- [ ] Run `npm run lint` - no errors allowed
- [ ] Run `npm run format` - check formatting
- [ ] Manually test the application if UI changes
- [ ] Review changes for security issues

### 5. Completion Phase

- [ ] Ensure all files are properly saved
- [ ] Verify no unintended changes were made
- [ ] Check that all task requirements are met
- [ ] Prepare clear commit message

## 🚫 What NOT to Do

1. **Don't Use**:
   - `var` keyword (use `const` or `let`)
   - Synchronous file operations in handlers
   - Unescaped output in templates (unless absolutely necessary)
   - C-style loops when better patterns exist
   - `console.log` for debugging (remove before committing)

2. **Don't Skip**:
   - Running tests before completing task
   - Linting checks
   - Security considerations
   - Error handling

3. **Don't Commit**:
   - `node_modules/` directory
   - Build artifacts
   - Temporary files
   - Debug logs
   - Secrets or credentials

4. **Don't Over-Engineer**:
   - This is a demo project - keep it simple
   - Don't add unnecessary dependencies
   - Don't create abstractions for single use cases
   - Match the existing code complexity level

## 🔧 Common Tasks and Patterns

### Adding a New Route

```javascript
// In index.js, before error middleware
app.get("/new-route", (req, res) => {
  // Validate input if needed
  // Process request
  res.status(200).json({ result: data });
});

// Add corresponding test in test/app.test.js
test("GET /new-route returns expected data", async () => {
  const response = await request(app).get("/new-route");
  assert.equal(response.status, 200);
  assert.equal(response.body.result, expectedData);
});
```

### Adding a New Template

```javascript
// Create views/new-template.ejs
<!DOCTYPE html>
<html>
  <head>
    <title>Page Title</title>
    <link href="/css/main.css" rel="stylesheet" type="text/css">
  </head>
  <body>
    <h1><%= title %></h1>
    <!-- Use <%= for escaped output -->
  </body>
</html>

// Add route in index.js
app.get("/new-page", (req, res) => {
  res.render("new-template", { title: "Page Title" });
});
```

### Adding Static Assets

```bash
# CSS files go in public/css/
# Images go in public/images/
# Files are automatically served by express.static
```

### Modifying Data Structure

```javascript
// Update haikus.json with proper JSON formatting
// Ensure all required fields are present
// Test that template still works with new structure
```

## 📚 Reference Materials

### ESLint Configuration (eslint.config.js)

- Flat config format (modern)
- ECMAScript version: latest
- CommonJS modules
- Unused variables are errors (except `_` prefix)

### Express Middleware Order

1. `express.static` - Static file serving
2. `app.set` - View engine configuration
3. Route handlers (`app.get`, `app.post`, etc.)
4. Error middleware (4 parameters: `err, req, res, next`)

### EJS Template Syntax

- `<% ... %>` - Control flow (no output)
- `<%= ... %>` - Escaped output (safe, prevents XSS)
- `<%- ... %>` - Unescaped output (dangerous, avoid)
- `<%# ... %>` - Comments

## 🎓 Learning from This Codebase

This repository demonstrates:

- ✅ Clean, minimal Express.js setup
- ✅ Modern JavaScript patterns
- ✅ Proper security practices (XSS prevention)
- ✅ Comprehensive testing approach
- ✅ Static asset optimization
- ✅ Health check endpoint pattern
- ✅ Centralized error handling
- ✅ Separation of concerns (routes, views, data)

## 🤖 AI Assistant Behavior Guidelines

### Task Completion Standards

1. **Thoroughness**: Complete every aspect of the task before finishing
2. **Accuracy**: Double-check all code changes against requirements
3. **Testing**: Always verify changes work before reporting completion
4. **Documentation**: Update relevant documentation when needed
5. **Communication**: Explain what was changed and why

### When Uncertain

- Review existing code patterns for similar functionality
- Check test files for examples of expected behavior
- Refer to package.json for available scripts and dependencies
- Read error messages carefully before attempting fixes

### Quality Indicators

A task is complete when:

- ✅ All tests pass (`npm test`)
- ✅ No linting errors (`npm run lint`)
- ✅ Formatting is correct (`npm run format`)
- ✅ Application runs without errors
- ✅ All requirements from the task are met
- ✅ No regressions in existing functionality
- ✅ Security best practices are maintained

## 🔄 Continuous Improvement

This guide should be updated when:

- New patterns are established in the codebase
- Dependencies are significantly changed
- New tools are added to the workflow
- Common issues or questions arise repeatedly
- Best practices evolve

## 📞 Getting Help

If you encounter issues:

1. Check this guide first
2. Review existing code patterns
3. Read error messages completely
4. Check test files for examples
5. Verify dependencies are installed (`npm install`)
6. Ensure Node.js version is compatible

## 🎯 Success Metrics

An AI assistant is performing well when:

- Tasks are completed in one attempt without revisions
- Code follows all patterns and conventions
- Tests pass on first run
- No security vulnerabilities are introduced
- Changes are minimal and focused
- Documentation stays current
- No regressions occur

---

**Version**: 1.0
**Last Updated**: 2026-02-24
**Maintained By**: Repository contributors and AI assistants
**Purpose**: Ensure AI assistants execute tasks completely, accurately, and consistently
