#!/usr/bin/env sh
set -eo pipefail

docker run -v $PWD:/app --workdir /app node:lts scripts/build.sh
docker run -v $PWD:/app --workdir /app -e COMMIT_TAG -e COMMIT_HASH -e CI_JOB_ID -e REPOSITORY -e OWNER alpine scripts/package.sh
