#!/usr/bin/env bash

set -euo pipefail

WEB_APP_URL="${WEB_APP_URL:-}"
IMAGE_WORKER_TOKEN="${IMAGE_WORKER_TOKEN:-}"
CURL_BIN="${CURL_BIN:-curl}"
JQ_BIN="${JQ_BIN:-jq}"

if [[ -z "$WEB_APP_URL" || -z "$IMAGE_WORKER_TOKEN" ]]; then
  echo "WEB_APP_URL and IMAGE_WORKER_TOKEN must be set" >&2
  exit 1
fi

if ! command -v "$JQ_BIN" >/dev/null 2>&1; then
  echo "jq is required but not found: $JQ_BIN" >&2
  exit 1
fi

while true; do
  response="$($CURL_BIN \
    --silent \
    --show-error \
    --fail \
    --location \
    --max-redirs 5 \
    --get \
    --data-urlencode "action=processImageQueue" \
    --data-urlencode "token=$IMAGE_WORKER_TOKEN" \
    "$WEB_APP_URL")"

  ok="$(printf '%s' "$response" | "$JQ_BIN" -r '.ok')"
  remaining="$(printf '%s' "$response" | "$JQ_BIN" -r '.result.remaining // 0')"
  processed="$(printf '%s' "$response" | "$JQ_BIN" -r '.result.processed // false')"
  message="$(printf '%s' "$response" | "$JQ_BIN" -r '.result.message // empty')"

  printf '%s %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$response"

  if [[ "$ok" != 'true' ]]; then
    echo 'worker request failed' >&2
    exit 1
  fi

  if [[ "$processed" != 'true' && "$message" == 'queue is empty' ]]; then
    exit 0
  fi

  if [[ -z "$remaining" || "$remaining" == '0' ]]; then
    exit 0
  fi
done