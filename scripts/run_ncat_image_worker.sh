#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NCAT_BIN="${NCAT_BIN:-ncat}"
IMAGE_WORKER_BIND_HOST="${IMAGE_WORKER_BIND_HOST:-0.0.0.0}"
IMAGE_WORKER_PORT="${IMAGE_WORKER_PORT:-7373}"

exec "$NCAT_BIN" \
  --listen \
  --keep-open \
  "$IMAGE_WORKER_BIND_HOST" \
  "$IMAGE_WORKER_PORT" \
  --sh-exec "bash '$SCRIPT_DIR/handle_image_worker_request.sh'"