"""Définition de la classe :class:`Livraison`."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date


@dataclass
class Livraison:
    """Représente une livraison d'une prestation."""

    id: int
    prestation_id: int
    commercant_id: int
    client_id: int
    date_livraison: date
    prix: float

