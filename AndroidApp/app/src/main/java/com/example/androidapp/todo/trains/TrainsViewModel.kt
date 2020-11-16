package com.example.androidapp.todo.trains

import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.androidapp.core.TAG
import com.example.androidapp.todo.data.Train
import com.example.androidapp.todo.data.TrainRepository
import kotlinx.coroutines.launch

@RequiresApi(Build.VERSION_CODES.O)
class TrainsViewModel:ViewModel() {
    private val mutableTrains = MutableLiveData<List<Train>>().apply { value = emptyList() }
    private val mutableLoading = MutableLiveData<Boolean>().apply { value = false }
    private val mutableException = MutableLiveData<Exception>().apply { value = null }

    val trains: LiveData<List<Train>> = mutableTrains
    val loading: LiveData<Boolean> = mutableLoading
    val loadingError: LiveData<Exception> = mutableException

    fun createItem(position: Int): Unit {
        val list = mutableListOf<Train>()
        list.addAll(mutableTrains.value!!)
        //list.add(Item(position.toString(), "Item " + position))
        mutableTrains.value = list
    }

    fun loadItems() {
        viewModelScope.launch {
            Log.v(TAG, "loadItems...");
            mutableLoading.value = true
            mutableException.value = null
            try {
                mutableTrains.value = TrainRepository.getAll()
                Log.d(TAG, "loadItems succeeded");
                mutableLoading.value = false
            } catch (e: Exception) {
                Log.w(TAG, "loadItems failed", e);
                mutableException.value = e
                mutableLoading.value = false
            }
        }
    }
}