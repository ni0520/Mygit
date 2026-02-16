
# Haikus for Codespaces

This is a quick node project template for demoing Codespaces. It is based on the [Azure node sample](https://github.com/Azure-Samples/nodejs-docs-hello-world). It's great!!!

Point your browser to [Quickstart for GitHub Codespaces](https://docs.github.com/en/codespaces/getting-started/quickstart) for a tour of using Codespaces with this repo.

## 模板輸出安全規則

- 預設一律使用 EJS 轉義輸出語法 `<%= ... %>`，避免將使用者可控內容直接渲染成 HTML。
- 僅在內容已由後端完成白名單清洗（allowlist sanitization）且有明確需求時，才可使用未轉義輸出 `<%- ... %>`。
- 如需呈現格式化內容（例如有限的 `<br>`、`<strong>`），請先在後端做白名單清洗，再評估是否使用未轉義輸出。
- 任何模板輸出變更都應納入程式碼審查，確認不會引入 XSS 風險。
