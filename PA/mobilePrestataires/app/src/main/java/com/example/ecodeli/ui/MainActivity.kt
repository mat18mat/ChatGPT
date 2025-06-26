package com.example.ecodeli.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.ecodeli.model.Prestation
import com.example.ecodeli.utils.JsonReader
import com.example.ecodeli.utils.PdfGenerator

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val prestations = JsonReader.loadPrestations(this)
        setContent {
            MaterialTheme {
                PrestationsScreen(prestations = prestations) {
                    PdfGenerator.generateReport(this, prestations)
                }
            }
        }
    }
}

@Composable
fun PrestationsScreen(prestations: List<Prestation>, onPdf: () -> Unit) {
    var selected by remember { mutableStateOf<Prestation?>(null) }

    if (selected == null) {
        Column {
            Button(onClick = onPdf, modifier = Modifier.fillMaxWidth()) {
                Text("Generer PDF")
            }
            LazyColumn {
                items(prestations) { p ->
                    Row(modifier = Modifier
                        .fillMaxWidth()
                        .clickable { selected = p }
                        .padding(16.dp)) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(p.title, style = MaterialTheme.typography.titleMedium)
                            Text(p.type)
                            Text(p.client)
                            Text(p.date)
                            Text(p.statut)
                        }
                    }
                }
            }
        }
    } else {
        PrestationDetail(prestation = selected!!) { selected = null }
    }
}

@Composable
fun PrestationDetail(prestation: Prestation, onBack: () -> Unit) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text(prestation.title, style = MaterialTheme.typography.titleLarge)
        Text("Type: ${prestation.type}")
        Text("Client: ${prestation.client}")
        Text("Date: ${prestation.date}")
        Text("Statut: ${prestation.statut}")
        Text("Durée: ${prestation.duree} min")
        Text("Prix: ${prestation.prix}€")
        Spacer(modifier = Modifier.height(8.dp))
        Button(onClick = onBack) {
            Text("Retour")
        }
    }
}
