package com.inprogress.reactnativeyoutube;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class YouTubeModule extends ReactContextBaseJavaModule {

    YouTubeManager mYouTubeManager;

    public YouTubeModule(ReactApplicationContext reactContext, YouTubeManager youTubeManager) {
        super(reactContext);
        mYouTubeManager = youTubeManager;
    }

    @Override
    public String getName() {
        return "YouTubeModule";
    }

    @ReactMethod
    public void seekTo(Integer seconds) {
        mYouTubeManager.seekTo(seconds);
    }

    @ReactMethod
    public void getProgress(Callback callback) {
        int progress = mYouTubeManager.getProgress();
        int duration = mYouTubeManager.getDuration();
        callback.invoke(progress, duration);
    }
}
