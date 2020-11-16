package com.example.androidapp.todo.data

import java.time.LocalDateTime
import java.util.*

data class Train(
    val id:String,
    val from:String,
    val to:String,
    val timeLeave:String,
    val timeArrive:String,
    val nrSeats:Int
) {
    override fun toString(): String {
        return "From: " + from + " To: "+to+" Seats: "+nrSeats;
    }
}