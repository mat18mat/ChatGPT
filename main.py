"""Main entry point for the EcoDeli application."""

from __future__ import annotations

import argparse
from pathlib import Path

from data_generation import generator
from pdf import report
from ecodeli_core import generate_charts
from gui.kivy_app import main as gui_main


def cli_run_stats() -> list[Path]:
    """Compute statistics and generate charts."""
    return generate_charts()


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
        summary = report.compute_summary()
        pdf_path = report.create_report(images, summary)
        print(f"Rapport créé: {pdf_path}")
    else:
        gui_main()


if __name__ == "__main__":
    main()
