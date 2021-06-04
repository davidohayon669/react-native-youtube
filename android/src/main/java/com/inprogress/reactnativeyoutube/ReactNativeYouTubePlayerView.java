package com.inprogress.reactnativeyoutube;

import android.app.FragmentManager;
import android.os.Build;
import android.os.Parcelable;
import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import android.widget.FrameLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.views.YouTubePlayerView;

import java.util.ArrayList;

public class ReactNativeYouTubePlayerView extends FrameLayout {

    private YouTubePlayerView youTubePlayerView;
    private ReactNativeYouTubePlayerController mPlayerController;

    public ReactNativeYouTubePlayerView(ReactContext context) {
        super(context);

        YouTubePlayerView youTubePlayerView = new YouTubePlayerView(context);
        addView(youTubePlayerView);

        // getLifecycle().addObserver(youTubePlayerView);

        mPlayerController = new ReactNativeYouTubePlayerController(this);

        youTubePlayerView.addYouTubePlayerListener(mPlayerController);
    }

    public ReactContext getReactContext() {
        return (ReactContext) getContext();
    }

    public void seekTo(float second) {
        mPlayerController.seekTo(second);
    }

    public void nextVideo() {
        mPlayerController.nextVideo();
    }

    public void previousVideo() {
        mPlayerController.previousVideo();
    }

    public void playVideoAt(int index) {
        mPlayerController.playVideoAt(index);
    }

    public float getCurrentTime() {
        return mPlayerController.getCurrentTime();
    }

    public float getDuration() {
        return mPlayerController.getDuration();
    }

    public int getVideosIndex() {
        return mPlayerController.getVideosIndex();
    }

    public void receivedError(String param) {
        WritableMap event = Arguments.createMap();
        ReactContext reactContext = getReactContext();
        event.putString("error", param);
        event.putInt("target", getId());
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "error", event);
    }

    public void playerViewDidBecomeReady() {
        WritableMap event = Arguments.createMap();
        ReactContext reactContext = getReactContext();
        event.putInt("target", getId());
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "ready", event);
    }

    public void didChangeToState(String param) {
        WritableMap event = Arguments.createMap();
        event.putString("state", param);
        event.putInt("target", getId());
        ReactContext reactContext = getReactContext();
        reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "state", event);
    }

    // public void didChangeToQuality(String param) {
    //     WritableMap event = Arguments.createMap();
    //     event.putString("quality", param);
    //     event.putInt("target", getId());
    //     ReactContext reactContext = getReactContext();
    //     reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "quality", event);
    // }

    // public void didChangeToFullscreen(boolean isFullscreen) {
    //     WritableMap event = Arguments.createMap();
    //     ReactContext reactContext = getReactContext();
    //     event.putBoolean("isFullscreen", isFullscreen);
    //     event.putInt("target", getId());
    //     reactContext.getJSModule(RCTEventEmitter.class).receiveEvent(getId(), "fullscreen", event);
    // }

    public void setVideoId(String videoId) {
        mPlayerController.setVideoId(videoId);
    }  

    public void setVideoIds(ReadableArray _videoIds) {
        ArrayList videoIds = new ArrayList<String>();
        
        for (int i = 0; i < _videoIds.size(); i++) {
            videoIds.add(_videoIds.getString(i));
        }

        mPlayerController.setVideoIds(videoIds);
    }

    public void setPlay(boolean play) {
        mPlayerController.setPlay(play);
    }

    public void setLoop(boolean loop) {
        mPlayerController.setLoop(loop);
    }
}
