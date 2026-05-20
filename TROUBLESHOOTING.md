# 故障排查指南 / TROUBLESHOOTING.md

**最後更新**：2026-05-20

---

## 🆘 常見問題與解決方案

### 📋 目錄
1. [安裝和設置](#安裝和設置)
2. [運行應用程式](#運行應用程式)
3. [測試和 Lint](#測試和-lint)
4. [性能問題](#性能問題)
5. [安全問題](#安全問題)
6. [工作流問題](#工作流問題)

---

## 安裝和設置

### ❌ 問題：npm 安裝失敗

**症狀**：
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**解決方案**：

```bash
# 1. 清空 npm 緩存
npm cache clean --force

# 2. 刪除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 3. 重新安裝
npm install

# 或使用強制重新安裝
npm install --legacy-peer-deps
```

### ❌ 問題：Node.js 版本不兼容

**症狀**：
```
The engine "node" is incompatible with this module
```

**解決方案**：

```bash
# 檢查當前版本
node --version

# 使用 nvm 安裝正確版本
nvm install 20
nvm use 20

# 驗證
node --version  # 應該顯示 v20.x.x
```

### ❌ 問題：缺少環境變數

**症狀**：
```
Error: PORT must be defined in .env file
```

**解決方案**：

```bash
# 創建 .env 文件
cat > .env << EOF
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
EOF

# 或手動設置
export PORT=3000
npm run dev
```

---

## 運行應用程式

### ❌ 問題：端口已被占用

**症狀**：
```
Error: listen EADDRINUSE :::3000
Port 3000 is already in use
```

**解決方案**：

```bash
# 方案 1：使用不同端口
PORT=3001 npm run dev

# 方案 2：查找佔用端口的進程
# macOS/Linux
lsof -i :3000

# Windows
netstat -ano | findstr :3000

# 方案 3：結束占用的進程
# macOS/Linux
kill -9 <PID>

# Windows
taskkill /PID <PID> /F

# 方案 4：配置文件設置
# 編輯 index.js，改變默認端口
const port = process.env.PORT || 8080;
```

### ❌ 問題：應用程式無法啟動

**症狀**：
```
Cannot find module './haikus.json'
```

**解決方案**：

```bash
# 檢查文件是否存在
ls -la haikus.json

# 檢查 index.js 中的路徑
cat index.js | grep require

# 修復路徑（如必要）
# 在 index.js 中確保正確的相對路徑
const haikus = require('./haikus.json');
```

### ❌ 問題：頁面無法渲染

**症狀**：
```
Error: Cannot find module './views/index.ejs'
```

**解決方案**：

```bash
# 檢查 views 目錄
ls -la views/

# 檢查文件名是否正確
ls -la views/index.ejs

# 驗證 index.js 中的視圖引擎設置
grep -A2 "view engine" index.js
```

---

## 測試和 Lint

### ❌ 問題：測試失敗

**症狀**：
```
Error: Test failed
AssertionError: expected 'ok' to equal 'undefined'
```

**解決方案**：

```bash
# 1. 查看詳細錯誤信息
npm test -- --verbose

# 2. 運行特定測試
npm test -- tests/app.test.js

# 3. 檢查測試文件
cat tests/app.test.js

# 4. 驗證應用程式運行
npm run dev
# 在另一個終端測試
curl http://localhost:3000/healthz
```

### ❌ 問題：ESLint 檢查失敗

**症狀**：
```
✖ 10 problems (5 errors, 5 warnings)
```

**解決方案**：

```bash
# 1. 查看詳細錯誤
npm run lint

# 2. 自動修復所有可修復的問題
npm run format:fix

# 3. 檢查 ESLint 配置
cat eslint.config.js

# 4. 手動修復需要人工處理的問題
# 查看具體行號和問題描述
```

**常見 ESLint 錯誤**：

| 錯誤 | 原因 | 修復 |
|------|------|------|
| `no-unused-vars` | 定義了但未使用的變數 | 刪除或使用變數 |
| `no-console` | 使用 console.log | 刪除或配置例外 |
| `semi` | 缺少分號 | 運行 `format:fix` |
| `quotes` | 引號不一致 | 運行 `format:fix` |

### ❌ 問題：Prettier 格式檢查失敗

**症狀**：
```
[error] path/to/file.js: Insert `;`
```

**解決方案**：

```bash
# 自動修復所有格式問題
npm run format:fix

# 檢查哪些文件有問題
npm run format

# 驗證修復
npm run format
npm run lint
```

---

## 性能問題

### ❌ 問題：應用程式響應慢

**症狀**：
```
Response time > 1000ms
```

**診斷步驟**：

```bash
# 1. 查看請求日誌
npm run dev
# 觀察控制台輸出中的響應時間

# 2. 檢查系統資源
# macOS/Linux
top

# Windows
taskmgr

# 3. 檢查特定端點性能
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3000/

# curl-format.txt 內容：
# time_namelookup: %{time_namelookup}\n
# time_connect: %{time_connect}\n
# time_appconnect: %{time_appconnect}\n
# time_pretransfer: %{time_pretransfer}\n
# time_redirect: %{time_redirect}\n
# time_starttransfer: %{time_starttransfer}\n
# time_total: %{time_total}\n
```

**優化建議**：

```javascript
// 1. 啟用快取
app.set('view cache', true);

// 2. 使用中間件快取
const cacheMiddleware = (ttl) => {
  // 實現快取邏輯
};

// 3. 使用 CDN 提供靜態文件
app.use(express.static('public', { maxAge: '1d' }));

// 4. 啟用 Gzip 壓縮
const compression = require('compression');
app.use(compression());
```

### ❌ 問題：內存泄漏

**症狀**：
```
應用程式內存使用不斷增長
```

**診斷步驟**：

```bash
# 1. 使用 Node.js 調試工具
node --inspect index.js

# 2. 在 Chrome 中打開 chrome://inspect
# 3. 監控內存堆的變化
# 4. 尋找不被垃圾回收的對象

# 檢查代碼中的常見內存洩漏
# - 未關閉的連接
# - 事件監聽器未移除
# - 全局變數不斷累積
```

---

## 安全問題

### ❌ 問題：安全漏洞警告

**症狀**：
```
npm WARN security Some packages may be vulnerable
```

**解決方案**：

```bash
# 1. 檢查漏洞詳情
npm audit

# 2. 自動修復
npm audit fix

# 3. 強制升級（謹慎）
npm audit fix --force

# 4. 定期更新依賴
npm update
```

### ❌ 問題：XSS 漏洞

**症狀**：
```
用戶輸入在頁面上執行 JavaScript
```

**解決方案**：

```javascript
// ✅ 使用轉義的 EJS 語法
<%= userInput %>  // 自動轉義

// ❌ 避免使用未轉義的語法
<%- userInput %>  // 危險！

// 驗證並清理輸入
const sanitizeHtml = require('sanitize-html');
const clean = sanitizeHtml(userInput);
```

### ❌ 問題：CSRF 攻擊

**症狀**：
```
未授權的請求成功執行
```

**解決方案**：

```javascript
// 確保安全中間件已啟用
const helmet = require('helmet');
app.use(helmet());

// 添加 CSRF 保護（POST 請求）
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(csrf({ cookie: true }));
```

---

## 工作流問題

### ❌ 問題：GitHub Actions 工作流失敗

**症狀**：
```
Workflow failed: "自動測試與合併"
Error: Pull Request is still a draft
```

**解決方案**：

```bash
# 1. 查看工作流日誌
# 在 GitHub 上：Actions → 選擇工作流 → 查看詳細日誌

# 2. 本地驗證
npm run lint
npm test

# 3. 檢查 PR 狀態
# 確保 PR 不是草稿狀態

# 4. 檢查分支保護規則
# GitHub Settings → Branches → Branch protection rules
```

### ❌ 問題：自動合併失敗

**症狀**：
```
Auto-merge failed: Conflicts detected
```

**解決方案**：

```bash
# 1. 手動解決衝突
git fetch origin
git rebase origin/main

# 2. 解決衝突並提交
git add .
git rebase --continue

# 3. 強制推送
git push origin feature-branch --force-with-lease

# 4. 手動合併
# 在 GitHub 上手動合併 PR
```

### ❌ 問題：測試超時

**症狀**：
```
Test timeout after 30000ms
```

**解決方案**：

```javascript
// 增加超時時間
test('some slow test', async (t) => {
  t.timeout(60000); // 60 秒
  // 測試代碼
});

// 或全局配置
// package.json 中：
// "test": "node --test --timeout=60000"
```

---

## 🔍 調試技巧

### 啟用調試日誌

```bash
# 詳細的 npm 日誌
npm install --verbose

# Node.js 調試
node --inspect index.js

# 環境變數調試
DEBUG=* npm run dev
```

### 使用 Node.js 調試器

```bash
# 啟動調試模式
node --inspect-brk index.js

# 在 Chrome 中打開
chrome://inspect

# 或使用 VS Code
# .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "program": "${workspaceFolder}/index.js",
      "restart": true,
      "console": "integratedTerminal"
    }
  ]
}
```

### 日誌記錄

```javascript
// 添加詳細的日誌
console.log('[DEBUG]', 'Message:', { data });
console.error('[ERROR]', error.message, error.stack);

// 或使用日誌庫
const logger = require('pino')();
logger.info({ request: req }, 'Request received');
logger.error({ error }, 'An error occurred');
```

---

## 📞 獲取幫助

如果問題未在此解決：

1. 查看 [GitHub Issues](https://github.com/ni0520/Mygit/issues)
2. 搜索相似的問題
3. 提交新的 Issue 並包含：
   - 錯誤信息
   - 復現步驟
   - 系統信息（OS、Node.js 版本等）
   - 相關日誌

---

## 📚 相關資源

- [Node.js 官方文檔](https://nodejs.org/docs/)
- [Express.js 故障排查](https://expressjs.com/en/guide/error-handling.html)
- [npm 文檔](https://docs.npmjs.com/)
- [GitHub Actions 故障排查](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows)

---

**維護者**：ni0520  
**最後更新**：2026-05-20
