package com.example.ecodeli.ui

import android.app.Activity
import android.nfc.NfcAdapter
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.ecodeli.model.Delivery
import com.example.ecodeli.model.Prestation
import com.example.ecodeli.utils.JsonReader

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val prestations = JsonReader.loadPrestations(this)
        val deliveries = JsonReader.loadDeliveries(this)
        setContent {
            EcoDeliApp(prestations, deliveries)
        }
    }
}

@Composable
fun EcoDeliApp(prestations: List<Prestation>, deliveries: List<Delivery>) {
    val navController = rememberNavController()
    MaterialTheme {
        NavHost(navController, startDestination = "login") {
            composable("login") {
                LoginScreen(onLogin = { navController.navigate("main") })
            }
            composable("main") {
                MainScreen(prestations, deliveries)
            }
        }
    }
}

@Composable
fun LoginScreen(onLogin: () -> Unit) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    Column(Modifier.padding(16.dp)) {
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("Email") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(8.dp))
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Mot de passe") },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(Modifier.height(16.dp))
        Button(onClick = onLogin, modifier = Modifier.fillMaxWidth()) {
            Text("Connexion")
        }
    }
}

@Composable
fun MainScreen(prestations: List<Prestation>, deliveries: List<Delivery>) {
    val nav = rememberNavController()
    val items = listOf("prestations", "deliveries", "profile", "nfc")
    Scaffold(
        bottomBar = {
            NavigationBar {
                val backStack by nav.currentBackStackEntryAsState()
                val current = backStack?.destination?.route
                items.forEach { route ->
                    NavigationBarItem(
                        selected = current == route,
                        onClick = { nav.navigate(route) },
                        label = { Text(route) },
                        icon = { }
                    )
                }
            }
        }
    ) { padding ->
        NavHost(nav, startDestination = "prestations", modifier = Modifier.padding(padding)) {
            composable("prestations") { PrestationsScreen(prestations) }
            composable("deliveries") { DeliveriesScreen(deliveries) }
            composable("profile") { ProfileScreen() }
            composable("nfc") { NfcScreen() }
        }
    }
}

@Composable
fun PrestationsScreen(prestations: List<Prestation>) {
    var selected by remember { mutableStateOf<Prestation?>(null) }

    if (selected == null) {
        LazyColumn {
            items(prestations) { p ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { selected = p }
                        .padding(16.dp)
                ) {
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
        Button(onClick = onBack) { Text("Retour") }
    }
}

@Composable
fun DeliveriesScreen(deliveries: List<Delivery>) {
    LazyColumn {
        items(deliveries) { d ->
            Column(modifier = Modifier.fillMaxWidth().padding(16.dp)) {
                Text(d.description, style = MaterialTheme.typography.titleMedium)
                Text(d.date)
                Text(d.status)
            }
        }
    }
}

@Composable
fun ProfileScreen() {
    var pseudo by remember { mutableStateOf("Utilisateur") }
    Column(Modifier.padding(16.dp)) {
        OutlinedTextField(
            value = pseudo,
            onValueChange = { pseudo = it },
            label = { Text("Pseudo") },
            modifier = Modifier.fillMaxWidth()
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text("Photo: [placeholder]")
    }
}

@Composable
fun NfcScreen() {
    val context = LocalContext.current
    val activity = context as? Activity
    var info by remember { mutableStateOf("Approchez un tag NFC") }
    DisposableEffect(Unit) {
        val adapter = NfcAdapter.getDefaultAdapter(context)
        val callback = NfcAdapter.ReaderCallback { tag ->
            info = tag.id.joinToString(separator = "") { String.format("%02X", it) }
        }
        adapter?.enableReaderMode(
            activity,
            callback,
            NfcAdapter.FLAG_READER_NFC_A or NfcAdapter.FLAG_READER_SKIP_NDEF_CHECK,
            null
        )
        onDispose { adapter?.disableReaderMode(activity) }
    }
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text(info)
    }
}
