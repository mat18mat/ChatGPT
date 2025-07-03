from __future__ import annotations

import random
import webbrowser
from pathlib import Path

from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label

from data_generation import generator
from ecodeli_core import generate_charts
from pdf import report

PDF_PATH = Path('pdf/report.pdf')

class EcoDeliWidget(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(orientation='vertical', **kwargs)
        self.status = Label(text='Prêt')
        self.add_widget(self.status)
        btn_data = Button(text='Générer les données')
        btn_data.bind(on_press=self.generate_data)
        self.add_widget(btn_data)
        btn_charts = Button(text='Générer les graphiques')
        btn_charts.bind(on_press=self.generate_charts)
        self.add_widget(btn_charts)
        btn_pdf = Button(text='Générer le PDF')
        btn_pdf.bind(on_press=self.generate_pdf)
        self.add_widget(btn_pdf)
        btn_view = Button(text='Ouvrir le rapport PDF')
        btn_view.bind(on_press=self.view_pdf)
        self.add_widget(btn_view)
        btn_nfc = Button(text='Lire un tag NFC')
        btn_nfc.bind(on_press=self.mock_nfc)
        self.add_widget(btn_nfc)

    def generate_data(self, *args):
        generator.generate_all()
        self.status.text = 'Données générées'

    def generate_charts(self, *args):
        generate_charts()
        self.status.text = 'Graphiques générés'

    def generate_pdf(self, *args):
        images = generate_charts()
        summary = report.compute_summary()
        report.create_report(images, summary)
        self.status.text = 'PDF généré'

    def view_pdf(self, *args):
        if PDF_PATH.exists():
            webbrowser.open(PDF_PATH.as_uri())
        else:
            self.status.text = 'Aucun PDF à afficher'

    def mock_nfc(self, *args):
        tag = hex(random.randint(0x100000, 0xFFFFFF))
        self.status.text = f'Tag NFC détecté: {tag}'

class EcoDeliApp(App):
    def build(self):
        return EcoDeliWidget()


def main() -> None:
    EcoDeliApp().run()


if __name__ == '__main__':
    main()
