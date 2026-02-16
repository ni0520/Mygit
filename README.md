# Haikus for Codespaces

This is a quick node project template for demoing Codespaces. It is based on the [Azure node sample](https://github.com/Azure-Samples/nodejs-docs-hello-world). It's great!!!

Point your browser to [Quickstart for GitHub Codespaces](https://docs.github.com/en/codespaces/getting-started/quickstart) for a tour of using Codespaces with this repo.

## 如何執行測試

1. 安裝相依套件：

   ```bash
   npm install
   ```

2. 執行整合測試：

   ```bash
   npm test
   ```

目前測試會驗證：
- `GET /` 是否回傳 `200`。
- `GET /healthz` 是否回傳 `200` 與 `{ status: 'ok' }`。

## 健康檢查用途

此專案提供 `GET /healthz` 端點，回傳 `200` 與 JSON `{"status":"ok"}`。可用於：
- 平台健康檢查（例如 Kubernetes liveness/readiness probe）。
- 負載平衡器後端存活確認。
- 監控系統定期輪詢服務可用性。
