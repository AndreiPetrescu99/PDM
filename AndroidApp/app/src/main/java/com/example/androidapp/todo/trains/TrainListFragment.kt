package com.example.androidapp.todo.trains

import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentTransaction
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.observe
import com.example.androidapp.R
import com.example.androidapp.core.TAG
import com.example.androidapp.todo.data.remote.RemoteDataSource

import kotlinx.android.synthetic.main.fragment_train_list.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch


class TrainListFragment:Fragment() {

    private lateinit var trainListAdapter: TrainListAdapter
    private lateinit var trainsModel: TrainsViewModel
    var isActive = false;

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.i(TAG, "onCreate")
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_train_list, container, false)
    }

    override fun onStart() {
        super.onStart()
        isActive = true
        CoroutineScope(Dispatchers.Main).launch { collectEvents() }
    }

    override fun onStop() {
        super.onStop()
        isActive = false
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private suspend fun collectEvents() {
        while (isActive) {
            val event = RemoteDataSource.eventChannel.receive()
            Log.v(TAG, event)
            Log.d(TAG, "received $event")
        }
    }


    @RequiresApi(Build.VERSION_CODES.O)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        fab.setOnClickListener {
            Log.v(TAG, "creating new item")
            trainsModel.trains.value?.size?.let { trainsModel.createItem(it) }
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        Log.i(TAG, "onActivityCreated")
        setupTrainList()

    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun setupTrainList() {
        trainListAdapter =
            TrainListAdapter(this)
        train_list.adapter =trainListAdapter
        trainsModel = ViewModelProvider(this).get(TrainsViewModel::class.java)
        trainsModel.trains.observe(viewLifecycleOwner) { trains ->
            Log.i(TAG, "update items")
            trainListAdapter.items= trains
        }
        trainsModel.loading.observe(viewLifecycleOwner) { loading ->
            Log.i(TAG, "update loading")
            progress_circular.visibility = if (loading) View.VISIBLE else View.GONE
        }
        trainsModel.loadingError.observe(viewLifecycleOwner) { exception ->
            if (exception != null) {
                Log.i(TAG, "update loading error")
                val message = "Loading exception ${exception.message}"
                Toast.makeText(activity, message, Toast.LENGTH_SHORT).show()
            }
        }
        trainsModel.loadItems()
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.i(TAG, "onDestroy")
    }
}