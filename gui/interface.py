"""Tkinter dashboard for EcoDeli.

This module reads pre-generated JSON files and displays the main
statistics at startup without any user interaction.
"""

from __future__ import annotations

import tkinter as tk
from tkinter import ttk
from pathlib import Path
from typing import List

from analytics import stats
from visualization import charts


# Titles associated with the generated charts
CHART_TITLES = [
    "CA par commerçant (camembert)",
    "CA par commerçant (barres)",
    "CA par prestation (camembert)",
    "CA par prestation (barres)",
    "Top 5 clients",
    "Top prestations",
    "Livraisons par mois",
    "Livraisons par client",
]


class EcoDeliDashboard(tk.Tk):
    """Main window displaying EcoDeli statistics."""

    def __init__(self) -> None:
        super().__init__()
        self.title("EcoDeli - Dashboard")
        self.geometry("900x700")

        self.images: List[tk.PhotoImage] = []
        self.chart_paths: List[Path] = []

        self._load_data()
        self._generate_charts()
        self._create_widgets()

    def _load_data(self) -> None:
        """Load the JSON files as pandas ``DataFrame`` objects."""
        (
            self.clients,
            self.merchants,
            self.services,
            self.deliveries,
            self.invoices,
        ) = stats.load_dataframes()

    def _generate_charts(self) -> None:
        """Compute statistics and create PNG charts."""
        df_rev_m = stats.chiffre_affaires_par_commercant(self.deliveries)
        df_rev_s = stats.chiffre_affaires_par_prestation(self.deliveries)
        df_top_c = stats.top_clients(self.invoices, self.clients)
        df_top_s = stats.top_prestations(self.deliveries, self.services)

        self.chart_paths = [
            charts.pie_revenue_by_merchant(df_rev_m),
            charts.bar_revenue_by_merchant(df_rev_m),
            charts.pie_revenue_by_service(df_rev_s),
            charts.bar_revenue_by_service(df_rev_s),
            charts.bar_top_clients(df_top_c),
            charts.bar_top_services(df_top_s),
            charts.hist_deliveries_per_month(self.deliveries),
            charts.hist_deliveries_per_client(self.deliveries),
        ]

    def _create_widgets(self) -> None:
        """Display the generated charts in a tabbed interface."""
        notebook = ttk.Notebook(self)
        notebook.pack(fill=tk.BOTH, expand=True)

        for path, title in zip(self.chart_paths, CHART_TITLES):
            frame = ttk.Frame(notebook)
            notebook.add(frame, text=title)
            img = tk.PhotoImage(file=str(path))
            self.images.append(img)  # keep a reference to avoid GC
            ttk.Label(frame, image=img).pack(fill=tk.BOTH, expand=True)


def main() -> None:
    """Application entry point."""
    EcoDeliDashboard().mainloop()


if __name__ == "__main__":
    main()
