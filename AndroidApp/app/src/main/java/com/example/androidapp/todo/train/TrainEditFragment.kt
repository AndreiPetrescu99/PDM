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
import kotlinx.android.synthetic.main.fragment_train_edit.*

class TrainEditFragment:Fragment() {

    companion object{
        const val TRAIN_ID = "TRAIN_ID"
    }

    private lateinit var viewModel: TrainEditViewModel
    private var trainId: String? = null

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
            viewModel.saveOrUpdateItem();
        }
    }

    private fun setupViewModel() {
        viewModel = ViewModelProvider(this).get(TrainEditViewModel::class.java)
        viewModel.item.observe(viewLifecycleOwner) { item ->
            Log.v(TAG, "update items")
            train_text.setText(item.toString())
        }
        viewModel.fetching.observe(viewLifecycleOwner) { fetching ->
            Log.v(TAG, "update fetching")
            progress.visibility = if (fetching) View.VISIBLE else View.GONE
        }
        viewModel.fetchingError.observe(viewLifecycleOwner) { exception ->
            if (exception != null) {
                Log.v(TAG, "update fetching error")
                val message = "Fetching exception ${exception.message}"
                val parentActivity = activity?.parent
                if (parentActivity != null) {
                    Toast.makeText(parentActivity, message, Toast.LENGTH_SHORT).show()
                }
            }
        }
        viewModel.completed.observe(viewLifecycleOwner, Observer { completed ->
            if (completed) {
                Log.v(TAG, "completed, navigate back")
                findNavController().navigateUp()
            }
        })
        val id = trainId
        if (id != null) {
            viewModel.loadItem(id)
        }
    }


        override fun onDestroy() {
        super.onDestroy()
        Log.i(TAG, "onDestroy")
    }
}