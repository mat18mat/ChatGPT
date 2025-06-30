from __future__ import annotations

import json
import random
from pathlib import Path
from typing import List, Dict

from faker import Faker

# TODO: allow using SQLite database instead of JSON files

fake = Faker("fr_FR")

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)


def save_json(data: List[Dict], file_path: Path) -> None:
    """Save a list of dictionaries as a JSON file.

    Parameters
    ----------
    data : List[Dict]
        Data to serialize.
    file_path : Path
        Output path.
    """
    with file_path.open("w", encoding="utf-8") as fh:
        json.dump(data, fh, ensure_ascii=False, indent=2)


def generate_clients(number: int = 30) -> List[Dict]:
    """Generate fake clients and store them in ``clients.json``."""
    clients = []
    for i in range(1, number + 1):
        clients.append({
            "id": i,
            "nom": fake.name(),
            "email": fake.email(),
            "adresse": fake.address().replace("\n", ", ")
        })
    save_json(clients, DATA_DIR / "clients.json")
    return clients


def generate_commercants(number: int = 30) -> List[Dict]:
    """Generate fake merchants and store them in ``commercants.json``."""
    merchants = []
    for i in range(1, number + 1):
        merchants.append({
            "id": i,
            "nom": fake.company(),
            "adresse": fake.address().replace("\n", ", ")
        })
    save_json(merchants, DATA_DIR / "commercants.json")
    return merchants


def generate_prestations(commercants: List[Dict], number: int = 30) -> List[Dict]:
    """Generate services associated with merchants and store them."""
    services = []
    for i in range(1, number + 1):
        merchant = random.choice(commercants)
        services.append({
            "id": i,
            "commercant_id": merchant["id"],
            "nom": fake.word().capitalize(),
            "description": fake.sentence(),
            "prix_base": round(random.uniform(5, 50), 2)
        })
    save_json(services, DATA_DIR / "prestations.json")
    return services


def generate_livraisons(prestations: List[Dict], clients: List[Dict], number: int = 30) -> List[Dict]:
    """Generate deliveries and store them in ``livraisons.json``."""
    deliveries = []
    for i in range(1, number + 1):
        service = random.choice(prestations)
        client = random.choice(clients)
        date_livraison = fake.date_between(start_date="-1y", end_date="today")
        price = service["prix_base"] * random.uniform(0.9, 1.2)
        deliveries.append({
            "id": i,
            "prestation_id": service["id"],
            "commercant_id": service["commercant_id"],
            "client_id": client["id"],
            "date_livraison": date_livraison.isoformat(),
            "prix": round(price, 2)
        })
    save_json(deliveries, DATA_DIR / "livraisons.json")
    return deliveries


def generate_factures(clients: List[Dict], livraisons: List[Dict], number: int = 30) -> List[Dict]:
    """Generate invoices linked to clients and deliveries."""
    invoices = []
    for i in range(1, number + 1):
        client = random.choice(clients)
        num_deliveries = random.randint(1, 3)
        selected = random.sample(livraisons, num_deliveries)
        date_emission = fake.date_between(start_date="-1y", end_date="today")
        invoices.append({
            "id": i,
            "client_id": client["id"],
            "livraison_ids": [d["id"] for d in selected],
            "date_emission": date_emission.isoformat(),
            "montant_total": round(sum(d["prix"] for d in selected), 2)
        })
    save_json(invoices, DATA_DIR / "factures.json")
    return invoices


def generate_all(records_per_entity: int = 30) -> None:
    """Generate all entities and save them as JSON files."""
    clients = generate_clients(records_per_entity)
    merchants = generate_commercants(records_per_entity)
    services = generate_prestations(merchants, records_per_entity)
    deliveries = generate_livraisons(services, clients, records_per_entity)
    generate_factures(clients, deliveries, records_per_entity)


if __name__ == "__main__":
    generate_all()
