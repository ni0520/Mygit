# GitHub Copilot Instructions

This document provides guidance to GitHub Copilot for generating code suggestions specific to this repository.

## Project Overview

This is a Node.js web application built with Express that displays haikus with images. It's designed as a demo project for GitHub Codespaces, showcasing a simple but well-structured web application.

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Template Engine**: EJS
- **Testing**: Node.js built-in test runner with Supertest
- **Linting**: ESLint (flat config)
- **Code Formatting**: Prettier
- **Dev Tools**: Nodemon for development

## Code Style and Conventions

### JavaScript
- Use CommonJS modules (`require`/`module.exports`)
- ECMAScript version: latest
- Use `const` by default, `let` when reassignment is needed
- Prefer modern JavaScript features (destructuring, template literals, arrow functions)
- Use double quotes for strings
- Semicolons are required

### ESLint Rules
- Unused variables are errors (except those prefixed with `_`)
- Report unused disable directives
- All linting errors must be resolved before committing

### EJS Templates
- Use escaped output (`<%= ... %>`) by default to prevent XSS vulnerabilities
- Use modern JavaScript patterns in templates (e.g., `for...of` with destructuring)
- Prefer idiomatic iteration methods like `.entries()` over C-style for loops

## Project Structure

```
.
├── index.js              # Main Express application
├── haikus.json           # Static data for haikus
├── views/                # EJS templates
│   └── index.ejs        # Main page template
├── public/              # Static assets (CSS, images)
├── test/                # Test files
│   └── app.test.js      # Application tests
└── .github/             # GitHub configuration
    └── workflows/       # CI/CD workflows
```

## Coding Guidelines

### Performance Best Practices
- Use static file caching for assets (`express.static` with `maxAge` option)
- Avoid repeated property lookups in loops - use destructuring
- Prefer `.entries()`, `.forEach()`, or `for...of` over C-style loops

### Security Best Practices
- Always use escaped output in templates (`<%= ... %>`) to prevent XSS
- Validate and sanitize any user input before processing
- Use secure Express middleware configurations
- Include proper error handling middleware

### Error Handling
- Implement centralized error handling middleware
- Log errors to console with descriptive messages
- Check if headers are already sent before sending error responses
- Return JSON error responses with appropriate status codes

### Testing
- Use Node.js built-in test runner
- Import test utilities from `node:test` and `node:assert/strict`
- Use Supertest for HTTP endpoint testing
- Test both success and error cases
- Verify response status codes, headers, and body content

### API Endpoints
- Use RESTful conventions
- Include health check endpoint (`/healthz`) that returns `{ "status": "ok" }`
- Return appropriate HTTP status codes
- Use JSON for API responses

## Development Workflow

### Available Scripts
- `npm start` - Run production server
- `npm run dev` - Run development server with Nodemon
- `npm test` - Run tests
- `npm run lint` - Check code with ESLint
- `npm run format` - Check formatting with Prettier

### Before Committing
1. Ensure all tests pass (`npm test`)
2. Fix any linting errors (`npm run lint`)
3. Verify formatting (`npm run format`)
4. Test the application locally

## Common Patterns

### Express Route Definition
```js
app.get("/path", (req, res) => {
  // Handle request
  res.render("view", { data });
});
```

### Error Middleware
```js
app.use((err, req, res, next) => {
  console.error("Error message:", err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    error: "error_type",
  });
});
```

### Testing Pattern
```js
test("description", async () => {
  const response = await request(app).get("/endpoint");

  assert.equal(response.status, 200);
  assert.equal(response.body.property, expectedValue);
});
```

## What to Avoid

- Don't use `var` - always use `const` or `let`
- Don't use unescaped output in templates unless absolutely necessary
- Don't use synchronous file operations in request handlers
- Don't commit node_modules or build artifacts
- Don't use C-style loops when more idiomatic patterns exist
- Don't skip error handling or validation

## Additional Notes

- This is a demo/learning project - keep code simple and readable
- Prioritize security even in demo code (teaches good habits)
- Follow existing patterns and conventions in the codebase
- When in doubt, prefer standard Express.js and Node.js patterns
