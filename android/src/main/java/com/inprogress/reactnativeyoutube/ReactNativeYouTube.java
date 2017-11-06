package com.inprogress.reactnativeyoutube;

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

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        YouTubeModule youTubeModule = new YouTubeModule(reactContext);
        modules.add(youTubeModule);
        YouTubeStandaloneModule youTubeStandaloneModule = new YouTubeStandaloneModule(reactContext);
        modules.add(youTubeStandaloneModule);
        return modules;
    }

    // Backwards compatability for RN < 0.47
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Arrays.<ViewManager>asList(
            new YouTubeManager()
        );
    }
}
