package com.example.androidapp.todo.train

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.observe
import androidx.navigation.fragment.findNavController
import com.example.androidapp.R
import com.example.androidapp.core.TAG
import com.example.androidapp.todo.data.Train
import kotlinx.android.synthetic.main.fragment_train_edit.*

class TrainEditFragment:Fragment() {

    companion object{
        const val TRAIN_ID = "TRAIN_ID"
    }

    private lateinit var viewModel: TrainEditViewModel
    private var trainId: String? = null
    private var train: Train? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.v(TAG, "onCreate")
        arguments?.let {
            if (it.containsKey(TRAIN_ID)) {
                trainId = it.getString(TRAIN_ID).toString()
            }
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        // Inflate the layout for this fragment
        return inflater.inflate(R.layout.fragment_train_edit, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        Log.v(TAG, "onViewCreated")
        train_text.setText(trainId);
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        Log.v(TAG, "onActivityCreated")
        setupViewModel()
        buy_btn.setOnClickListener{
            Log.v(TAG, "buy ticket pressed")
            val i = train
            if(i != null){
                //i.nrSeats = i.nrSeats - 1
                viewModel.saveOrUpdateItem(i);
            }
            //viewModel.saveOrUpdateItem();
        }
    }

    private fun setupViewModel() {
        viewModel = ViewModelProvider(this).get(TrainEditViewModel::class.java)
        viewModel.fetching.observe(viewLifecycleOwner, { fetching ->
            Log.v(TAG, "update fetching")
            progress.visibility = if (fetching) View.VISIBLE else View.GONE
        })
        viewModel.fetchingError.observe(viewLifecycleOwner, { exception ->
            if (exception != null) {
                Log.v(TAG, "update fetching error")
                val message = "Fetching exception ${exception.message}"
                val parentActivity = activity?.parent
                if (parentActivity != null) {
                    Toast.makeText(parentActivity, message, Toast.LENGTH_SHORT).show()
                }
            }
        })
        viewModel.completed.observe(viewLifecycleOwner, { completed ->
            if (completed) {
                Log.v(TAG, "completed, navigate back")
                findNavController().popBackStack()
            }
        })
        val id = trainId
        if (id == null) {
            train = Train("", "", "", "", "", 0);
        } else {
            viewModel.loadItem(id).observe(viewLifecycleOwner, {
                Log.v(TAG, "update items")
                if (it != null) {
                    train = it
                    train_text.setText(train.toString())
                }
            })
        }
    }


        override fun onDestroy() {
        super.onDestroy()
        Log.i(TAG, "onDestroy")
    }
}