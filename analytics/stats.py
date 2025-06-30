"""Fonctions d'analyse statistique pour EcoDeli."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Tuple

import pandas as pd

DATA_DIR = Path(__file__).resolve().parent.parent / "data"


def _load_json(name: str) -> list[dict]:
    """Charge un fichier JSON situe dans :data:`DATA_DIR`.

    Parameters
    ----------
    name: str
        Nom du fichier JSON.

    Returns
    -------
    list[dict]
        Contenu du fichier.
    """
    path = DATA_DIR / name
    with path.open(encoding="utf-8") as fh:
        return json.load(fh)


def load_dataframes() -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame,
                               pd.DataFrame, pd.DataFrame]:
    """Charge toutes les donnees JSON en :class:`pandas.DataFrame`.

    Returns
    -------
    Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame, pd.DataFrame]
        DataFrames pour les clients, commercants, prestations, livraisons
        et factures.
    """
    clients = pd.DataFrame(_load_json("clients.json"))
    merchants = pd.DataFrame(_load_json("commercants.json"))
    services = pd.DataFrame(_load_json("prestations.json"))
    deliveries = pd.DataFrame(_load_json("livraisons.json"))
    invoices = pd.DataFrame(_load_json("factures.json"))
    return clients, merchants, services, deliveries, invoices


def chiffre_affaires_par_commercant(deliveries: pd.DataFrame) -> pd.DataFrame:
    """Calcule le chiffre d'affaires par commercant."""
    grouped = deliveries.groupby("commercant_id")[["prix"]].sum()
    grouped = grouped.rename(columns={"prix": "chiffre_affaires"})
    return grouped.sort_values("chiffre_affaires", ascending=False)


def chiffre_affaires_par_prestation(deliveries: pd.DataFrame) -> pd.DataFrame:
    """Calcule le chiffre d'affaires par prestation."""
    grouped = deliveries.groupby("prestation_id")[["prix"]].sum()
    grouped = grouped.rename(columns={"prix": "chiffre_affaires"})
    return grouped.sort_values("chiffre_affaires", ascending=False)


def top_clients(invoices: pd.DataFrame, clients: pd.DataFrame,
                n: int = 5) -> pd.DataFrame:
    """Renvoie le top ``n`` des clients par depense totale."""
    totals = invoices.groupby("client_id")["montant_total"].sum().reset_index()
    merged = totals.merge(clients, left_on="client_id", right_on="id")
    merged = merged.rename(columns={"montant_total": "total"})
    ordered = merged.sort_values("total", ascending=False)
    return ordered[["client_id", "nom", "total"]].head(n)


def top_prestations(deliveries: pd.DataFrame, services: pd.DataFrame,
                    n: int = 5) -> pd.DataFrame:
    """Renvoie le top ``n`` des prestations par nombre de livraisons."""
    counts = deliveries.groupby("prestation_id").size().reset_index(name="nb")
    merged = counts.merge(services, left_on="prestation_id", right_on="id")
    ordered = merged.sort_values("nb", ascending=False)
    return ordered[["prestation_id", "nom", "nb"]].head(n)

