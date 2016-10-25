package com.inprogress.reactnativeyoutube;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

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


}
