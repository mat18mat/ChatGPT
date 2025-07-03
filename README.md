# EcoDeli Example Application

Cette application illustre la génération de données factices, le calcul de statistiques et la création de rapports pour un service de livraison. Elle propose une interface graphique basée sur **Kivy** permettant de lancer les différentes étapes.

## Installation

1. Créez un environnement virtuel avec Python 3.10 ou plus.
2. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```

## Utilisation

Lancer l'interface graphique :

```bash
python main.py
```

Depuis l'interface vous pourrez :

- Générer les données JSON factices.
- Produire les graphiques d'analyse.
- Générer un rapport PDF comprenant les graphiques et un tableau de synthèse.
- Ouvrir le rapport PDF dans votre visualiseur par défaut.

Les données sont stockées dans le dossier `data/`, les graphiques dans `charts/` et le rapport dans `pdf/`.

## Ligne de commande

Il est également possible d'utiliser quelques commandes directement :

```bash
python main.py generate-data   # génère les données
python main.py run-stats       # génère uniquement les graphiques
python main.py generate-report # génère les graphiques et le PDF
```
