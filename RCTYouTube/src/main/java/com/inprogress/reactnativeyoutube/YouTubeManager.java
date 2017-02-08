package com.inprogress.reactnativeyoutube;

import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;


public class YouTubeManager extends SimpleViewManager<YouTubeView> {

    public static final String REACT_CLASS = "ReactYouTube";

    public YouTubeView mYouTubeView;

    public static final String PROP_VIDEO_ID = "videoId";
    public static final String PROP_API_KEY = "apiKey";
    public static final String PROP_INLINE = "playsInline";
    public static final String PROP_SHOW_INFO = "showinfo";
    public static final String PROP_MODESTBRANDING = "modestbranding";
    public static final String PROP_CONTROLS = "controls";
    public static final String PROP_PLAY = "play";
    public static final String PROP_HIDDEN = "hidden";
    public static final String PROP_REL = "rel";
    public static final String PROP_LOOP = "loop";
    public static final String PROP_FULLSCREEN = "fs";


    public YouTubeManager() {

    }

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected YouTubeView createViewInstance(ThemedReactContext themedReactContext) {
        mYouTubeView = new YouTubeView(themedReactContext, themedReactContext.getCurrentActivity());
        return mYouTubeView;
    }

    @Override
    public
    @Nullable
    Map getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
                "error",
                MapBuilder.of("registrationName", "onYoutubeVideoError"),
                "ready",
                MapBuilder.of("registrationName", "onYoutubeVideoReady"),
                "state",
                MapBuilder.of("registrationName", "onYoutubeVideoChangeState"),
                "quality",
                MapBuilder.of("registrationName", "onYoutubeVideoChangeQuality")
        );
    }

    @ReactMethod
    public void seekTo(Integer seconds) {
        mYouTubeView.seekTo(seconds);
    }

    @ReactProp(name = PROP_VIDEO_ID)
    public void setPropVideoId(
            YouTubeView view, @Nullable String param) {
        //Log.e(PROP_VIDEO_ID,""+param);
        view.setVideoId(param);
    }

    @ReactProp(name = PROP_API_KEY)
    public void setApiKey(
            YouTubeView view, @Nullable String param) {
        //Log.e(PROP_API_KEY,""+param);
        view.setApiKey(param);
    }

    @ReactProp(name = PROP_PLAY)
    public void setPropPlay(
            YouTubeView view, @Nullable Boolean param) {
        Log.e(PROP_PLAY,""+param);
        view.setPlay(param);
    }

    @ReactProp(name = PROP_HIDDEN)
    public void setPropHidden(
            YouTubeView view, @Nullable Boolean param) {
        //Log.e(PROP_HIDDEN,""+param);
        view.setHidden(param);
    }

    @ReactProp(name = PROP_INLINE)
    public void setPropInline(
            YouTubeView view, @Nullable Boolean param) {
        //Log.e(PROP_INLINE,""+param);
        view.setInline(param);
    }

    @ReactProp(name = PROP_REL)
    public void setPropRel(
            YouTubeView view, @Nullable Boolean param) {
        //Log.e(PROP_REL,""+param);
        view.setRelated(param);
    }

    @ReactProp(name = PROP_MODESTBRANDING)
    public void setPropModestbranding(
            YouTubeView view, @Nullable Boolean param) {
        //Log.e(PROP_MODESTBRANDING,""+param);
        view.setModestbranding(param);
    }

    @ReactProp(name = PROP_LOOP)
    public void setPropLoop(
            YouTubeView view, @Nullable Boolean param) {
        //Log.e(PROP_LOOP,""+param);
        view.setLoop(param);
    }

    @ReactProp(name = PROP_CONTROLS)
    public void setPropControls(
            YouTubeView view, @Nullable Integer param) {
        //Log.e(PROP_CONTROLS,""+param);
        view.setControls(param);
    }

    @ReactProp(name = PROP_SHOW_INFO)
    public void setPropShowInfo(
            YouTubeView view, @Nullable Boolean param) {
        //Log.e(PROP_SHOW_INFO,""+param);
        view.setShowInfo(param);
    }

    @ReactProp(name = PROP_FULLSCREEN)
    public void setPropFullscreen(
            YouTubeView view, @Nullable Boolean param) {
        //Log.e(PROP_FULLSCREEN,""+param);
        view.setFullscreen(param);
    }
}