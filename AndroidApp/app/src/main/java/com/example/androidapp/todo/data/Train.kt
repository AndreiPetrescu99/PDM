package com.example.androidapp.todo.data

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey
import java.time.LocalDateTime
import java.util.*

@Entity(tableName = "trains")
data class Train(
    @PrimaryKey @ColumnInfo(name = "_id") val _id:String,
    @ColumnInfo(name = "from") var from:String,
    @ColumnInfo(name = "to") var to:String,
    @ColumnInfo(name = "timeLeave") var timeLeave:String,
    @ColumnInfo(name = "timeArrive") var timeArrive:String,
    @ColumnInfo(name = "nrSeats") var nrSeats:Int
) {
    override fun toString(): String {
        return "From: " + from + " To: "+to+" Seats: "+nrSeats;
    }
}