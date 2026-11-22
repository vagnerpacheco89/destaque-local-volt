#!/bin/sh
# Read-only asset gate for a prepared static deployment, not an image generator.
set -eu
asset_build_env="$(mktemp -d "${TMPDIR:-/tmp}/volt-assets-build.XXXXXX")"
trap 'rm -rf "$asset_build_env"' EXIT HUP INT TERM
python3 -m venv "$asset_build_env"
"$asset_build_env/bin/python" -m pip install --disable-pip-version-check --requirement scripts/requirements-assets.txt
"$asset_build_env/bin/python" scripts/build-assets.py --check
