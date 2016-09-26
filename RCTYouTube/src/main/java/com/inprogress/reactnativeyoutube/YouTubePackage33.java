package com.inprogress.reactnativeyoutube;

import android.app.Activity;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by alex on 21.09.16.
 */
public class YouTubePackage33 implements ReactPackage {
    private YouTubeManager youTubeManager;

    public YouTubePackage33() {
        this.youTubeManager = new YouTubeManager();
    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        YouTubeModule youTubeModule = new YouTubeModule(reactContext, youTubeManager);

        return Arrays.<NativeModule>asList(
                youTubeModule
        );
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(youTubeManager);
    }
}
