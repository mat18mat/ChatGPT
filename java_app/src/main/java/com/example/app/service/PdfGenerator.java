package com.example.app.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.io.image.ImageDataFactory;

import java.io.File;
import java.io.IOException;

public class PdfGenerator {
    public void generate(String chartDir, String pdfFile, DataAnalyzer analyzer) throws IOException {
        new File(pdfFile).getParentFile().mkdirs();
        PdfWriter writer = new PdfWriter(pdfFile);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("Rapport Statistique"));
        document.add(new Paragraph("Chiffre d'affaires: " + analyzer.computeRevenue()));

        Table table = new Table(2);
        table.addCell("Top Clients");
        table.addCell("Nombre");
        for (var c : analyzer.topClients()) {
            table.addCell(c.getName());
            long count = analyzer.getInvoices().stream().filter(i -> i.getClientId() == c.getId()).count();
            table.addCell(String.valueOf(count));
        }
        document.add(table);

        String[] files = {"services_pie.png","services_bar.png","clients_pie.png","clients_bar.png",
                "merchants_pie.png","merchants_bar.png","deliveries_pie.png","deliveries_bar.png"};
        for (String f : files) {
            Image img = new Image(ImageDataFactory.create(chartDir + "/" + f));
            img.setAutoScale(true);
            document.add(img);
        }

        document.close();
    }
}
