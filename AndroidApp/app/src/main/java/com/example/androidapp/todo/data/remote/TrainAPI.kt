package com.example.androidapp.todo.data.remote

import com.example.androidapp.todo.data.Train
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

object TrainAPI {
    private const val URL = "http://192.168.1.23:3000/";

    interface Service {
        @GET("/train")
        suspend fun getAll(): List<Train>

        @GET("/train/{id}")
        suspend fun read(@Path("id") trainId: String): Train

        @Headers("Content-Type: application/json")
        @PUT("/train/{id}")
        suspend fun update(@Path("id") trainId: String, @Body train: Train): Train
    }

    private val client: OkHttpClient = OkHttpClient.Builder().build()

    private var gson = GsonBuilder()
        .setLenient()
        .create()

    private val retrofit = Retrofit.Builder()
        .baseUrl(URL)
        .addConverterFactory(GsonConverterFactory.create(gson))
        .client(client)
        .build()

    val service: Service = retrofit.create(
        Service::class.java)
}