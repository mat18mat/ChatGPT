"""Module definissant la classe Livraison pour l'application EcoDeli."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date

# TODO: remplacer les classes placeholders lorsque disponibles
class Prestation:  # pragma: no cover - placeholder
    """Placeholder pour la classe Prestation."""
    prix_base: float  # type: ignore

class Commercant:  # pragma: no cover - placeholder
    """Placeholder pour la classe Commercant."""


@dataclass
class Livraison:
    """Represente une livraison d'une prestation."""

    id: int
    prestation: Prestation
    commercant: Commercant
    client_id: int
    date_livraison: date
    prix: float


# Exemple d'utilisation
if __name__ == "__main__":
    prestation = Prestation()
    prestation.prix_base = 8.0
    commercant = Commercant()
    livraison = Livraison(id=1, prestation=prestation, commercant=commercant,
                          client_id=42, date_livraison=date.today(), prix=8.0)
    print(livraison)
