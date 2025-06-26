package com.example.ecodeli.utils

import android.content.Context
import com.example.ecodeli.model.Prestation
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

object JsonReader {
    fun loadPrestations(context: Context): List<Prestation> {
        val input = context.assets.open("data.json")
        val json = input.bufferedReader().use { it.readText() }
        val type = object : TypeToken<List<Prestation>>() {}.type
        return Gson().fromJson(json, type)
    }
}
