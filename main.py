"""Main entry point for the EcoDeli application."""

from __future__ import annotations

import argparse
from pathlib import Path

from data_generation import generator
from analytics import stats
from visualization import charts
from pdf import report
from gui.interface import main as gui_main


def cli_run_stats() -> list[Path]:
    """Compute statistics and generate charts.

    Returns
    -------
    list[Path]
        List of paths to generated chart images.
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


def main() -> None:
    """Parse command line arguments and launch the appropriate action."""
    parser = argparse.ArgumentParser(description="EcoDeli utilities")
    sub = parser.add_subparsers(dest="command")
    sub.add_parser("generate-data", help="Create fake data in JSON files")
    sub.add_parser("run-stats", help="Compute statistics and charts")
    sub.add_parser("generate-report", help="Compute statistics and create PDF report")
    args = parser.parse_args()

    if args.command == "generate-data":
        generator.generate_all()
        print("Données générées")
    elif args.command == "run-stats":
        cli_run_stats()
        print("Statistiques générées")
    elif args.command == "generate-report":
        images = cli_run_stats()
        pdf_path = report.create_report(images)
        print(f"Rapport créé: {pdf_path}")
    else:
        gui_main()


if __name__ == "__main__":
    main()
