package com.example.androidapp.todo.data.remote

import com.example.androidapp.core.Api
import com.example.androidapp.todo.data.Train
import com.google.gson.GsonBuilder
import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.*

object TrainAPI {
    interface Service {
        @GET("/api/train")
        suspend fun getAll(): List<Train>

        @GET("/api/train/{id}")
        suspend fun read(@Path("id") trainId: String): Train

        @Headers("Content-Type: application/json")
        @PUT("/api/train/{id}")
        suspend fun update(@Path("id") trainId: String, @Body train: Train): Train
    }

    val service: Service = Api.retrofit.create(Service::class.java)
}