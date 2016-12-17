package com.inprogress.reactnativeyoutube;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;


public class YouTubeModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mReactContext;

    public YouTubeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "YouTubeModule";
    }

    @ReactMethod
    public void videosIndex(final int reactTag, final Promise promise) {
        try {
            UIManagerModule uiManager = mReactContext.getNativeModule(UIManagerModule.class);
            uiManager.addUIBlock(new UIBlock() {
                public void execute (NativeViewHierarchyManager nvhm) {
                    YouTubeView youTubeView = (YouTubeView) nvhm.resolveView(reactTag);
                    YouTubeManager youTubeManager = (YouTubeManager) nvhm.resolveViewManager(reactTag);
                    int index = youTubeManager.getVideosIndex(youTubeView);
                    promise.resolve(index);
                }
            });
        } catch (IllegalViewOperationException e) {
            promise.reject("YouTubeModule.videosIndex() failed", e);
        }
    }
}
