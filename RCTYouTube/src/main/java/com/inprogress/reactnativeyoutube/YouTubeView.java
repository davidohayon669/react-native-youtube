package com.inprogress.reactnativeyoutube;

import android.app.Activity;
import android.app.FragmentTransaction;
import android.content.Context;
import android.widget.RelativeLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.youtube.player.YouTubePlayerFragment;
import com.facebook.react.bridge.ReactApplicationContext;


public class YouTubeView extends RelativeLayout {

    YouTubePlayerController youtubeController;
    private YouTubePlayerFragment youTubePlayerFragment;
    public static String youtube_key;

    private Activity mMainActivity;
    private ReactApplicationContext mCtx;

    private Boolean mHidden;
    private Boolean mPlay;
    private Boolean mPlaysInline;
    private String mVideoId;

    public YouTubeView(Context context, ReactApplicationContext appCtx) {
        super(context);
        mCtx = appCtx;
        init();
    }

    public void init() {
        Activity mainActivity = mCtx.getCurrentActivity();
        if(mainActivity != null){
            inflate(getContext(), R.layout.youtube_layout, this);
            youTubePlayerFragment = (YouTubePlayerFragment) mainActivity.getFragmentManager()
                    .findFragmentById(R.id.youtubeplayerfragment);
            youtubeController = new YouTubePlayerController(mainActivity, YouTubeView.this);    
        }        
    }

    @Override
    protected void onDetachedFromWindow() {
        try {
            Activity mainActivity = mCtx.getCurrentActivity();
            youTubePlayerFragment = (YouTubePlayerFragment) mainActivity.getFragmentManager()
                    .findFragmentById(R.id.youtubeplayerfragment);
            FragmentTransaction ft = mainActivity.getFragmentManager().beginTransaction();
            ft.remove(youTubePlayerFragment);
            ft.commit();
        } catch (Exception e) {
        }
        super.onDetachedFromWindow();
    }

    public void seekTo(int second) {
        youtubeController.seekTo(second);
    }

    // Player events

    public void playerViewDidBecomeReady() {
        WritableMap event = Arguments.createMap();
        ReactContext reactContext = (ReactContext) getContext();
        event.putInt("target", getId());
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "ready", event);
    }

    public void didChangeToState(String param) {
        WritableMap event = Arguments.createMap();
        event.putString("state", param);
        event.putInt("target", getId());
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "state", event);
    }

    public void didChangeToQuality(String param) {
        WritableMap event = Arguments.createMap();
        event.putString("quality", param);
        event.putInt("target", getId());
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "quality", event);
    }

    public void didPlayTime(String current, String duration) {
        WritableMap event = Arguments.createMap();
        event.putString("currentTime", current);
        event.putString("duration", duration);
        event.putInt("target", getId());
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "progress", event);
    }

    public void receivedError(String param) {
        WritableMap event = Arguments.createMap();
        ReactContext reactContext = (ReactContext) getContext();
        event.putString("error", param);
        event.putInt("target", getId());
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "error", event);
    }

    // Player param updates

    public void setVideoId(String videoId) {
        youtubeController.setVideoId(videoId);
    }

    public void setInline(Boolean playsInline) {
        youtubeController.setPlayInline(playsInline);
    }

    public void setShowInfo(Boolean showInfo) {
        youtubeController.setShowInfo(showInfo);
    }

    public void setModestbranding(Boolean modestBranding) {
        youtubeController.setModestBranding(modestBranding);
    }

    public void setControls(Integer controlsType) {
        youtubeController.setControls(controlsType);
    }

    public void setPlay(Boolean play) {
        youtubeController.setPlay(play);
    }

    public void setHidden(Boolean hidden) {
        youtubeController.setHidden(hidden);
    }

    public void setApiKey(String apiKey){
        youtube_key = apiKey;
        youTubePlayerFragment.initialize(youtube_key, youtubeController);
    }

    public void setLoop(Boolean loop) {
        youtubeController.setLoop(loop);
    }

    public void setRelated(Boolean related) {
        youtubeController.setRelated(related);
    }
}
