package com.itsjuniordias1997.blogclub

import android.app.Activity
import android.util.Log
import com.facebook.react.bridge.*
import com.google.android.play.core.integrity.IntegrityManagerFactory
import com.google.android.play.core.integrity.IntegrityTokenRequest

class IntegrityModule(reactContext: ReactApplicationContext) :
        ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "IntegrityModule"

  @ReactMethod
  fun getIntegrityToken(nonce: String, promise: Promise) {
    val activity: Activity? = reactApplicationContext.currentActivity
    if (activity == null) {
      promise.reject("NO_ACTIVITY", "Activity is null")
      return
    }

    val integrityManager = IntegrityManagerFactory.create(activity.applicationContext)

    val request = IntegrityTokenRequest.builder().setNonce(nonce).build()

    integrityManager
            .requestIntegrityToken(request)
            .addOnSuccessListener { response -> promise.resolve(response.token()) }
            .addOnFailureListener { e ->
              Log.e("IntegrityModule", "Error requesting integrity token", e)
              promise.reject("INTEGRITY_ERROR", e.message, e)
            }
  }
}
