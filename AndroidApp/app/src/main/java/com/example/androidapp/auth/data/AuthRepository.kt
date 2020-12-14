package com.example.androidapp.auth.data

import android.util.Log
import com.example.androidapp.auth.data.remote.RemoteAuthDataSource
import com.example.androidapp.core.Api
import com.example.androidapp.core.Result
import com.example.androidapp.core.TAG

object AuthRepository {
    var user: User? = null
        private set

    val isLoggedIn: Boolean
        get() = user != null

    init {
        user = null
    }

    fun logout() {
        user = null
        Api.tokenInterceptor.token = null
    }

    suspend fun login(username: String, password: String): Result<TokenHolder> {
        val user = User(username, password)
        val result = RemoteAuthDataSource.login(user)
        if (result is Result.Success<TokenHolder>) {
            setLoggedInUser(user, result.data)
        }
        return result
    }

    private fun setLoggedInUser(user: User, tokenHolder: TokenHolder) {
        AuthRepository.user = user
        Api.tokenInterceptor.token = tokenHolder.token
        Log.i(TAG, user.toString())
        Log.i(TAG, tokenHolder.token)
    }
}
