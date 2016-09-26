package com.inprogress.reactnativeyoutube;

import android.app.Activity;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;


public class ReactNativeYouTube implements ReactPackage {

    Activity mMainActivity;
    YouTubeManager youTubeManager;

    public ReactNativeYouTube(Activity activity) {
        mMainActivity = activity;
        //youTubeManager = new YouTubeManager(mMainActivity);
    }

    @Override
    public List<NativeModule> createNativeModules(
            ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        YouTubeModule youTubeModule = new YouTubeModule(reactContext, youTubeManager);
        modules.add(youTubeModule);
        return modules;
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
                youTubeManager
        );
    }
}
