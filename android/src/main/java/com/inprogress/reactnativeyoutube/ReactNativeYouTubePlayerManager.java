package com.inprogress.reactnativeyoutube;

import androidx.annotation.Nullable;

import android.util.Log;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.Map;


public class ReactNativeYouTubePlayerManager extends SimpleViewManager<ReactNativeYouTubePlayerView> {

    private static final int COMMAND_SEEK_TO = 1;
    private static final int COMMAND_NEXT_VIDEO = 2;
    private static final int COMMAND_PREVIOUS_VIDEO = 3;
    private static final int COMMAND_PLAY_VIDEO_AT = 4;

    @Override
    public String getName() {
        return "ReactYouTube";
    }

    @Override
    protected ReactNativeYouTubePlayerView createViewInstance(ThemedReactContext themedReactContext) {
        return new ReactNativeYouTubePlayerView(themedReactContext);
    }

    @Override
    public Map<String,Integer> getCommandsMap() {
        return MapBuilder.of(
            "seekTo",
            COMMAND_SEEK_TO,
            "nextVideo",
            COMMAND_NEXT_VIDEO,
            "previousVideo",
            COMMAND_PREVIOUS_VIDEO,
            "playVideoAt",
            COMMAND_PLAY_VIDEO_AT
        );
    }

    @Override
    public void receiveCommand(ReactNativeYouTubePlayerView view, int commandType, @Nullable ReadableArray args) {
        switch (commandType) {
            case COMMAND_SEEK_TO:
                double dub = args.getDouble(0);

                Log.w("DAVID", "playVideoAt(): " + String.valueOf(dub));

                view.seekTo((float) dub);
                return;

            case COMMAND_NEXT_VIDEO:
                view.nextVideo();
                return;

            case COMMAND_PREVIOUS_VIDEO:
                view.previousVideo();
                return;

            case COMMAND_PLAY_VIDEO_AT:
                view.playVideoAt(args.getInt(0));
                return;

            default:
                throw new IllegalArgumentException(
                    String.format("Unsupported command %d received by %s.", commandType, getClass().getSimpleName())
                );
        }
    }

    @Override
    public @Nullable Map <String,Object> getExportedCustomDirectEventTypeConstants() {
        return MapBuilder.of(
            "error",
            (Object) MapBuilder.of("registrationName", "onYouTubeError"),
            "ready",
            (Object) MapBuilder.of("registrationName", "onYouTubeReady"),
            "state",
            (Object) MapBuilder.of("registrationName", "onYouTubeChangeState"),
            "quality",
            (Object) MapBuilder.of("registrationName", "onYouTubeChangeQuality"),
            "fullscreen",
            (Object) MapBuilder.of("registrationName", "onYouTubeChangeFullscreen")
        );
    }

    public float getCurrentTime(ReactNativeYouTubePlayerView view) {
        return view.getCurrentTime();
    }

    public float getDuration(ReactNativeYouTubePlayerView view) {
        return view.getDuration();
    }

    public int getVideosIndex(ReactNativeYouTubePlayerView view) {
        return view.getVideosIndex();
    }

    @ReactProp(name = "videoId")
    public void setPropVideoId(ReactNativeYouTubePlayerView view, @Nullable String param) {
        view.setVideoId(param);
    }

    @ReactProp(name = "videoIds")
    public void setPropVideoIds(ReactNativeYouTubePlayerView view, @Nullable ReadableArray param) {
        view.setVideoIds(param);
    }

    @ReactProp(name = "play")
    public void setPropPlay(ReactNativeYouTubePlayerView view, @Nullable boolean param) {
        view.setPlay(param);
    }

    @ReactProp(name = "loop")
    public void setPropLoop(ReactNativeYouTubePlayerView view, @Nullable boolean param) {
        view.setLoop(param);
    }
}
