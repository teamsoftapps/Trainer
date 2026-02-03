package com.trainer   // ⚠️ use SAME package as MainApplication

import com.facebook.react.bridge.*
import com.google.android.gms.location.*

class LocationModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "LocationModule"
    }

    @ReactMethod
    fun getCurrentLocation(promise: Promise) {

        val fusedClient =
            LocationServices.getFusedLocationProviderClient(reactApplicationContext)

        fusedClient.getCurrentLocation(
            Priority.PRIORITY_HIGH_ACCURACY,
            null
        ).addOnSuccessListener { location ->

            if (location != null) {
                val map = Arguments.createMap()
                map.putDouble("lat", location.latitude)
                map.putDouble("lng", location.longitude)
                promise.resolve(map)
            } else {
                promise.reject("NO_LOCATION", "Location unavailable")
            }

        }.addOnFailureListener {
            promise.reject("ERROR", it.message)
        }
    }
}
