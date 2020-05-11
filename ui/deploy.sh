#!/usr/bin/env sh

# abort on errors
set -e

# build
npm version patch
npm run build

# navigate into the build output directory
cd dist

# if you are deploying to a custom domain
echo 'sauf.chat' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
git push -f git@github.com:capevace/saufchat-ui.git master:gh-pages

# if you are deploying to https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -