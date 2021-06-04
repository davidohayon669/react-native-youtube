package com.inprogress.reactnativeyoutube;

// import android.view.View;
// import android.view.ViewGroup;
// import android.widget.ProgressBar;
// import android.os.Handler;

import android.util.Log;

import androidx.annotation.NonNull;

import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.YouTubePlayer;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.PlayerConstants;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.listeners.AbstractYouTubePlayerListener;
import com.pierfrancescosoffritti.androidyoutubeplayer.core.player.utils.YouTubePlayerTracker;

// import com.facebook.react.bridge.ReadableArray;

import java.util.ArrayList;
import java.util.List;
// import java.lang.Runnable;


public class ReactNativeYouTubePlayerController extends AbstractYouTubePlayerListener {

    private YouTubePlayer mYouTubePlayer;
    private ReactNativeYouTubePlayerView mReactNativeYouTubePlayerView;
    private YouTubePlayerTracker mYouTubePlayerTracker = new YouTubePlayerTracker();

    private boolean mReady = false;
    private boolean mPlay = false;
    private boolean mLoop = false;
    private boolean mLoadingVideo = false;
    
    private List<String> mVideoIds = new ArrayList<String>();
    private int mVideosIndex = 0;

    public ReactNativeYouTubePlayerController(ReactNativeYouTubePlayerView reactNativeYouTubePlayerView){
        mReactNativeYouTubePlayerView = reactNativeYouTubePlayerView;
    }

    @Override
    public void onReady(@NonNull YouTubePlayer youTubePlayer) {
        mYouTubePlayer = youTubePlayer;

        YouTubePlayerTracker tracker = new YouTubePlayerTracker();
        youTubePlayer.addListener(mYouTubePlayerTracker);

        setIsReady(true);
        loadVideo();

        mReactNativeYouTubePlayerView.playerViewDidBecomeReady();
    }

    public void onStateChange(@NonNull YouTubePlayer youTubePlayer, @NonNull PlayerConstants.PlayerState state) {
        switch (state) {
            case UNKNOWN:
                Log.w("DAVID", "UNKNOWN");
                mReactNativeYouTubePlayerView.didChangeToState("unknown");
                return;

            case UNSTARTED:
                Log.w("DAVID", "UNSTARTED");
                mLoadingVideo = false;
                mReactNativeYouTubePlayerView.didChangeToState("unstarded");
                return;

            case ENDED:
                Log.w("DAVID", "ENDED");
                nextVideo();
                mReactNativeYouTubePlayerView.didChangeToState("ended");
                return;

            case PLAYING:
                Log.w("DAVID", "PLAYING");
                setPlay(true);
                mReactNativeYouTubePlayerView.didChangeToState("playing");
                return;

            case PAUSED:
                Log.w("DAVID", "PAUSED");
                if (!mLoadingVideo) {
                    setPlay(false);
                    mReactNativeYouTubePlayerView.didChangeToState("paused");
                }
                return;

            case BUFFERING:
                Log.w("DAVID", "BUFFERING");
                mReactNativeYouTubePlayerView.didChangeToState("buffering");
                return;

            case VIDEO_CUED:
                Log.w("DAVID", "VIDEO_CUED");
                mReactNativeYouTubePlayerView.didChangeToState("video cued");
                return;

            default:
                return;
        }
    }

    public void onError(@NonNull YouTubePlayer youTubePlayer, @NonNull PlayerConstants.PlayerError error) {
        String errorString = "";

        switch (error) {
            case UNKNOWN:
                errorString = "unknown";
                break;
            case INVALID_PARAMETER_IN_REQUEST:
                errorString = "Invalid parameter in request";
                break;
            case HTML_5_PLAYER:
                errorString = "HTML 5 player error";
                break;
            case VIDEO_NOT_FOUND:
                errorString = "Video not found";
                break;
            case VIDEO_NOT_PLAYABLE_IN_EMBEDDED_PLAYER:
                errorString = "Video not playable in embedded player";
                break;
        }

        mReactNativeYouTubePlayerView.receivedError(errorString);
    }

    public void onVideoId(@NonNull YouTubePlayer youTubePlayer, String videoId) {
        setVideosIndex(mVideoIds.indexOf(videoId));
    }

    public void seekTo(float second) {
        if (isReady()) {
            mYouTubePlayer.seekTo(second);
        }
    }

    public void nextVideo() {
        if (isReady()) {
            int nextVideosIndex = getVideosIndex() + 1;
            boolean hasNext = nextVideosIndex < mVideoIds.size();

            if (hasNext) {
                playVideoAt(nextVideosIndex);
            } else if (isLoop()) {
                playVideoAt(0);
            }
        }
    }

    public void previousVideo() {
        if (isReady()) {
            int prevVideosIndex = getVideosIndex() - 1;
            boolean hasPrev = prevVideosIndex > -1;

            if (hasPrev) {
                playVideoAt(prevVideosIndex);
            } else if (isLoop()) {
                playVideoAt(mVideoIds.size() - 1);
            }
        }
    }

    public void playVideoAt(int index) {
        Log.w("DAVID", "playVideoAt(): " + String.valueOf(index));
        if (isReady()) {
            boolean indexIsInRange = setVideosIndex(index);
            
            if (indexIsInRange) {
                loadVideo();
            } else {
                mReactNativeYouTubePlayerView.receivedError("Video index is out of bound");
            }
        }
    }

    public float getCurrentTime() {
        return mYouTubePlayerTracker.getCurrentSecond();
    }

    public float getDuration() {
        return mYouTubePlayerTracker.getVideoDuration();
    }

    /**
     * Private methods
     **/

    private void loadVideo() {
        String videoId = mVideoIds.get(mVideosIndex);

        Log.w("DAVID", "loadVideo: " + videoId + String.valueOf(isPlay()));

        mLoadingVideo = true;

        if (isPlay()) {
            mYouTubePlayer.loadVideo(videoId, 0);
        } else {
            mYouTubePlayer.cueVideo(videoId, 0);
        }
    }

    /**
     * Getters & Setters
     **/

    private void setIsReady(boolean ready) {
        mReady = ready;
    }

    private boolean isReady() {
        return mReady;
    }

    private boolean setVideosIndex(int videosIndex) {
        if (videosIndex >= 0 && videosIndex < mVideoIds.size()) {
            mVideosIndex = videosIndex;
            return true;
        } else {
            return false;
        }
    }

    public int getVideosIndex() {
        return mVideosIndex;
    }

    private boolean isPlay() {
        return mPlay;
    }

    private boolean isLoop() {
        return mLoop;
    }

    /**
     * React Props
     */

    public void setVideoId(String videoId) {
        ArrayList videoIds = new ArrayList<String>();

        videoIds.add(videoId);
        
        setVideoIds(videoIds);
    }

    public void setVideoIds(ArrayList videoIds) {
        Log.w("DAVID", "public void setVideoIds(ArrayList videoIds) {");
        if (videoIds != null) {
            setVideosIndex(0);
            mVideoIds = videoIds;

            if (isReady()) {
                loadVideo();
            };
        }
    }

    public void setPlay(boolean play) {
        mPlay = play;

        Log.w("DAVID", "public void setPlay(boolean play) {");

        if (isReady()) {
            if (isPlay()) {
                Log.w("DAVID", "mYouTubePlayer.play();");
                mYouTubePlayer.play();
            } else {
                Log.w("DAVID", "mYouTubePlayer.pause();");
                mYouTubePlayer.pause();
            };
        }
    }

    public void setLoop(boolean loop) {
        mLoop = loop;
    }
}
