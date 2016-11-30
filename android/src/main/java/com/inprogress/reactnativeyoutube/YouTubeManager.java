package com.inprogress.reactnativeyoutube;

import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.infer.annotation.Assertions;

import java.util.Map;


public class YouTubeManager extends SimpleViewManager<YouTubeView> {

    public static final String REACT_CLASS = "ReactYouTube";

    public YouTubeView mYouTubeView;

    public static final int COMMAND_SEEK_TO = 1;
    public static final int COMMAND_NEXT_VIDEO = 2;
    public static final int COMMAND_PREVIOUS_VIDEO = 3;
    public static final int COMMAND_PLAY_VIDEO_AT = 4;

    public static final String PROP_API_KEY = "apiKey";
    public static final String PROP_VIDEO_ID = "videoId";
    public static final String PROP_VIDEO_IDS = "videoIds";
    public static final String PROP_PLAYLIST = "playlist";
    public static final String PROP_INLINE = "playInline";
    public static final String PROP_SHOW_INFO = "showinfo";
    public static final String PROP_MODESTBRANDING = "modestbranding";
    public static final String PROP_CONTROLS = "controls";
    public static final String PROP_PLAY = "play";
    public static final String PROP_HIDDEN = "hidden";
    public static final String PROP_REL = "rel";
    public static final String PROP_LOOP = "loop";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    protected YouTubeView createViewInstance(ThemedReactContext themedReactContext) {
        mYouTubeView = new YouTubeView(themedReactContext);
        return mYouTubeView;
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
    public void receiveCommand(YouTubeView view, int commandType, @Nullable ReadableArray args) {
        Assertions.assertNotNull(view);
        Assertions.assertNotNull(args);
        switch (commandType) {
            case COMMAND_SEEK_TO: {
                view.seekTo(args.getInt(0));
                return;
            }
            case COMMAND_NEXT_VIDEO: {
                view.nextVideo();
                return;
            }
            case COMMAND_PREVIOUS_VIDEO: {
                view.previousVideo();
                return;
            }
            case COMMAND_PLAY_VIDEO_AT: {
                view.playVideoAt(args.getInt(0));
                return;
            }
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
            (Object) MapBuilder.of("registrationName", "onError"),
            "ready",
            (Object) MapBuilder.of("registrationName", "onReady"),
            "state",
            (Object) MapBuilder.of("registrationName", "onChangeState"),
            "quality",
            (Object) MapBuilder.of("registrationName", "onChangeQuality")
        );
    }

    public int getVideosIndex(YouTubeView view) {
        return view.getVideosIndex();
    }

    @ReactProp(name = PROP_API_KEY)
    public void setApiKey(YouTubeView view, @Nullable String param) {
        view.setApiKey(param);
    }

    @ReactProp(name = PROP_VIDEO_ID)
    public void setPropVideoId(YouTubeView view, @Nullable String param) {
        view.setVideoId(param);
    }

    @ReactProp(name = PROP_VIDEO_IDS)
    public void setPropVideoIds(YouTubeView view, @Nullable ReadableArray param) {
        view.setVideoIds(param);
    }

    @ReactProp(name = PROP_PLAYLIST)
    public void setPropPlaylist(YouTubeView view, @Nullable String param) {
        view.setPlaylist(param);
    }

    @ReactProp(name = PROP_PLAY)
    public void setPropPlay(YouTubeView view, @Nullable Boolean param) {
        view.setPlay(param);
    }

    @ReactProp(name = PROP_HIDDEN)
    public void setPropHidden(YouTubeView view, @Nullable Boolean param) {
        view.setHidden(param);
    }

    @ReactProp(name = PROP_INLINE)
    public void setPropInline(YouTubeView view, @Nullable Boolean param) {
        view.setInline(param);
    }

    @ReactProp(name = PROP_REL)
    public void setPropRel(YouTubeView view, @Nullable Boolean param) {
        view.setRelated(param);
    }

    @ReactProp(name = PROP_MODESTBRANDING)
    public void setPropModestbranding(YouTubeView view, @Nullable Boolean param) {
        view.setModestbranding(param);
    }

    @ReactProp(name = PROP_LOOP)
    public void setPropLoop(YouTubeView view, @Nullable Boolean param) {
        view.setLoop(param);
    }

    @ReactProp(name = PROP_CONTROLS)
    public void setPropControls(YouTubeView view, @Nullable Integer param) {
        view.setControls(param);
    }

    @ReactProp(name = PROP_SHOW_INFO)
    public void setPropShowInfo(YouTubeView view, @Nullable Boolean param) {
        view.setShowInfo(param);
    }
}
