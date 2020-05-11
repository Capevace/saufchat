echo "Testing SAUF.CHAT"

cd ui/
UI_VERSION=$(cat package.json | grep version | head -1 | awk -F= "{ print $2 }" | sed 's/[version:,\",]//g' | tr -d '[[:space:]]')
cd ../

cd server/
SERVER_VERSION=$(cat package.json | grep version | head -1 | awk -F= "{ print $2 }" | sed 's/[version:,\",]//g' | tr -d '[[:space:]]')
cd ../

LAST_BUILD_NUMBER=$(($(< versions/build.txt)))

echo "Last Build: $LAST_BUILD_NUMBER"
echo "UI Version: $UI_VERSION"
echo "Server Version: $SERVER_VERSION"
echo ""

echo "[Test UI] Starting UI tests"
cd ui/
npm run test
echo "[Test UI] UI testing completed"


cd ../


echo "[Test Server] Starting server tests"
cd server/
npm run test
echo "[Test Server] Server testing complete"

cd ../