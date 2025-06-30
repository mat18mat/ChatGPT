"""Module definissant la classe Facture pour l'application EcoDeli."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from typing import List

# TODO: remplacer les classes placeholders lorsque disponibles
class Livraison:  # pragma: no cover - placeholder
    """Placeholder pour la classe Livraison."""
    prix: float  # type: ignore


@dataclass
class Facture:
    """Represente une facture liee a un client."""

    id: int
    client_id: int
    date_emission: date
    livraisons: List[Livraison] = field(default_factory=list)

    def ajouter_livraison(self, livraison: Livraison) -> None:
        """Ajoute une livraison a cette facture."""
        self.livraisons.append(livraison)

    @property
    def montant_total(self) -> float:
        """Calcule le montant total de la facture."""
        return sum(l.prix for l in self.livraisons)


# Exemple d'utilisation
if __name__ == "__main__":
    facture = Facture(id=1, client_id=42, date_emission=date.today())
    livraison = Livraison()
    livraison.prix = 12.0
    facture.ajouter_livraison(livraison)
    print(f"Montant total: {facture.montant_total} €")
