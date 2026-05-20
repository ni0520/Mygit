/**
 * API.md - Mygit 應用程式 API 文檔
 * 
 * 本文件詳細說明所有可用的 HTTP 端點及其使用方法
 */

# 🌐 Mygit API 文檔

**版本**：1.0  
**基礎 URL**：`http://localhost:3000`  
**最後更新**：2026-05-20

---

## 📋 目錄

1. [概述](#概述)
2. [認證](#認證)
3. [端點](#端點)
4. [請求/響應格式](#請求響應格式)
5. [錯誤處理](#錯誤處理)
6. [示例](#示例)
7. [狀態碼](#狀態碼)

---

## 概述

Mygit 是一個展示俳句（日本傳統短詩）的 Node.js 網頁應用程式。本 API 提供以下功能：

- 📝 **俳句展示**：獲取和顯示精選俳句
- 🏥 **健康監控**：檢查服務運行狀態
- 🚨 **錯誤處理**：友善的錯誤響應

---

## 認證

目前版本 **無需認證**。所有端點都是公開的。

> 📌 **未來計畫**：將添加基於 Token 的認證機制

---

## 端點

### 1️⃣ 獲取俳句頁面

**端點**：`GET /`

**說明**：返回渲染後的 HTML 俳句展示頁��

**請求示例**：
```bash
curl http://localhost:3000/
```

**響應**：
```html
<!DOCTYPE html>
<html>
  <head>
    <title>給 Mona 的俳句</title>
    <!-- ... -->
  </head>
  <body>
    <!-- 俳句內容 -->
  </body>
</html>
```

**狀態碼**：
- `200` - 成功返回頁面
- `500` - 伺服器錯誤

**性能指標**：
- 平均響應時間：50-150ms
- 緩存策略：靜態文件快取 1 天

---

### 2️⃣ 健康檢查

**端點**：`GET /healthz`

**說明**：檢查應用程式的運行狀態。用於負載平衡器、監控系統和 Kubernetes 健康檢查。

**請求示例**：
```bash
curl http://localhost:3000/healthz
```

**成功響應**：
```json
{
  "status": "ok"
}
```

**狀態碼**：
- `200` - 應用程式運行正常
- `503` - 應用程式不健康（資源不足、數據庫連接失敗等）

**快取**：
- 緩存時長：10 秒
- 適用場景：減少健康檢查頻率

**使用場景**：

```bash
# Docker 健康檢查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/healthz || exit 1

# Kubernetes 活躍性探針
livenessProbe:
  httpGet:
    path: /healthz
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 30
```

---

### 3️⃣ 404 - 未找到

**端點**：`任何未定義的路由`

**說明**：當請求的路由不存在時返回

**請求示例**：
```bash
curl http://localhost:3000/invalid-path
```

**響應**：
```json
{
  "error": "not_found"
}
```

**狀態碼**：
- `404` - 資源不存在

---

## 請求/響應格式

### 請求頭

所有請求應包含以下頭部（推薦）：

```http
GET /healthz HTTP/1.1
Host: localhost:3000
User-Agent: Mozilla/5.0
Accept: application/json
Accept-Encoding: gzip, deflate
```

### 響應頭

所有成功的 JSON 響應包含以下頭部：

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Encoding: gzip
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### 內容編碼

- 支援的格式：`gzip`、`deflate`、`br` (Brotli)
- 默認啟用 Gzip 壓縮

---

## 錯誤處理

### 錯誤響應格式

所有錯誤都以以下 JSON 格式返回：

```json
{
  "error": "error_code"
}
```

### 常見錯誤碼

| 錯誤碼 | HTTP 狀態 | 說明 |
|-------|---------|------|
| `not_found` | 404 | 請求的資源不存在 |
| `internal_server_error` | 500 | 伺服器內部錯誤 |
| `unauthorized` | 401 | 未授權（未來功能） |
| `forbidden` | 403 | 禁止訪問（未來功能） |

### 錯誤日誌

未捕獲的錯誤會被記錄到 `console.error`，格式如下：

```
Unhandled error: [Error details]
```

---

## 示例

### 示例 1：檢查服務是否在線

```bash
#!/bin/bash

# 基礎檢查
curl -s http://localhost:3000/healthz | jq .

# 輸出：
# {
#   "status": "ok"
# }
```

### 示例 2：監控腳本

```bash
#!/bin/bash

# 每 30 秒檢查一次
while true; do
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/healthz)
  
  if [ "$RESPONSE" = "200" ]; then
    echo "[$(date)] ✅ 服務正常"
  else
    echo "[$(date)] ❌ 服務異常 (HTTP $RESPONSE)"
    # 發送告警
  fi
  
  sleep 30
done
```

### 示例 3：JavaScript 客戶端

```javascript
// 檢查應用程式狀態
async function checkHealth() {
  try {
    const response = await fetch('http://localhost:3000/healthz');
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ 服務運行正常:', data.status);
    } else {
      console.log('❌ 服務異常');
    }
  } catch (error) {
    console.error('❌ 無法連接到服務:', error);
  }
}

checkHealth();
```

### 示例 4：Python 客戶端

```python
import requests
import json

def check_health():
    try:
        response = requests.get('http://localhost:3000/healthz', timeout=5)
        data = response.json()
        
        if response.status_code == 200:
            print(f'✅ Service OK: {data["status"]}')
        else:
            print(f'❌ Service Error: HTTP {response.status_code}')
    except Exception as e:
        print(f'❌ Connection Error: {e}')

check_health()
```

---

## 狀態碼

完整的 HTTP 狀態碼參考：

| 狀態碼 | 含義 | 說明 |
|-------|------|------|
| **2xx** | **成功** | |
| 200 | OK | 請求成功 |
| **4xx** | **客戶端錯誤** | |
| 404 | Not Found | 資源不存在 |
| **5xx** | **伺服器錯誤** | |
| 500 | Internal Server Error | 伺服器錯誤 |
| 503 | Service Unavailable | 服務不可用 |

---

## 性能考慮

### 響應時間目標

| 端點 | P50 | P95 | P99 |
|------|-----|-----|-----|
| `/` | 50ms | 150ms | 300ms |
| `/healthz` | 5ms | 20ms | 50ms |

### 優化建議

1. **快取策略**：使用 HTTP 快取和 CDN
2. **連接池**：重用 HTTP 連接
3. **請求壓縮**：啟用 Gzip 或 Brotli
4. **監控**：記錄慢查詢和錯誤率

---

## 安全考慮

### 實施的安全措施

- ✅ XSS 防護：所有輸出都經過轉義
- ✅ CSRF 防護：使用 Helmet 中間件
- ✅ 安全頭部：設置 CSP、X-Frame-Options 等
- ✅ 速率限制：（計畫中）
- ✅ 輸入驗證：（計畫中）

### 安全最佳實踐

1. 使用 HTTPS 訪問（生產環境）
2. 定期更新依賴
3. 啟用 CORS 時要謹慎
4. 監控和日誌記錄
5. 定期安全審計

---

## 未來計畫

- 🔜 新增身份驗證（OAuth2/JWT）
- 🔜 RESTful API 用於俳句數據
- 🔜 WebSocket 實時通知
- 🔜 GraphQL 支援
- 🔜 API 版本控制

---

## 常見問題

**Q: 可以修改俳句內容嗎？**  
A: 目前不支持。俳句存儲在 `haikus.json` 中，需要直接編輯文件。

**Q: 支援 CORS 跨域請求嗎？**  
A: 目前不支持。可在未來版本中添加。

**Q: 有 API 速率限制嗎？**  
A: 目前沒有。計畫在未來版本中實施。

**Q: 如何監控 API 性能？**  
A: 檢查 `/healthz` 端點的響應時間，或查看應用程式日誌中的請求計時。

---

## 支援與反饋

- 📧 Email: [待補充]
- 🐛 Issue: [GitHub Issues](https://github.com/ni0520/Mygit/issues)
- 📚 Documentation: [README](README.md)

---

**最後更新**：2026-05-20  
**維護者**：ni0520
