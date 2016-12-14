package com.inprogress.reactnativeyoutube;

import android.app.FragmentManager;
import android.widget.FrameLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import com.google.android.youtube.player.YouTubePlayerFragment;


public class YouTubeView extends FrameLayout {

    YouTubePlayerController youtubeController;
    private YouTubePlayerFragment youTubePlayerFragment;

    public YouTubeView(ReactContext context) {
        super(context);
        init();
    }

    private ReactContext getReactContext() {
        return (ReactContext) getContext();
    }

    public void init() {
        inflate(getContext(), R.layout.youtube_layout, this);
        youTubePlayerFragment = YouTubePlayerFragment.newInstance();
        youtubeController = new YouTubePlayerController(this);
    }

    @Override
    protected void onAttachedToWindow() {
        FragmentManager fragmentManager = getReactContext().getCurrentActivity().getFragmentManager();
        fragmentManager.beginTransaction().add(getId(), youTubePlayerFragment).commit();
    }

    @Override
    protected void onDetachedFromWindow() {
        FragmentManager fragmentManager = getReactContext().getCurrentActivity().getFragmentManager();
        if (youTubePlayerFragment != null) {
            fragmentManager.beginTransaction().remove(youTubePlayerFragment).commit();
        }
    }

    public void seekTo(int second) {
        youtubeController.seekTo(second);
    }

    public void nextVideo() {
        youtubeController.nextVideo();
    }

    public void previousVideo() {
        youtubeController.previousVideo();
    }

    public void playVideoAt(int index) {
        youtubeController.playVideoAt(index);
    }

    public int getVideosIndex() {
        return youtubeController.getVideosIndex();
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

    public void setApiKey(String apiKey) {
        try {
            youTubePlayerFragment.initialize(apiKey, youtubeController);
        } catch (Exception e) {
            receivedError(e.getMessage());
        }
    }

    public void setVideoId(String str) {
        youtubeController.setVideoId(str);
    }

    public void setVideoIds(ReadableArray arr) {
        youtubeController.setVideoIds(arr);
    }

    public void setPlaylistId(String str) {
        youtubeController.setPlaylistId(str);
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

    public void setLoop(Boolean loop) {
        youtubeController.setLoop(loop);
    }

    public void setRelated(Boolean related) {
        youtubeController.setRelated(related);
    }
}
