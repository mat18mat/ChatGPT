package com.example.ecodeli.model

data class Prestation(
    val id: Int,
    val title: String,
    val type: String,
    val client: String,
    val date: String,
    val statut: String,
    val duree: Int,
    val prix: Double
)
