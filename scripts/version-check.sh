#!/bin/bash

# 版本檢測和更新的實用腳本
# 用於在本地或 CI/CD 環境中檢測和更新版本

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日誌函數
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[⚠]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# 檢查依賴
check_dependencies() {
    log_info "檢查必要的工具..."
    
    local required_tools=("jq" "node" "npm" "git")
    local missing_tools=()
    
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            missing_tools+=("$tool")
        fi
    done
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        log_error "缺少必要工具: ${missing_tools[*]}"
        return 1
    fi
    
    log_success "所有必要工具已安裝"
    return 0
}

# 獲取當前版本
get_current_version() {
    if [ ! -f "package.json" ]; then
        log_error "找不到 package.json"
        return 1
    fi
    
    node -e "console.log(require('./package.json').version)" 2>/dev/null || echo ""
}

# 獲取包名
get_package_name() {
    if [ ! -f "package.json" ]; then
        log_error "找不到 package.json"
        return 1
    fi
    
    node -e "console.log(require('./package.json').name)" 2>/dev/null || echo ""
}

# 獲取 NPM 遠端版本
get_npm_latest_version() {
    local package_name="$1"
    
    if [ -z "$package_name" ]; then
        log_error "包名不能為空"
        return 1
    fi
    
    npm view "$package_name" version 2>/dev/null || echo ""
}

# 比較版本
compare_versions() {
    local current="$1"
    local latest="$2"
    
    if [ "$current" = "$latest" ]; then
        echo "equal"
        return 0
    fi
    
    # 簡單的版本比較
    if [ "$(printf '%s\n' "$latest" "$current" | sort -V | head -n1)" = "$current" ]; then
        echo "outdated"
        return 0
    else
        echo "newer"
        return 0
    fi
}

# 獲取版本更新類型
get_version_update_type() {
    local current="$1"
    local latest="$2"
    
    local current_major=$(echo $current | cut -d. -f1)
    local current_minor=$(echo $current | cut -d. -f2)
    local current_patch=$(echo $current | cut -d. -f3)
    
    local latest_major=$(echo $latest | cut -d. -f1)
    local latest_minor=$(echo $latest | cut -d. -f2)
    local latest_patch=$(echo $latest | cut -d. -f3)
    
    if [ "$latest_major" -gt "$current_major" ]; then
        echo "major"
    elif [ "$latest_minor" -gt "$current_minor" ]; then
        echo "minor"
    elif [ "$latest_patch" -gt "$current_patch" ]; then
        echo "patch"
    else
        echo "none"
    fi
}

# 更新版本
update_version() {
    local new_version="$1"
    
    if [ -z "$new_version" ]; then
        log_error "新版本不能為空"
        return 1
    fi
    
    log_info "更新版本至 $new_version..."
    npm version "$new_version" --no-git-tag-version
    
    log_success "版本已更新"
    return 0
}

# 創建版本分支
create_version_branch() {
    local version="$1"
    
    if [ -z "$version" ]; then
        log_error "版本不能為空"
        return 1
    fi
    
    local branch_name="release/v${version}"
    
    log_info "創建版本分支: $branch_name"
    
    if git rev-parse --verify "$branch_name" >/dev/null 2>&1; then
        log_warning "分支已存在，切換到該分支"
        git checkout "$branch_name"
    else
        git checkout -b "$branch_name"
    fi
    
    log_success "分支已創建/切換"
    return 0
}

# 提交版本更新
commit_version_update() {
    local version="$1"
    local update_type="$2"
    
    if [ -z "$version" ]; then
        log_error "版本不能為空"
        return 1
    fi
    
    log_info "提交版本更新..."
    
    git add package.json package-lock.json 2>/dev/null || true
    
    if git diff --staged --quiet; then
        log_warning "無文件變更"
        return 0
    fi
    
    git commit -m "chore(release): 自動更新版本至 $version

    更新類型: ${update_type:-unknown}
    由版本檢測腳本執行
    時間: $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
    
    log_success "版本已提交"
    return 0
}

# 主檢查流程
check_and_report() {
    log_info "開始版本檢測..."
    echo ""
    
    # 檢查依賴
    if ! check_dependencies; then
        return 1
    fi
    
    # 獲取當前版本
    current_version=$(get_current_version)
    if [ -z "$current_version" ]; then
        log_error "無法獲取當前版本"
        return 1
    fi
    log_success "當前版本: $current_version"
    
    # 獲取包名
    package_name=$(get_package_name)
    if [ -z "$package_name" ]; then
        log_error "無法獲取包名"
        return 1
    fi
    log_info "包名: $package_name"
    
    # 獲取 NPM 遠端版本
    log_info "檢查 NPM 遠端版本..."
    latest_version=$(get_npm_latest_version "$package_name")
    
    if [ -z "$latest_version" ]; then
        log_warning "無法獲取遠端版本（可能是私有包）"
        return 0
    fi
    
    log_success "最新版本: $latest_version"
    
    # 比較版本
    comparison=$(compare_versions "$current_version" "$latest_version")
    
    case $comparison in
        "equal")
            log_success "版本已是最新"
            ;;
        "outdated")
            log_warning "檢測到可用更新"
            update_type=$(get_version_update_type "$current_version" "$latest_version")
            log_info "更新類型: $update_type"
            ;;
        "newer")
            log_warning "本地版本比遠端更新"
            ;;
    esac
    
    echo ""
    log_info "版本檢測完成"
    return 0
}

# 主函數
main() {
    case "${1:-check}" in
        "check")
            check_and_report
            ;;
        "update")
            if [ -z "$2" ]; then
                log_error "使用: $0 update <version>"
                return 1
            fi
            update_version "$2"
            ;;
        "help")
            cat << EOF
用法: $0 [命令] [選項]

命令:
  check                    檢查版本更新
  update <version>         更新版本
  help                     顯示此幫助信息

示例:
  $0 check
  $0 update 1.2.3

EOF
            ;;
        *)
            log_error "未知命令: $1"
            echo "使用 '$0 help' 獲取幫助"
            return 1
            ;;
    esac
}

# 運行主函數
main "$@"
