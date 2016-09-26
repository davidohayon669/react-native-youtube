package com.inprogress.reactnativeyoutube;

import android.app.Activity;
import android.app.FragmentTransaction;
import android.content.Context;
import android.view.View;
import android.widget.RelativeLayout;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.youtube.player.YouTubePlayerFragment;


public class YouTubeView extends RelativeLayout {

    Activity mMainActivity;
    YouTubePlayerController youtubeController;
    private YouTubePlayerFragment youTubePlayerFragment;
    public static String youtube_key;

    public YouTubeView(Context context, Activity mainActivity) {
        super(context);
        mMainActivity = mainActivity;
        init();
    }


    public void init() {
        inflate(getContext(), R.layout.youtube_layout, this);

        youTubePlayerFragment = (YouTubePlayerFragment) mMainActivity.getFragmentManager()
                .findFragmentById(R.id.youtubeplayerfragment);
        youtubeController = new YouTubePlayerController(mMainActivity, YouTubeView.this);
    }


    @Override
    protected void onDetachedFromWindow() {
        try {
            youTubePlayerFragment = (YouTubePlayerFragment) mMainActivity.getFragmentManager()
                    .findFragmentById(R.id.youtubeplayerfragment);
            FragmentTransaction ft = mMainActivity.getFragmentManager().beginTransaction();
            ft.remove(youTubePlayerFragment);
            ft.commit();
        } catch (Exception e) {
        }
        super.onDetachedFromWindow();
    }

    @ReactMethod
    public void seekTo(int second) {
        youtubeController.seekTo(second);
    }

    public int getProgress() {
        return youtubeController.getProgress();
    }

    public int getDuration() {
        return youtubeController.getDuration();
    }

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

    public void didChangeFullscreen(boolean isFullscreen) {
        WritableMap event = Arguments.createMap();
        event.putInt("target", getId());
        event.putBoolean("isFullscreen", isFullscreen);

        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "fullscreen", event);
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


    public void setVideoId(String str) {
        youtubeController.setVideoId(str);
    }

    public void setInline(Boolean bool) {
        youtubeController.setPlayInline(bool);
    }

    public void setShowInfo(Boolean bool) {
        youtubeController.setShowInfo(bool);
    }

    public void setModestbranding(Boolean bool) {
        youtubeController.setModestBranding(bool);
    }

    public void setControls(Integer nb) {
        youtubeController.setControls(nb);
    }

    public void setPlay(Boolean bool) {
        youtubeController.setPlay(bool);
    }

    public void setHidden(Boolean bool) {
        youtubeController.setHidden(bool);
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


    public void setFullscreen(Boolean fullscreen) {
        youtubeController.setFullscreen(fullscreen);
    }


}
