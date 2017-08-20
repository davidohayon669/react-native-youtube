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

    private static final String E_MODULE_ERROR = "E_MODULE_ERROR";

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
            promise.reject(E_MODULE_ERROR, e);
        }
    }

    @ReactMethod
    public void currentTime(final int reactTag, final Promise promise) {
        try {
            UIManagerModule uiManager = mReactContext.getNativeModule(UIManagerModule.class);
            uiManager.addUIBlock(new UIBlock() {
                public void execute (NativeViewHierarchyManager nvhm) {
                    YouTubeView youTubeView = (YouTubeView) nvhm.resolveView(reactTag);
                    YouTubeManager youTubeManager = (YouTubeManager) nvhm.resolveViewManager(reactTag);
                    int currentTime = youTubeManager.getCurrentTime(youTubeView);
                    promise.resolve(currentTime);
                }
            });
        } catch (IllegalViewOperationException e) {
            promise.reject(E_MODULE_ERROR, e);
        }
    }

    @ReactMethod
    public void duration(final int reactTag, final Promise promise) {
        try {
            UIManagerModule uiManager = mReactContext.getNativeModule(UIManagerModule.class);
            uiManager.addUIBlock(new UIBlock() {
                public void execute (NativeViewHierarchyManager nvhm) {
                    YouTubeView youTubeView = (YouTubeView) nvhm.resolveView(reactTag);
                    YouTubeManager youTubeManager = (YouTubeManager) nvhm.resolveViewManager(reactTag);
                    int duration = youTubeManager.getDuration(youTubeView);
                    promise.resolve(duration);
                }
            });
        } catch (IllegalViewOperationException e) {
            promise.reject(E_MODULE_ERROR, e);
        }
    }
}
