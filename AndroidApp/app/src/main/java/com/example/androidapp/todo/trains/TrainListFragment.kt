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
import androidx.navigation.fragment.findNavController
import com.example.androidapp.R
import com.example.androidapp.auth.data.AuthRepository
import com.example.androidapp.core.TAG
import com.example.androidapp.todo.data.Train
import com.example.androidapp.todo.data.remote.RemoteDataSource
import com.example.androidapp.todo.network.ConnectivityLiveData

import android.net.*
import androidx.appcompat.app.AppCompatActivity
import androidx.work.*

import kotlinx.android.synthetic.main.fragment_train_list.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

import android.content.Context
import android.net.*
import android.widget.TextView
import org.w3c.dom.Text


class TrainListFragment:Fragment() {

    private lateinit var trainListAdapter: TrainListAdapter
    private lateinit var trainsModel: TrainsViewModel
    var isActive = false;

    private lateinit var connectivityManager: ConnectivityManager
    private lateinit var connectivityLiveData: ConnectivityLiveData



    @RequiresApi(Build.VERSION_CODES.M)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.i(TAG, "onCreate")
        connectivityManager = requireActivity().getSystemService(android.net.ConnectivityManager::class.java)
        connectivityLiveData = ConnectivityLiveData(connectivityManager)
        connectivityLiveData.observe(this, {
            Log.d(TAG, "connectivityLiveData $it")
        })
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_train_list, container, false)
    }

    @RequiresApi(Build.VERSION_CODES.N)
    override fun onStart() {
        super.onStart()
        isActive = true
        CoroutineScope(Dispatchers.Main).launch { collectEvents() }
        Log.d(TAG, "isOnline ${isOnline()}")
        connectivityManager.registerDefaultNetworkCallback(networkCallback)
    }

    @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
    override fun onStop() {
        super.onStop()
        isActive = false
        connectivityManager.unregisterNetworkCallback(networkCallback)
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private suspend fun collectEvents() {
        while (isActive) {
            val event = RemoteDataSource.eventChannel.receive()
            Log.v(TAG, event)
            Log.d(TAG, "received $event")
            //trainListAdapter.items[0].nrSeats = 0;
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
        if (!AuthRepository.isLoggedIn) {
            findNavController().navigate(R.id.fragment_login)
            return;
        }
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


    fun isOnline(): Boolean {
        val connMgr = requireActivity().getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val networkInfo: NetworkInfo? = connMgr.activeNetworkInfo
        return networkInfo?.isConnected == true
    }

    val networkCallback = @RequiresApi(Build.VERSION_CODES.LOLLIPOP)
    object : ConnectivityManager.NetworkCallback() {
        override fun onAvailable(network: Network) {
            Log.d(TAG, "The default network is now: " + network)
            textView2.text = "Online";
        }

        override fun onLost(network: Network) {
            Log.d(
                TAG,
                "The application no longer has a default network. The last default network was " + network
            )
            textView2.text = "Offline";
        }

        override fun onCapabilitiesChanged(
            network: Network,
            networkCapabilities: NetworkCapabilities
        ) {
            Log.d(TAG, "The default network changed capabilities: " + networkCapabilities)
        }

        override fun onLinkPropertiesChanged(network: Network, linkProperties: LinkProperties) {
            Log.d(TAG, "The default network changed link properties: " + linkProperties)
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        Log.i(TAG, "onDestroy")
    }
}