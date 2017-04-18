package com.inprogress.reactnativeyoutube;

import android.app.FragmentManager;
import android.util.Log;
import android.widget.FrameLayout;

import com.google.android.youtube.player.YouTubePlayerFragment;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;


public class YouTubeView extends FrameLayout {

    private YouTubePlayerController mYoutubeController;
    private YouTubePlayerFragment mYouTubePlayerFragment;

    public YouTubeView(ReactContext context) {
        super(context);
        init();
    }

    private ReactContext getReactContext() {
        return (ReactContext) getContext();
    }

    public void init() {
        inflate(getContext(), R.layout.youtube_layout, this);
        mYouTubePlayerFragment = YouTubePlayerFragment.newInstance();
        mYoutubeController = new YouTubePlayerController(this);
    }

    @Override
    protected void onAttachedToWindow() {
        FragmentManager fragmentManager = getReactContext().getCurrentActivity().getFragmentManager();
        fragmentManager.beginTransaction().add(getId(), mYouTubePlayerFragment).commit();
    }

    @Override
    protected void onDetachedFromWindow() {
        FragmentManager fragmentManager = getReactContext().getCurrentActivity().getFragmentManager();
        if (mYouTubePlayerFragment != null) {
            fragmentManager.beginTransaction().remove(mYouTubePlayerFragment).commit();
        }
    }

    public void seekTo(int second) {
        mYoutubeController.seekTo(second);
    }

    public int getCurrentTime() {
        return mYoutubeController.getCurrentTime();
    }

    public void nextVideo() {
        mYoutubeController.nextVideo();
    }

    public void previousVideo() {
        mYoutubeController.previousVideo();
    }

    public void playVideoAt(int index) {
        mYoutubeController.playVideoAt(index);
    }

    public int getVideosIndex() {
        return mYoutubeController.getVideosIndex();
    }

    public void receivedError(String param) {
        WritableMap event = Arguments.createMap();
        ReactContext reactContext = (ReactContext) getContext();
        event.putString("error", param);
        event.putInt("target", getId());
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "error", event);
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

    public void didChangeToQuality(String param) {
        WritableMap event = Arguments.createMap();
        event.putString("quality", param);
        event.putInt("target", getId());
        ReactContext reactContext = (ReactContext) getContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "quality", event);
    }

    public void didChangeToFullscreen(boolean isFullscreen) {
        WritableMap event = Arguments.createMap();
        ReactContext reactContext = (ReactContext) getContext();
        event.putBoolean("isFullscreen", isFullscreen);
        event.putInt("target", getId());
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "fullscreen", event);
    }

    public void setApiKey(String apiKey) {
        try {
            mYouTubePlayerFragment.initialize(apiKey, mYoutubeController);
        } catch (Exception e) {
            receivedError(e.getMessage());
        }
    }

    public void setVideoId(String str) {
        mYoutubeController.setVideoId(str);
    }

    public void setVideoIds(ReadableArray arr) {
        mYoutubeController.setVideoIds(arr);
    }

    public void setPlaylistId(String str) {
        mYoutubeController.setPlaylistId(str);
    }

    public void setPlay(boolean bool) {
        mYoutubeController.setPlay(bool);
    }

    public void setLoop(boolean bool) {
        mYoutubeController.setLoop(bool);
    }

    public void setFullscreen(boolean bool) {
        mYoutubeController.setFullscreen(bool);
    }

    public void setControls(int nb) {
        mYoutubeController.setControls(nb);
    }

    public void setShowFullscreenButton(boolean bool) {
        mYoutubeController.setShowFullscreenButton(bool);
    }
}
