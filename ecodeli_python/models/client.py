"""Définition de la classe :class:`Client` pour EcoDeli."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass
class Client:
    """Représente un client de l'application."""

    id: int
    nom: str
    email: str
    adresse: str

