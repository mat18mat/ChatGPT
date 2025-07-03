"""Définition de la classe :class:`Commercant`."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Commercant:
    """Représente un commerçant partenaire."""

    id: int
    nom: str
    adresse: str

