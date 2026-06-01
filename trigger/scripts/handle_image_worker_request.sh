#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EXPECTED_ACTION="processImageQueue"
HOOK_TOKEN="${IMAGE_WORKER_HOOK_TOKEN:-}"

send_response() {
  local status="$1"
  local body="$2"

  printf 'HTTP/1.1 %s\r\n' "$status"
  printf 'Content-Type: application/json\r\n'
  printf 'Content-Length: %s\r\n' "${#body}"
  printf 'Connection: close\r\n'
  printf '\r\n'
  printf '%s' "$body"
}

urldecode() {
  local value="${1//+/ }"
  printf '%b' "${value//%/\\x}"
}

get_param() {
  local source="$1"
  local key="$2"
  local part raw

  IFS='&' read -r -a parts <<< "$source"
  for part in "${parts[@]}"; do
    if [[ "$part" == "$key="* ]]; then
      raw="${part#*=}"
      urldecode "$raw"
      return 0
    fi
  done

  return 1
}

read_request() {
  local header header_name header_value

  IFS= read -r REQUEST_LINE || return 1
  REQUEST_LINE="${REQUEST_LINE%$'\r'}"
  CONTENT_LENGTH=0

  while IFS= read -r header; do
    header="${header%$'\r'}"
    [[ -z "$header" ]] && break

    header_name="${header%%:*}"
    header_value="${header#*:}"
    header_name="${header_name,,}"
    header_value="${header_value# }"

    if [[ "$header_name" == 'content-length' ]]; then
      CONTENT_LENGTH="$header_value"
    fi
  done

  REQUEST_BODY=''
  if [[ "$CONTENT_LENGTH" =~ ^[0-9]+$ ]] && (( CONTENT_LENGTH > 0 )); then
    IFS= read -r -N "$CONTENT_LENGTH" REQUEST_BODY || true
  fi

  return 0
}

if ! read_request; then
  send_response '400 Bad Request' '{"ok":false,"error":"empty request"}'
  exit 0
fi

METHOD="${REQUEST_LINE%% *}"
REQUEST_TARGET="${REQUEST_LINE#* }"
REQUEST_TARGET="${REQUEST_TARGET%% *}"
QUERY_STRING=''

if [[ "$REQUEST_TARGET" == *\?* ]]; then
  QUERY_STRING="${REQUEST_TARGET#*\?}"
fi

PARAM_SOURCE="$QUERY_STRING"
if [[ "$METHOD" == 'POST' ]]; then
  PARAM_SOURCE="$REQUEST_BODY"
fi

ACTION="$(get_param "$PARAM_SOURCE" 'action' || true)"
TOKEN="$(get_param "$PARAM_SOURCE" 'token' || true)"

if [[ "$ACTION" != "$EXPECTED_ACTION" ]]; then
  send_response '400 Bad Request' '{"ok":false,"error":"unsupported action"}'
  exit 0
fi

if [[ -n "$HOOK_TOKEN" && "$TOKEN" != "$HOOK_TOKEN" ]]; then
  send_response '403 Forbidden' '{"ok":false,"error":"unauthorized"}'
  exit 0
fi

send_response '200 OK' "{\"ok\":true,\"message\":\"worker triggered\"}"

WORKER_OUTPUT="$(bash "$SCRIPT_DIR/trigger_image_process.sh" 2>&1)"
printf '%s\n' "$WORKER_OUTPUT"

exit 0
