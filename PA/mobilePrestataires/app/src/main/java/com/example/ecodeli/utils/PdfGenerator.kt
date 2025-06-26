package com.example.ecodeli.utils

import android.content.Context
import com.example.ecodeli.model.Prestation
import com.itextpdf.kernel.pdf.PdfWriter
import com.itextpdf.layout.Document
import com.itextpdf.layout.element.Paragraph
import com.itextpdf.layout.element.Image
import com.itextpdf.io.image.ImageDataFactory
import java.io.File

object PdfGenerator {
    fun generateReport(context: Context, prestations: List<Prestation>): File {
        val file = File(context.filesDir, "rapport_prestations.pdf")
        val writer = PdfWriter(file)
        val pdf = com.itextpdf.kernel.pdf.PdfDocument(writer)
        val document = Document(pdf)

        document.add(Paragraph("Rapport des Prestations"))

        // Placeholder: here you would generate your charts as bitmap images and add them
        for (i in 1..8) {
            val bmp = android.graphics.Bitmap.createBitmap(400,200, android.graphics.Bitmap.Config.ARGB_8888)
            val canvas = android.graphics.Canvas(bmp)
            val paint = android.graphics.Paint()
            paint.textSize = 24f
            canvas.drawText("Graphique $i",50f,100f,paint)
            val img = ImageDataFactory.create(bmpToBytes(bmp))
            document.add(Image(img))
        }

        document.close()
        return file
    }

    private fun bmpToBytes(bmp: android.graphics.Bitmap): ByteArray {
        val stream = java.io.ByteArrayOutputStream()
        bmp.compress(android.graphics.Bitmap.CompressFormat.PNG, 100, stream)
        return stream.toByteArray()
    }
}
