#!/usr/bin/env sh
set -eo pipefail

apk update && apk add zip
echo {\"version\": \"$COMMIT_TAG\", \"commit\": \"$COMMIT_HASH\", \"buildJob\": $CI_JOB_ID} > dist/build.json
mkdir artifacts
cd dist
tar czvf ../artifacts/${REPOSITORY/$OWNER\//}-$COMMIT_TAG.tar.gz *
zip  -r -9 ../artifacts/${REPOSITORY/$OWNER\//}-$COMMIT_TAG.zip *
