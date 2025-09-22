package com.wellfarecanteen  

import android.content.ContentValues
import android.os.Environment
import android.provider.MediaStore
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import com.facebook.react.bridge.*
import java.io.OutputStream

class SaveImageModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String = "SaveImageModule"

    @ReactMethod
fun saveBase64Image(base64: String, fileName: String, promise: Promise) {
    try {
        val imageBytes = android.util.Base64.decode(base64, android.util.Base64.DEFAULT)
        val bitmap: Bitmap = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)

        val contentValues = ContentValues().apply {
            put(MediaStore.Images.Media.DISPLAY_NAME, "$fileName.png")
            put(MediaStore.Images.Media.MIME_TYPE, "image/png")
            put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + "/QRCode")
            put(MediaStore.Images.Media.IS_PENDING, 1)
        }

        val contentResolver = reactApplicationContext.contentResolver
        val uri = contentResolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, contentValues)

        uri?.let {
            val stream: OutputStream? = contentResolver.openOutputStream(it)
            stream?.let { output ->
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, output)
                output.close()
            }

            contentValues.clear()
            contentValues.put(MediaStore.Images.Media.IS_PENDING, 0)
            contentResolver.update(it, contentValues, null, null)

            promise.resolve("Saved to gallery successfully!")
        } ?: promise.reject("SAVE_ERROR", "Could not create media URI")
    } catch (e: Exception) {
        promise.reject("SAVE_ERROR", e.localizedMessage)
    }
}

}
