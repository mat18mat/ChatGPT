"""Interface graphique Tkinter pour EcoDeli."""

from __future__ import annotations

import tkinter as tk
from tkinter import ttk, messagebox
from pathlib import Path
from typing import List

from analytics import stats
from data_generation import generator
from pdf import report
from visualization import charts


class EcoDeliApp(tk.Tk):
    """Fenêtre principale de l'application."""

    def __init__(self) -> None:
        super().__init__()
        self.title("EcoDeli")
        self.geometry("300x200")
        self.images: List[Path] = []
        self._create_widgets()

    def _create_widgets(self) -> None:
        """Crée les boutons de l'interface."""
        ttk.Button(self, text="Générer données", command=self.generate_data).pack(
            pady=5
        )
        ttk.Button(self, text="Lancer statistiques", command=self.run_stats).pack(
            pady=5
        )
        ttk.Button(self, text="Générer rapport", command=self.generate_report).pack(
            pady=5
        )

    def generate_data(self) -> None:
        """Génère les données factices."""
        generator.generate_all()
        messagebox.showinfo("EcoDeli", "Données générées")

    def run_stats(self) -> None:
        """Lance les calculs statistiques et génère les graphiques."""
        (clients, merchants, services, deliveries, invoices) = stats.load_dataframes()
        df_rev_m = stats.chiffre_affaires_par_commercant(deliveries)
        df_rev_s = stats.chiffre_affaires_par_prestation(deliveries)
        df_top_c = stats.top_clients(invoices, clients)
        df_top_s = stats.top_prestations(deliveries, services)

        self.images = [
            charts.pie_revenue_by_merchant(df_rev_m),
            charts.bar_revenue_by_merchant(df_rev_m),
            charts.pie_revenue_by_service(df_rev_s),
            charts.bar_revenue_by_service(df_rev_s),
            charts.bar_top_clients(df_top_c),
            charts.bar_top_services(df_top_s),
            charts.hist_deliveries_per_month(deliveries),
            charts.hist_deliveries_per_client(deliveries),
        ]
        messagebox.showinfo("EcoDeli", "Statistiques calculées")

    def generate_report(self) -> None:
        """Génère le rapport PDF à partir des graphiques."""
        if not self.images:
            messagebox.showwarning(
                "EcoDeli", "Veuillez d'abord lancer les statistiques"
            )
            return
        pdf_path = report.create_report(self.images)
        messagebox.showinfo("EcoDeli", f"Rapport généré : {pdf_path}")


def main() -> None:
    """Point d'entrée de l'application graphique."""
    app = EcoDeliApp()
    app.mainloop()


if __name__ == "__main__":
    main()
