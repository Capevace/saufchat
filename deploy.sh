echo "Deploying SAUF.CHAT"

cd ui/
UI_VERSION=$(cat package.json | grep version | head -1 | awk -F= "{ print $2 }" | sed 's/[version:,\",]//g' | tr -d '[[:space:]]')
cd ../

cd server/
SERVER_VERSION=$(cat package.json | grep version | head -1 | awk -F= "{ print $2 }" | sed 's/[version:,\",]//g' | tr -d '[[:space:]]')
cd ../

BUILD_NUMBER=$(($(< versions/build.txt) + 1))
echo $BUILD_NUMBER > versions/build.txt

echo "Build: $BUILD_NUMBER"
echo "UI Version: $UI_VERSION-$BUILD_NUMBER"
echo "Server Version: $SERVER_VERSION-$BUILD_NUMBER"
echo ""
exit

echo "[Deploy UI] Starting UI build"
cd ui/

if [ -z "$(git status --porcelain)" ]; then 
  # Working directory clean
  echo "[Deploy UI] Checking out master and pulling..."
  git checkout master
  git pull
else 
  # Uncommitted changes
  echo "[Deploy UI] Found uncommitted changes. Exiting."
  exit 1
fi

npm run build
echo "[Deploy UI] UI build complete"


cd ../


echo "[Deploy Server] Starting server build"
cd server/

if [ -z "$(git status --porcelain)" ]; then 
  # Working directory clean
  echo "[Deploy Server] Checking out master and pulling..."
  git checkout master
  git pull
else 
  # Uncommitted changes
  echo "[Deploy Server] Found uncommitted changes. Exiting."
  exit 1
fi


npm run build
echo "[Deploy Server] Server build complete"

cd ../

echo "[Deploy UI] Deploying UI..."
cd ui/
npm run deploy
echo "[Deploy UI] UI version XXX deployed"

cd ../

echo "[Deploy Server] Deploying server..."
cd server/
git push heroku master
echo "[Deploy Server] Server version XXX deployed"


echo ""
echo "Goodbye."
