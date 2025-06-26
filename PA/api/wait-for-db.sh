
echo "Attente de la base de données à $DB_HOST:$DB_PORT..."

while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "Base de données accessible, démarrage du serveur..."
exec npm start