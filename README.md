# 給 Mona 的俳句 / Haikus for Codespaces

## 繁體中文說明

### 這是什麼軟體？

這是一個 **Node.js 網頁應用程式**，專門用來展示俳句（日本傳統短詩）和相關圖片。

### 主要功能

- 🌐 **網頁伺服器**：使用 Express.js 框架建立的網頁應用程式
- 📝 **俳句展示**：顯示五首繁體中文翻譯的俳句，配有精美的插圖
- ⚡ **性能優化**：包含快取機制、圖片延遲載入、壓縮等優化功能
- 🔒 **安全防護**：使用 Helmet 中介軟體提供安全標頭保護
- 🏥 **健康檢查**：提供 `/healthz` 端點用於監控服務狀態

### 技術架構

- **後端框架**：Node.js + Express.js
- **模板引擎**：EJS (Embedded JavaScript)
- **安全中介軟體**：Helmet
- **效能中介軟體**：Compression
- **測試框架**：Node.js 內建測試工具 + Supertest

### 檔案類型

這個儲存庫包含：

- ✅ JavaScript 原始碼檔案（`.js`）
- ✅ JSON 資料檔案（`haikus.json` - 俳句內容）
- ✅ EJS 模板檔案（`.ejs` - 網頁模板）
- ✅ 設定檔（`package.json`、`eslint.config.js` 等）
- ✅ 靜態資源（CSS、圖片等）

---

## English Description

This is a quick node project template for demoing Codespaces. It is based on the [Azure node sample](https://github.com/Azure-Samples/nodejs-docs-hello-world).

Point your browser to [Quickstart for GitHub Codespaces](https://docs.github.com/en/codespaces/getting-started/quickstart) for a tour of using Codespaces with this repo.

---

## 本地開發 / Local development

### 安裝與執行

```bash
npm install
npm run dev
```

開啟瀏覽器訪問 <http://localhost:3000>

### 可用的指令 / Available scripts

- `npm start`：啟動生產環境伺服器 / Start the production server
- `npm run dev`：使用 nodemon 啟動開發環境 / Start with `nodemon`
- `npm test`：執行 API 測試 / Run API tests
- `npm run lint`：執行 ESLint 程式碼檢查 / Run ESLint checks
- `npm run format`：執行 Prettier 格式檢查 / Run Prettier formatting checks

### 健康檢查 / Health check

應用程式提供 `GET /healthz` 端點，回應：

The app exposes `GET /healthz` and returns:

```json
{ "status": "ok" }
```

## 安全注意事項 / Security notes

### 繁體中文

- 模板中的俳句文字使用跳脫輸出（`<%= ... %>`）來降低 XSS 風險
- 如果資料來源從靜態 JSON 改為使用者輸入，請在渲染前執行伺服器端的資料清理與驗證

### English

- Haiku text in templates is rendered using escaped output (`<%= ... %>`) to reduce XSS risk.
- If data sources change from static JSON to user-provided input, perform server-side sanitization/validation before rendering.

## AI 助理文件 / AI Assistant Documentation

This repository includes comprehensive documentation for AI coding assistants:

- **[AI Assistant Guide](.github/AI-ASSISTANT-GUIDE.md)** - Complete guide for AI assistants (Claude Code, GitHub Copilot Workspace, etc.) to execute tasks accurately and completely. Includes code patterns, security requirements, testing guidelines, and task execution checklists.
- **[GitHub Copilot Instructions](.github/copilot-instructions.md)** - Repository-specific context for GitHub Copilot code suggestions.

These guides ensure AI assistants follow the project's conventions and best practices when assisting with development tasks.
