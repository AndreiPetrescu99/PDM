package com.example.androidapp.todo.train

import android.app.Application
import android.util.Log
import androidx.lifecycle.*
import com.example.androidapp.core.TAG
import com.example.androidapp.todo.data.Train
import com.example.androidapp.todo.data.TrainRepository
import com.example.androidapp.todo.data.local.TodoDatabase
import kotlinx.coroutines.launch
import com.example.androidapp.core.Result

class TrainEditViewModel(application: Application) : AndroidViewModel(application) {
    private val mutableItem = MutableLiveData<Train>().apply { value =
        Train("", "", "", "", "", 0)
    }
    private val mutableFetching = MutableLiveData<Boolean>().apply { value = false }
    private val mutableCompleted = MutableLiveData<Boolean>().apply { value = false }
    private val mutableException = MutableLiveData<Exception>().apply { value = null }

    val item: LiveData<Train> = mutableItem
    val fetching: LiveData<Boolean> = mutableFetching
    val fetchingError: LiveData<Exception> = mutableException
    val completed: LiveData<Boolean> = mutableCompleted

    val trainRepository: TrainRepository

    init{
        val itemDao = TodoDatabase.getDatabase(application, viewModelScope).itemDao()
        trainRepository = TrainRepository(itemDao)
    }

    fun loadItem(itemId: String):LiveData<Train> {
        Log.v(TAG, "getItemById...")
        return trainRepository.getById(itemId)
    }

    fun saveOrUpdateItem(item: Train) {
        viewModelScope.launch {
            Log.v(TAG, "saveOrUpdateItem...");
            mutableFetching.value = true
            mutableException.value = null
            val result: Result<Train>
            if (item._id.isNotEmpty()) {
                result = trainRepository.update(item)
            } else {
                //result = trainRepository.save(item)
                Log.i(TAG, "Train doesn't exist");
                result = trainRepository.update(item);
            }
            when(result) {
                is Result.Success -> {
                    Log.d(TAG, "saveOrUpdateItem succeeded");
                }
                is Result.Error -> {
                    Log.w(TAG, "saveOrUpdateItem failed", result.exception);
                    mutableException.value = result.exception
                }
            }
            mutableCompleted.value = true
            mutableFetching.value = false
        }
    }

}