#!/usr/bin/env bash

set -euo pipefail

WEB_APP_URL="${WEB_APP_URL:-}"
IMAGE_WORKER_TOKEN="${IMAGE_WORKER_TOKEN:-}"
CURL_BIN="${CURL_BIN:-curl}"

if [[ -z "$WEB_APP_URL" || -z "$IMAGE_WORKER_TOKEN" ]]; then
  echo "WEB_APP_URL and IMAGE_WORKER_TOKEN must be set" >&2
  exit 1
fi

response="$($CURL_BIN \
  --silent \
  --show-error \
  --fail \
  --get \
  --data-urlencode "action=processImageQueue" \
  --data-urlencode "token=$IMAGE_WORKER_TOKEN" \
  "$WEB_APP_URL")"

printf '%s %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$response"