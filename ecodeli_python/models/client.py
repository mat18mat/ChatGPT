"""Module definissant la classe :class:`Client` pour EcoDeli."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List

# TODO: replace `Facture` with the actual Invoice class when available
class Facture:  # pragma: no cover - placeholder class
    """Placeholder for the Facture (Invoice) class."""
    montant: float  # type: ignore


@dataclass
class Client:
    """Représente un client de l'application EcoDeli.

    Attributes
    ----------
    id : int
        Identifiant unique du client.
    nom : str
        Nom complet du client.
    email : str
        Adresse e-mail du client.
    adresse : str
        Adresse physique du client.
    historique_factures : List[Facture]
        Liste des factures associées au client.
    """

    id: int
    nom: str
    email: str
    adresse: str
    historique_factures: List[Facture] = field(default_factory=list)

    def ajouter_facture(self, facture: Facture) -> None:
        """Ajoute une facture à la liste de l'historique.

        Parameters
        ----------
        facture : Facture
            La facture à ajouter à l'historique du client.
        """
        self.historique_factures.append(facture)

    def total_depense(self) -> float:
        """Calcule le total dépensé par le client.

        Returns
        -------
        float
            Somme des montants de toutes les factures du client.
        """
        return sum(f.montant for f in self.historique_factures)


# Exemple d'utilisation
if __name__ == "__main__":
    client = Client(id=1, nom="Alice", email="alice@example.com", adresse="1 rue Exemple")
    facture1 = Facture()
    facture1.montant = 50.0  # exemple de montant
    facture2 = Facture()
    facture2.montant = 75.0

    client.ajouter_facture(facture1)
    client.ajouter_facture(facture2)

    print(f"Total dépensé par {client.nom} : {client.total_depense()} €")
