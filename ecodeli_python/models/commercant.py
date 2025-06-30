"""Module definissant la classe Commercant pour l'application EcoDeli."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List

# TODO: remplacer les classes placeholders lorsque disponibles
class Prestation:  # pragma: no cover - placeholder
    """Placeholder pour la classe Prestation."""
    prix_base: float  # type: ignore

class Livraison:  # pragma: no cover - placeholder
    """Placeholder pour la classe Livraison."""
    prix: float  # type: ignore


@dataclass
class Commercant:
    """Represente un commercant partenaire de l'application.

    Attributes
    ----------
    id : int
        Identifiant du commercant.
    nom : str
        Nom ou enseigne du commercant.
    adresse : str
        Adresse du commercant.
    prestations : List[Prestation]
        Prestations proposees par ce commercant.
    livraisons : List[Livraison]
        Historique des livraisons effectuees.
    """

    id: int
    nom: str
    adresse: str
    prestations: List[Prestation] = field(default_factory=list)
    livraisons: List[Livraison] = field(default_factory=list)

    def ajouter_prestation(self, prestation: Prestation) -> None:
        """Ajoute une prestation proposee par le commercant."""
        self.prestations.append(prestation)

    def ajouter_livraison(self, livraison: Livraison) -> None:
        """Ajoute une livraison effectuee pour ce commercant."""
        self.livraisons.append(livraison)

    def chiffre_affaires(self) -> float:
        """Calcule le chiffre d'affaires total base sur les livraisons."""
        return sum(l.prix for l in self.livraisons)


# Exemple d'utilisation
if __name__ == "__main__":
    commercant = Commercant(id=1, nom="Boulangerie Ducoin", adresse="10 rue de la Gare")
    prestation = Prestation()
    prestation.prix_base = 5.0
    livraison = Livraison()
    livraison.prix = 7.5
    commercant.ajouter_prestation(prestation)
    commercant.ajouter_livraison(livraison)
    print(f"Chiffre d'affaires: {commercant.chiffre_affaires()} €")
