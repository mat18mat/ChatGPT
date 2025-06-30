"""Generation de graphiques pour EcoDeli."""

from __future__ import annotations

from pathlib import Path
from typing import Optional

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

CHARTS_DIR = Path(__file__).resolve().parent.parent / "charts"
CHARTS_DIR.mkdir(exist_ok=True)

sns.set_theme(style="whitegrid")


def _save(fig: plt.Figure, name: str) -> Path:
    """Enregistre une figure matplotlib dans :data:`CHARTS_DIR`.

    Parameters
    ----------
    fig : plt.Figure
        Figure a sauvegarder.
    name : str
        Nom du fichier (sans extension).

    Returns
    -------
    Path
        Chemin complet de l'image creee.
    """
    path = CHARTS_DIR / f"{name}.png"
    fig.tight_layout()
    fig.savefig(path)
    plt.close(fig)
    return path


def pie_revenue_by_merchant(df: pd.DataFrame) -> Path:
    """Camembert du chiffre d'affaires par commercant."""
    data = df.copy()
    fig, ax = plt.subplots()
    ax.pie(data["chiffre_affaires"], labels=data.index, autopct="%1.1f%%")
    ax.set_title("Chiffre d'affaires par commercant")
    return _save(fig, "revenue_by_merchant_pie")


def bar_revenue_by_merchant(df: pd.DataFrame) -> Path:
    """Histogramme du chiffre d'affaires par commercant."""
    data = df.copy().reset_index()
    fig, ax = plt.subplots()
    sns.barplot(x="commercant_id", y="chiffre_affaires", data=data, ax=ax)
    ax.set_xlabel("ID Commercant")
    ax.set_ylabel("Chiffre d'affaires")
    ax.set_title("Chiffre d'affaires par commercant")
    return _save(fig, "revenue_by_merchant_bar")


def pie_revenue_by_service(df: pd.DataFrame) -> Path:
    """Camembert du chiffre d'affaires par prestation."""
    data = df.copy()
    fig, ax = plt.subplots()
    ax.pie(data["chiffre_affaires"], labels=data.index, autopct="%1.1f%%")
    ax.set_title("Chiffre d'affaires par prestation")
    return _save(fig, "revenue_by_service_pie")


def bar_revenue_by_service(df: pd.DataFrame) -> Path:
    """Histogramme du chiffre d'affaires par prestation."""
    data = df.copy().reset_index()
    fig, ax = plt.subplots()
    sns.barplot(x="prestation_id", y="chiffre_affaires", data=data, ax=ax)
    ax.set_xlabel("ID Prestation")
    ax.set_ylabel("Chiffre d'affaires")
    ax.set_title("Chiffre d'affaires par prestation")
    return _save(fig, "revenue_by_service_bar")


def bar_top_clients(df: pd.DataFrame) -> Path:
    """Bar chart des clients les plus depensiers."""
    data = df.copy()
    fig, ax = plt.subplots()
    sns.barplot(x="nom", y="total", data=data, ax=ax)
    ax.set_xlabel("Client")
    ax.set_ylabel("Depense totale")
    ax.set_title("Top clients")
    return _save(fig, "top_clients_bar")


def bar_top_services(df: pd.DataFrame) -> Path:
    """Bar chart des prestations les plus populaires."""
    data = df.copy()
    fig, ax = plt.subplots()
    sns.barplot(x="nom", y="nb", data=data, ax=ax)
    ax.set_xlabel("Prestation")
    ax.set_ylabel("Nombre de livraisons")
    ax.set_title("Top prestations")
    return _save(fig, "top_services_bar")


def hist_deliveries_per_month(deliveries: pd.DataFrame) -> Path:
    """Histogramme du nombre de livraisons par mois."""
    df = deliveries.copy()
    df["mois"] = pd.to_datetime(df["date_livraison"]).dt.to_period("M")
    counts = df.groupby("mois").size().reset_index(name="nb")
    fig, ax = plt.subplots()
    sns.barplot(x="mois", y="nb", data=counts, ax=ax)
    ax.set_xlabel("Mois")
    ax.set_ylabel("Nombre de livraisons")
    ax.set_title("Livraisons par mois")
    return _save(fig, "deliveries_per_month")


def hist_deliveries_per_client(deliveries: pd.DataFrame) -> Path:
    """Histogramme du nombre de livraisons par client."""
    counts = deliveries.groupby("client_id").size().reset_index(name="nb")
    fig, ax = plt.subplots()
    sns.barplot(x="client_id", y="nb", data=counts, ax=ax)
    ax.set_xlabel("ID Client")
    ax.set_ylabel("Nombre de livraisons")
    ax.set_title("Livraisons par client")
    return _save(fig, "deliveries_per_client")

