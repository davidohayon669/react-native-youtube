package com.inprogress.reactnativeyoutube;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.NativeViewHierarchyManager;
import com.facebook.react.uimanager.UIBlock;
import com.facebook.react.uimanager.UIManagerModule;

import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ActivityEventListener;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.ResolveInfo;
import com.google.android.youtube.player.YouTubeInitializationResult;
import com.google.android.youtube.player.YouTubeStandalonePlayer;

import java.util.List;

public class YouTubeModule extends ReactContextBaseJavaModule {

    private ReactApplicationContext mReactContext;

    private static final int REQ_START_STANDALONE_PLAYER = 1;
    private static final int REQ_RESOLVE_SERVICE_MISSING = 2;
    private static final String E_FAILED_TO_SHOW_PLAYER = "E_FAILED_TO_SHOW_PLAYER";
    private static final String E_PLAYER_ERROR = "E_PLAYER_ERROR";
    private static final String E_ACTIVITY_DOES_NOT_EXIST = "E_ACTIVITY_DOES_NOT_EXIST";

    private Promise mPickerPromise;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

      @Override
      public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
        if (requestCode == REQ_START_STANDALONE_PLAYER) {
          if (mPickerPromise != null) {
            if (resultCode != Activity.RESULT_OK) {
              YouTubeInitializationResult errorReason =
                  YouTubeStandalonePlayer.getReturnedInitializationResult(intent);
              if (errorReason.isUserRecoverableError()) {
                  errorReason.getErrorDialog(activity, 0).show();
                  mPickerPromise.reject(E_PLAYER_ERROR);
              } else {
                  String errorMessage =
                      String.format("There was an error initializing the YouTubePlayer (%1$s)", errorReason.toString());
                  mPickerPromise.reject(E_PLAYER_ERROR, errorMessage);
              }
            } else {
              mPickerPromise.resolve(null);
            }

            mPickerPromise = null;
          }
        }
      }
    };

    public YouTubeModule(ReactApplicationContext reactContext) {
        super(reactContext);
        mReactContext = reactContext;

        mReactContext.addActivityEventListener(mActivityEventListener);
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
            promise.reject("YouTubeModule.currentTime() failed", e);
        }
    }

    @ReactMethod
    public void playVideo(final String apiKey, final String video_id, final boolean autoplay, final boolean lightboxMode, final int startTimeMillis, final Promise promise) {
      Activity currentActivity = getCurrentActivity();

      if (currentActivity == null) {
        promise.reject(E_ACTIVITY_DOES_NOT_EXIST, "Activity doesn't exist");
        return;
      }

      // Store the promise to resolve/reject when picker returns data
      mPickerPromise = promise;

      try {
        final Intent intent = YouTubeStandalonePlayer.createVideoIntent(
          currentActivity, apiKey, video_id, startTimeMillis, autoplay, lightboxMode);

        if (intent != null) {
          if (canResolveIntent(intent)) {
            currentActivity.startActivityForResult(intent, REQ_START_STANDALONE_PLAYER);
          } else {
            // Could not resolve the intent - must need to install or update the YouTube API service.
            YouTubeInitializationResult.SERVICE_MISSING
                .getErrorDialog(currentActivity, REQ_RESOLVE_SERVICE_MISSING).show();
          }
        }

      } catch (Exception e) {
        mPickerPromise.reject(E_FAILED_TO_SHOW_PLAYER, e);
        mPickerPromise = null;
      }
    }

    private boolean canResolveIntent(Intent intent) {
      List<ResolveInfo> resolveInfo = mReactContext.getPackageManager().queryIntentActivities(intent, 0);
      return resolveInfo != null && !resolveInfo.isEmpty();
    }
}
