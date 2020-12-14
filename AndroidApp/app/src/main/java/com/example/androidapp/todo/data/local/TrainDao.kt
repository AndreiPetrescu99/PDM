package com.example.androidapp.todo.data.local

import androidx.lifecycle.LiveData
import androidx.room.*
import com.example.androidapp.todo.data.Train

@Dao
interface TrainDao{

    @Query("SELECT * from trains")
    fun getAll(): LiveData<List<Train>>

    @Query("SELECT * FROM trains WHERE _id=:id ")
    fun getById(id: String): LiveData<Train>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: Train)


    @Update(onConflict = OnConflictStrategy.REPLACE)
    suspend fun update(item: Train)

    @Query("DELETE FROM trains")
    suspend fun deleteAll()

}