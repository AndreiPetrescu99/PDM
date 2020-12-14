package com.example.androidapp.todo.trains

import android.app.Application
import android.os.Build
import android.util.Log
import androidx.annotation.RequiresApi
import androidx.lifecycle.*
import com.example.androidapp.core.TAG
import com.example.androidapp.todo.data.Train
import com.example.androidapp.todo.data.TrainRepository
import kotlinx.coroutines.launch
import com.example.androidapp.core.Result
import com.example.androidapp.todo.data.local.TodoDatabase

@RequiresApi(Build.VERSION_CODES.O)
class TrainsViewModel(application: Application) : AndroidViewModel(application) {
    private val mutableTrains = MutableLiveData<List<Train>>().apply { value = emptyList() }
    private val mutableLoading = MutableLiveData<Boolean>().apply { value = false }
    private val mutableException = MutableLiveData<Exception>().apply { value = null }

    val trains: LiveData<List<Train>>
    val loading: LiveData<Boolean> = mutableLoading
    val loadingError: LiveData<Exception> = mutableException

    val trainRepository: TrainRepository

    init{
        val trainDao = TodoDatabase.getDatabase(application, viewModelScope).itemDao();
        trainRepository = TrainRepository(trainDao)
        trains = trainRepository.trains
    }

    fun createItem(position: Int): Unit {
        val list = mutableListOf<Train>()
        list.addAll(mutableTrains.value!!)
        //list.add(Item(position.toString(), "Item " + position))
        mutableTrains.value = list
    }

    fun loadItems() {
        viewModelScope.launch {
            Log.v(TAG, "refresh...");
            mutableLoading.value = true
            mutableException.value = null
            when (val result = trainRepository.getAll()) {
                is Result.Success -> {
                    Log.d(TAG, "refresh succeeded");
                }
                is Result.Error -> {
                    Log.w(TAG, "refresh failed", result.exception);
                    mutableException.value = result.exception
                }
            }
            mutableLoading.value = false
        }
    }
}