"""Définition de la classe :class:`Prestation`."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Prestation:
    """Représente une prestation proposée par un commerçant."""

    id: int
    commercant_id: int
    nom: str
    description: str
    prix_base: float

