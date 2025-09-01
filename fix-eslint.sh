# Fix Auth.js
echo "📝 Fixing Auth.js..."
sed -i.backup 's/const userName = /const _userName = /' src/components/Auth.js
sed -i.backup 's/const role = /const _role = /' src/components/Auth.js
sed -i.backup 's/const handleLogout = /const _handleLogout = /' src/components/Auth.js

# Fix useEffect dependency in Auth.js
sed -i.backup 's/}, \[\]);/}, [navigate]);/' src/components/Auth.js

# Fix Card.js - remove unused props parameter
sed -i.backup 's/const Card = (props) => {/const Card = () => {/' src/components/Card.js
sed -i.backup 's/const Card = ({ props }) => {/const Card = () => {/' src/components/Card.js

# Fix alt attribute in Card.js
sed -i.backup 's/alt="[^"]*[Ii]mage[^"]*"/alt="Club logo"/g' src/components/Card.js

# Fix SGODashboard.js
sed -i.backup 's/const \[error, setError\] = /const [_error, _setError] = /' src/components/SGODashboard.js

echo "✅ Basic fixes applied!"
echo ""
echo "🚨 Manual fixes still needed:"
echo "1. Auth.test.js line 27: Change duplicate test title"
echo "2. Auth.test.js line 78: Move side effects outside waitFor"
echo "3. addCSO.js line 90: Add loadExecutives to useEffect dependency"
echo ""
echo "Run 'npm run lint' to check remaining issues."
