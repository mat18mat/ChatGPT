from __future__ import annotations

from datetime import date
from pathlib import Path
from typing import List, Tuple

from analytics import stats

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

PDF_DIR = Path(__file__).resolve().parent
PDF_DIR.mkdir(exist_ok=True)


def compute_summary() -> List[Tuple[str, str]]:
    """Calcule quelques chiffres clefs pour le rapport."""
    clients, merchants, services, deliveries, invoices = stats.load_dataframes()
    total_ca = deliveries["prix"].sum()
    return [
        ("Clients", str(len(clients))),
        ("Commerçants", str(len(merchants))),
        ("Prestations", str(len(services))),
        ("Livraisons", str(len(deliveries))),
        ("CA total", f"{total_ca:.2f} €"),
    ]


def create_report(image_paths: List[Path], summary: List[Tuple[str, str]], output_name: str = "report.pdf") -> Path:
    """Create a PDF report containing provided graphs.

    Parameters
    ----------
    image_paths : List[Path]
        List of paths to PNG images. Should contain eight items.
    output_name : str, optional
        Name of the generated PDF file, by default "report.pdf".

    Returns
    -------
    Path
        Path to the created PDF.
    """
    pdf_path = PDF_DIR / output_name
    c = canvas.Canvas(str(pdf_path), pagesize=A4)
    width, height = A4

    # Page 1 - title, summary table and first 4 charts
    c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(width / 2, height - 50, "EcoDeli - Rapport")
    c.setFont("Helvetica", 10)
    c.drawCentredString(width / 2, height - 70, f"Date : {date.today().isoformat()}")

    # Summary table
    table_y = height - 120
    c.rect(40, table_y - 60, width - 80, 60)
    c.setFont("Helvetica", 9)
    x = 50
    for label, value in summary:
        c.drawString(x, table_y - 15, f"{label} : {value}")
        x += 100

    imgs_per_page = 4
    img_width = (width - 80) / 2
    img_height = 200
    positions = [
        (40, height - 200 - img_height),
        (width / 2 + 10, height - 200 - img_height),
        (40, height - 450 - img_height),
        (width / 2 + 10, height - 450 - img_height),
    ]

    for idx, img in enumerate(image_paths[:imgs_per_page]):
        x, y = positions[idx]
        c.drawImage(str(img), x, y, width=img_width, height=img_height, preserveAspectRatio=True)

    c.showPage()

    # Page 2 - remaining charts
    for idx, img in enumerate(image_paths[imgs_per_page:imgs_per_page*2]):
        x, y = positions[idx]
        c.drawImage(str(img), x, y, width=img_width, height=img_height, preserveAspectRatio=True)

    c.showPage()
    c.save()

    return pdf_path
