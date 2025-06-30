"""Module definissant la classe Prestation pour l'application EcoDeli."""

from __future__ import annotations

from dataclasses import dataclass

# TODO: remplacer la classe Commercant lorsque disponible
class Commercant:  # pragma: no cover - placeholder
    """Placeholder pour la classe Commercant."""


@dataclass
class Prestation:
    """Represente une prestation proposee par un commercant."""

    id: int
    commercant: Commercant
    nom: str
    description: str
    prix_base: float


# Exemple d'utilisation
if __name__ == "__main__":
    commercant = Commercant()
    prestation = Prestation(id=1, commercant=commercant, nom="Livraison express",
                            description="Livraison en moins de 24h", prix_base=10.0)
    print(prestation)
