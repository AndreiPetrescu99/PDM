package com.example.androidapp.todo.data

import android.util.Log
import com.example.androidapp.core.TAG
import com.example.androidapp.todo.data.remote.TrainAPI

object TrainRepository {

    private var cachedItems: MutableList<Train>? = null;

    suspend fun getAll(): List<Train> {
        Log.i(TAG, "getAll");
        if (cachedItems != null) {
            return cachedItems as List<Train>;
        }
        cachedItems = mutableListOf()
        val items = TrainAPI.service.getAll()
        cachedItems?.addAll(items)
        return cachedItems as List<Train>
    }

    suspend fun load(itemId: String): Train {
        Log.i(TAG, "load")
        val item = cachedItems?.find { it.id == itemId }
        if (item != null) {
            return item
        }
        return TrainAPI.service.read(itemId)
    }

    suspend fun update(item: Train): Train? {
        Log.v(TAG, "update")
        val updatedTrain = TrainAPI.service.update(item.id, item)
        val index = cachedItems?.indexOfFirst { it.id == item.id }
        if(index != null){
            cachedItems?.set(index, updatedTrain)
        }
        return updatedTrain
    }
}