"""Définition de la classe :class:`Facture`."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import date
from typing import List


@dataclass
class Facture:
    """Représente une facture liée à un client."""

    id: int
    client_id: int
    livraison_ids: List[int]
    date_emission: date
    montant_total: float

