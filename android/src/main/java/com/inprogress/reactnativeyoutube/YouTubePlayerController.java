package com.inprogress.reactnativeyoutube;

import android.content.Context;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;

import com.google.android.youtube.player.YouTubeInitializationResult;
import com.google.android.youtube.player.YouTubePlayer;

import com.facebook.react.bridge.ReadableArray;

import java.util.List;
import java.util.ArrayList;


public class YouTubePlayerController implements
        YouTubePlayer.OnInitializedListener, YouTubePlayer.PlayerStateChangeListener, YouTubePlayer.PlaybackEventListener {

    String videoId = null;
    String playlistId = null;
    List<String> videoIds = new ArrayList<String>();

    YouTubePlayer mYouTubePlayer;
    YouTubeView mYouTubeView;

    private static final int VIDEO_MODE = 0;
    private static final int VIDEOS_MODE = 1;
    private static final int PLAYLIST_MODE = 2;

    private boolean isLoaded = false;
    private int videosIndex = 0;
    private int mode = 0;
    private boolean play = false;
    private boolean hidden = false;
    private boolean related = false;
    private boolean modestBranding = false;
    private int controls = 1;
    private boolean showInfo = true;
    private boolean loop = false;
    private boolean playInline = false;

    public YouTubePlayerController(YouTubeView youTubeView) {
        this.mYouTubeView = youTubeView;
    }

    @Override
    public void onInitializationSuccess(YouTubePlayer.Provider provider, YouTubePlayer youTubePlayer, boolean wasRestored) {
        if (!wasRestored) {
            mYouTubePlayer = youTubePlayer;
            mYouTubePlayer.setPlayerStateChangeListener(this);
            mYouTubePlayer.setPlaybackEventListener(this);
            updateControls();
            mYouTubeView.playerViewDidBecomeReady();
            setLoaded(true);
            if (isPlay()) {
                if (videoId != null) startVideo();
                else if (!videoIds.isEmpty()) startVideos();
                else if (playlistId != null) startPlaylist();
            }
        }
    }

    @Override
    public void onInitializationFailure(YouTubePlayer.Provider provider, YouTubeInitializationResult youTubeInitializationResult) {
        mYouTubeView.receivedError(youTubeInitializationResult.toString());
    }

    @Override
    public void onPlaying() {
        mYouTubeView.didChangeToState("playing");
    }

    @Override
    public void onPaused() {
        mYouTubeView.didChangeToState("paused");
    }

    @Override
    public void onStopped() {
        mYouTubeView.didChangeToState("stopped");
    }

    @Override
    public void onBuffering(boolean b) {
        if (b) mYouTubeView.didChangeToState("buffering");

        //Trick to remove when YouTube will patch it
        ProgressBar progressBar;
        try {
            // As of 2016-02-16, the ProgressBar is at position 0 -> 3 -> 2 in the view tree of the Youtube Player Fragment
            ViewGroup child1 = (ViewGroup)mYouTubeView.getChildAt(0);
            ViewGroup child2 = (ViewGroup)child1.getChildAt(3);
            progressBar = (ProgressBar)child2.getChildAt(2);
        } catch (Throwable t) {
            // As its position may change, we fallback to looking for it
            progressBar = findProgressBar(mYouTubeView);
        }

        int visibility = b ? View.VISIBLE : View.INVISIBLE;
        if (progressBar != null) progressBar.setVisibility(visibility);
    }

    private ProgressBar findProgressBar(View view) {
        if (view instanceof ProgressBar) {
            return (ProgressBar)view;
        } else if (view instanceof ViewGroup) {
            ViewGroup viewGroup = (ViewGroup)view;
            for (int i = 0; i < viewGroup.getChildCount(); i++) {
                ProgressBar res = findProgressBar(viewGroup.getChildAt(i));
                if (res != null) return res;
            }
        }
        return null;
    }

    @Override
    public void onSeekTo(int i) { }

    @Override
    public void onLoading() {
        mYouTubeView.didChangeToState("loading");
    }

    @Override
    public void onLoaded(String videoId) {
        if (mode == VIDEOS_MODE) {
            videosIndex = videoIds.indexOf(videoId);
        }
    }

    @Override
    public void onAdStarted() {
        mYouTubeView.didChangeToState("adStarted");
    }

    @Override
    public void onVideoStarted() {
        mYouTubeView.didChangeToState("started");
    }

    @Override
    public void onVideoEnded() {
        mYouTubeView.didChangeToState("ended");
        if (isLoop()) {
            if (mode == VIDEO_MODE) startVideo();
            else if (mode == VIDEOS_MODE && videosIndex == videoIds.size() - 1) playVideoAt(0);
        }
    }

    // TODO: Handle error of unplayable videos. Currently it shows a generic 400
    // Error and the whole player becomes inactive, event if only one of the videos
    // in a playlist is unplayable
    private void setMode(int mode) {
        this.mode = mode;
    }

    private void startVideo() {
        mYouTubePlayer.loadVideo(videoId);
        videosIndex = 0;
        setMode(VIDEO_MODE);
    }

    private void startVideos() {
        if (videosIndex != 0) mYouTubePlayer.loadVideos(videoIds, videosIndex, 0);
        else mYouTubePlayer.loadVideos(videoIds);
        setMode(VIDEOS_MODE);
    }

    private void startPlaylist() {
        mYouTubePlayer.loadPlaylist(playlistId);
        videosIndex = 0;
        setMode(PLAYLIST_MODE);
    }

    @Override
    public void onError(YouTubePlayer.ErrorReason errorReason) {
        mYouTubeView.receivedError(errorReason.toString());
    }

    public void seekTo(int second) {
        if (isLoaded()) mYouTubePlayer.seekToMillis(second * 1000);
    }

    public void nextVideo() {
        if (isLoaded()) {
            if (mYouTubePlayer.hasNext()) mYouTubePlayer.next();
            else if (mode == VIDEOS_MODE) playVideoAt(0);
            else if (mode == PLAYLIST_MODE) startPlaylist();
            else startVideo();
        }
    }

    public void previousVideo() {
        if (isLoaded()) {
            if (mYouTubePlayer.hasPrevious()) mYouTubePlayer.previous();
            else if (mode == VIDEOS_MODE) playVideoAt(videoIds.size() - 1);
            else if (mode == PLAYLIST_MODE) startPlaylist();
            else startVideo();
        }
    }

    public void playVideoAt(int index) {
        videosIndex = index;
        if (isLoaded()) startVideos();
    }

    public void updateControls() {
        switch (controls) {
            case 0:
                mYouTubePlayer.setPlayerStyle(YouTubePlayer.PlayerStyle.CHROMELESS);
                break;
            case 1:
                mYouTubePlayer.setPlayerStyle(YouTubePlayer.PlayerStyle.DEFAULT);
                break;
            case 2:
                mYouTubePlayer.setPlayerStyle(YouTubePlayer.PlayerStyle.MINIMAL);
                break;
        }
    }


    /**
     * GETTER & SETTER
     **/

    public void setLoaded(boolean loaded) {
        isLoaded = loaded;
    }

    public boolean isLoaded() {
        return isLoaded;
    }

    public int getVideosIndex() {
        return videosIndex;
    }

    /**
     * React Props
     */

    public void setVideoId(String videoId) {
        this.videoId = videoId;
        if (isLoaded()) startVideo();
    }

    public void setVideoIds(ReadableArray videoIds) {
        if (videoIds != null) {
          videosIndex = 0;
          this.videoIds.clear();
          for (int i = 0; i < videoIds.size(); i++) {
              this.videoIds.add(videoIds.getString(i));
          }
          if (isLoaded()) startVideos();
        }
    }

    public void setPlaylistId(String playlistId) {
        this.playlistId = playlistId;
        if (isLoaded()) startPlaylist();
    }

    public void setPlay(boolean play) {
        this.play = play;
        if (isLoaded()) {
            if (this.play && !mYouTubePlayer.isPlaying()) mYouTubePlayer.play();
            else if (!this.play && mYouTubePlayer.isPlaying()) mYouTubePlayer.pause();
        }
    }

    public void setLoop(boolean loop) {
        this.loop = loop;
    }

    public void setControls(Integer controls) {
        if (controls >= 0 && controls <= 2) {
            this.controls = Integer.valueOf(controls);
            if (isLoaded()) updateControls();
        }
    }

    //TODO
    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    //TODO
    public void setShowInfo(boolean showInfo) {
        this.showInfo = showInfo;
    }

    //TODO
    public void setRelated(boolean related) {
        this.related = related;
    }

    //TODO
    public void setModestBranding(boolean modestBranding) {
        this.modestBranding = modestBranding;
    }

    //TODO
    public void setPlayInline(boolean playInline) {
        this.playInline = playInline;
    }

    public boolean isPlay() {
        return play;
    }

    public boolean isHidden() {
        return hidden;
    }

    public boolean isRelated() {
        return related;
    }

    public boolean isModestBranding() {
        return modestBranding;
    }

    public int getControls() {
        return controls;
    }

    public boolean isShowInfo() {
        return showInfo;
    }

    public boolean isLoop() {
        return loop;
    }

    public boolean isPlayInline() {
        return playInline;
    }
}
