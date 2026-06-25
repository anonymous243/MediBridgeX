#!/usr/bin/env bash
# ============================================================
# MediBridgeX Backend — Start Script
# Runs uvicorn via "python3 -m" so ~/.local packages are
# always on sys.path, even inside the reloader subprocess.
# ============================================================
set -e

cd "$(dirname "$0")"

echo "🔐 Starting MediBridgeX API server..."
echo "   DB   : sqlite+aiosqlite (local dev)"
echo "   Port : http://localhost:8000"
echo "   Docs : http://localhost:8000/api/docs"
echo ""

python3 -m uvicorn app.main:app \
  --host 0.0.0.0 \
  --port 8000 \
  --reload \
  --log-level info
