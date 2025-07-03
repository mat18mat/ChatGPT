"""Utility functions for EcoDeli CLI and GUI."""

from __future__ import annotations

from pathlib import Path
from analytics import stats
from visualization import charts


def generate_charts() -> list[Path]:
    """Compute statistics and create the 8 analysis charts.

    Returns
    -------
    list[Path]
        Paths to the generated PNG files.
    """
    (clients, merchants, services, deliveries, invoices) = stats.load_dataframes()
    df_rev_m = stats.chiffre_affaires_par_commercant(deliveries)
    df_rev_s = stats.chiffre_affaires_par_prestation(deliveries)
    df_top_c = stats.top_clients(invoices, clients)
    df_top_s = stats.top_prestations(deliveries, services)

    images = [
        charts.pie_revenue_by_merchant(df_rev_m),
        charts.bar_revenue_by_merchant(df_rev_m),
        charts.pie_revenue_by_service(df_rev_s),
        charts.bar_revenue_by_service(df_rev_s),
        charts.bar_top_clients(df_top_c),
        charts.bar_top_services(df_top_s),
        charts.hist_deliveries_per_month(deliveries),
        charts.hist_deliveries_per_client(deliveries),
    ]
    return images
