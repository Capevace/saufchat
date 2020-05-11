#!/usr/bin/env sh

# abort on errors
set -e

# navigate into the build output directory
#cd ../saufchat-ui

#echo "Building UI..."
#npm run build

#echo "Copying UI..."
#cp -r dist ../saufchat-server/ui-dist

#cd -

git add .
git commit -m "Deploy to heroku"
git push heroku master