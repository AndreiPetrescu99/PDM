package com.example.androidapp.todo.data

import android.util.Log
import androidx.lifecycle.LiveData
import com.example.androidapp.core.TAG
import com.example.androidapp.todo.data.remote.TrainAPI
import com.example.androidapp.core.Result
import com.example.androidapp.todo.data.local.TrainDao

class TrainRepository(private val trainDao: TrainDao) {

    //private var cachedItems: MutableList<Train>? = null;

    val trains = trainDao.getAll();

    suspend fun getAll(): Result<Boolean> {
        try {
            val items = TrainAPI.service.getAll()
            for (item in items) {
                trainDao.insert(item)
            }
            return Result.Success(true)
        } catch(e: Exception) {
            return Result.Error(e)
        }
    }

    fun getById(itemId: String): LiveData<Train> {
        return trainDao.getById(itemId)
    }

    suspend fun update(item: Train): Result<Train> {
        Log.v(TAG, "update")
        try {
            val updatedItem = TrainAPI.service.update(item._id, item)
            trainDao.update(updatedItem)
            return Result.Success(updatedItem)
        } catch(e: Exception) {
            return Result.Error(e)
        }
    }
}