package com.example.app.ui;

import com.example.app.service.DataAnalyzer;
import com.example.app.service.DataGenerator;
import com.example.app.service.PdfGenerator;

import javax.swing.*;
import java.awt.*;
import java.io.IOException;

public class AppFrame extends JFrame {
    private final String dataDir = "data";
    private final String chartDir = "charts";
    private final String pdfFile = "pdf/report.pdf";

    private final JTextArea log = new JTextArea(10, 40);
    private final JLabel preview = new JLabel();

    public AppFrame() {
        super("App Demo");
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout());
        JPanel buttons = new JPanel();
        JButton genData = new JButton("Générer les données");
        JButton genCharts = new JButton("Générer les graphiques");
        JButton genPdf = new JButton("Générer le PDF");
        JButton viewReport = new JButton("Consulter le rapport");
        buttons.add(genData);
        buttons.add(genCharts);
        buttons.add(genPdf);
        buttons.add(viewReport);
        add(buttons, BorderLayout.NORTH);
        add(new JScrollPane(log), BorderLayout.CENTER);
        add(preview, BorderLayout.SOUTH);

        DataGenerator generator = new DataGenerator();
        DataAnalyzer analyzer = new DataAnalyzer();
        PdfGenerator pdfGen = new PdfGenerator();

        genData.addActionListener(e -> {
            try {
                generator.generate(dataDir);
                log.append("Données générées\n");
            } catch (IOException ex) {
                log.append("Erreur génération données\n");
            }
        });

        genCharts.addActionListener(e -> {
            try {
                analyzer.load(dataDir);
                analyzer.generateCharts(chartDir);
                log.append("Graphiques générés\n");
                preview.setIcon(new ImageIcon(chartDir + "/services_pie.png"));
            } catch (IOException ex) {
                log.append("Erreur génération graphiques\n");
            }
        });

        genPdf.addActionListener(e -> {
            try {
                pdfGen.generate(chartDir, pdfFile, analyzer);
                log.append("PDF généré\n");
            } catch (IOException ex) {
                log.append("Erreur génération PDF\n");
            }
        });

        viewReport.addActionListener(e -> {
            try {
                Desktop.getDesktop().open(new java.io.File(pdfFile));
            } catch (IOException ex) {
                log.append("Impossible d'ouvrir le PDF\n");
            }
        });
        pack();
    }
}
