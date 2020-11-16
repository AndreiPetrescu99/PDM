package com.example.androidapp.todo.trains

import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.example.androidapp.R
import com.example.androidapp.core.TAG
import com.example.androidapp.todo.data.Train
import com.example.androidapp.todo.train.TrainEditFragment
import kotlinx.android.synthetic.main.view_item.view.*

class TrainListAdapter (
    private val fragment: Fragment
    ) : RecyclerView.Adapter<TrainListAdapter.ViewHolder>() {
    var items = emptyList<Train>()
        set(value) {
            field = value
            notifyDataSetChanged();
        }

    private var onItemClick: View.OnClickListener;

    init {
        Log.v(TAG, "Init adapter")
        onItemClick = View.OnClickListener { view ->
            Log.v(TAG, "Item Clicked")
            val item = view.tag as Train
            fragment.findNavController().navigate(R.id.SecondFragment, Bundle().apply {
                putString(TrainEditFragment.TRAIN_ID, item.id)
            })
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.view_item, parent, false)
        Log.v(TAG, "onCreateViewHolder")
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        Log.v(TAG, "onBindViewHolder $position")
        val item = items[position]
        holder.textView.text = item.toString();
        holder.itemView.tag = item
        holder.itemView.setOnClickListener(onItemClick);
    }

    override fun getItemCount() = items.size

    inner class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val textView: TextView = view.text;
    }
}
