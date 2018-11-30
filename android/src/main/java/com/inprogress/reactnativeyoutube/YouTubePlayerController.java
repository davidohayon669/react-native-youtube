package com.inprogress.reactnativeyoutube;

import android.view.View;
import android.view.ViewGroup;
import android.widget.ProgressBar;
import android.os.Handler;

import com.google.android.youtube.player.YouTubeInitializationResult;
import com.google.android.youtube.player.YouTubePlayer;

import com.facebook.react.bridge.ReadableArray;

import java.util.ArrayList;
import java.util.List;
import java.lang.Runnable;


public class YouTubePlayerController implements
        YouTubePlayer.OnInitializedListener,
        YouTubePlayer.PlayerStateChangeListener,
        YouTubePlayer.PlaybackEventListener,
        YouTubePlayer.OnFullscreenListener {

    private YouTubePlayer mYouTubePlayer;
    private YouTubeView mYouTubeView;

    private static final int VIDEO_MODE = 0;
    private static final int VIDEOS_MODE = 1;
    private static final int PLAYLIST_MODE = 2;

    private boolean mIsLoaded = false;
    private boolean mIsReady = false;
    private int mMode = 0;
    private int mVideosIndex = 0;

    private String mVideoId = null;
    private List<String> mVideoIds = new ArrayList<String>();
    private String mPlaylistId = null;
    private boolean mPlay = false;
    private boolean mLoop = false;
    private boolean mFullscreen = false;
    private int mControls = 1;
    private boolean mShowFullscreenButton = true;
    private boolean mResumePlay = true;
    private boolean mJustResumed = false;

    /**
     * Tells if the player is available to request
     * @return true if the player is available, false if currently initializing
     * or false if the player has been released
     */
    private boolean mPlayerAvailable = false;


    public YouTubePlayerController(YouTubeView youTubeView) {
        mYouTubeView = youTubeView;
    }

    @Override
    public void onInitializationSuccess(YouTubePlayer.Provider provider, YouTubePlayer youTubePlayer, boolean wasRestored) {
        if (!wasRestored) {
            mYouTubePlayer = youTubePlayer;

            /*
             * Now we are sure that the player is available
             */
            mPlayerAvailable = true;

            mYouTubePlayer.setPlayerStateChangeListener(this);
            mYouTubePlayer.setPlaybackEventListener(this);
            mYouTubePlayer.setOnFullscreenListener(this);
            updateFullscreen();
            updateShowFullscreenButton();
            updateControls();

            if (mVideoId != null) loadVideo();
            else if (!mVideoIds.isEmpty()) loadVideos();
            else if (mPlaylistId != null) loadPlaylist();
        }
    }

    @Override
    public void onInitializationFailure(YouTubePlayer.Provider provider, YouTubeInitializationResult result) {
        if (result.isUserRecoverableError()) {
            result.getErrorDialog(mYouTubeView.getReactContext().getCurrentActivity(), 0).show();
        }
        mYouTubeView.receivedError(result.toString());
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
        /**
         * ugly hack to trigger automatic video resume after the fragment went down
         * @see {@link #onVideoFragmentResume()} for more details
         */
        if (mJustResumed) { // check if the fragment just resumed
            if (isResumePlay()) { // check if the config ask use to do an automatic resume
                /*
                 * check if the video is already loaded, if so play the video directly
                 * (the onLoaded event won't trigger so we cannot use it to play the video)
                 * or
                 * load the video (the onLoaded event will then take care of playing that video)
                 */
                if (isLoaded()) mYouTubePlayer.play();
                else loadVideo();
            }
            // we consume the flag of resuming
            mJustResumed = false;
        }
    }

    @Override
    public void onBuffering(boolean buffering) {
        if (buffering) mYouTubeView.didChangeToState("buffering");

        //Trick to remove when YouTube will patch it
        ProgressBar progressBar;
        try {
            // As of 2016-02-16, the ProgressBar is at position 0 -> 3 -> 2 in the view tree of the Youtube Player Fragment
            ViewGroup child1 = (ViewGroup) mYouTubeView.getChildAt(0);
            ViewGroup child2 = (ViewGroup) child1.getChildAt(3);
            progressBar = (ProgressBar) child2.getChildAt(2);
        } catch (Throwable t) {
            // As its position may change, we fallback to looking for it
            progressBar = findProgressBar(mYouTubeView);
        }

        int visibility = buffering ? View.VISIBLE : View.INVISIBLE;
        if (progressBar != null) progressBar.setVisibility(visibility);
    }

    @Override
    public void onSeekTo(int i) {
        mYouTubeView.didChangeToSeeking(i);
    }

    @Override
    public void onLoading() {
        setLoaded(false);
        mYouTubeView.didChangeToState("loading");
    }

    @Override
    public void onLoaded(String videoId) {
        mVideoId = videoId;
        if (isVideosMode()) setVideosIndex(mVideoIds.indexOf(videoId));

        mYouTubeView.playerViewDidBecomeReady();
        setLoaded(true);
        mIsReady = true;
        automaticPlay();
    }

    @Override
    public void onAdStarted() {
        mYouTubeView.didChangeToState("adStarted");
    }

    /**
     * If video is loaded and play is requested (isPlay())
     * It will start the video
     */
    private void automaticPlay() {
      if (isLoaded() && isPlay()) {
        mYouTubePlayer.play();
      } else if (!isPlay()) {
        mYouTubePlayer.pause();
      }
    }

    @Override
    public void onVideoStarted() {
        mYouTubeView.didChangeToState("started");
    }

    @Override
    public void onVideoEnded() {
        mYouTubeView.didChangeToState("ended");
        if (isLoop()) {
            if (isVideoMode()) loadVideo();
            else if (isVideosMode() && getVideosIndex() == mVideoIds.size() - 1) playVideoAt(0);
        }
    }

    @Override
    public void onFullscreen(boolean isFullscreen) {
        mYouTubeView.didChangeToFullscreen(isFullscreen);
    }

    @Override
    public void onError(YouTubePlayer.ErrorReason errorReason) {
        mYouTubeView.receivedError(errorReason.toString());
    }

    public void seekTo(int second) {
        if (!isPlayerAvailable()) return;
        if (isLoaded()) mYouTubePlayer.seekToMillis(second * 1000);
    }

    public int getCurrentTime() {
      if (!isPlayerAvailable()) return 0;
      return mYouTubePlayer.getCurrentTimeMillis() / 1000;
    }

    public int getDuration() {
      if (!isPlayerAvailable()) return 0;
      return mYouTubePlayer.getDurationMillis() / 1000;
    }

    public void nextVideo() {
        if (!isPlayerAvailable()) return;
        if (isLoaded()) {
            if (mYouTubePlayer.hasNext()) mYouTubePlayer.next();
            else if (isLoop()) {
                if (isVideosMode()) playVideoAt(0);
                else if (isPlaylistMode()) loadPlaylist();
                else loadVideo();
            }
        }
    }

    public void previousVideo() {
        if (!isPlayerAvailable()) return;
        if (isLoaded()) {
            if (mYouTubePlayer.hasPrevious()) mYouTubePlayer.previous();
            else if (isLoop()) {
                if (isVideosMode()) playVideoAt(mVideoIds.size() - 1);
                else if (isPlaylistMode()) loadPlaylist();
                else loadVideo();
            }
        }
    }

    public void playVideoAt(int index) {
        if (!isPlayerAvailable()) return;
        if (isLoaded() && isVideosMode()) {
            boolean indexIsInRange = setVideosIndex(index);
            if (indexIsInRange) loadVideos();
            else mYouTubeView.receivedError("Video index is out of bound for videoIds[]");
        }
    }

    /**
     * Private methods
     **/

    private void loadVideo() {
        if (!isPlayerAvailable()) return;

        /*
         * we only cue the video in order to load it
         * when the video will be loaded depending on the isPlay() boolean we
         * will start it right away or wait for an user interaction
         */
        mYouTubePlayer.cueVideo(mVideoId);
        setVideosIndex(0);
        setVideoMode();
    }

    private void loadVideos() {
        if (!isPlayerAvailable()) return;
        /*
         * we only cue the video in order to load it
         * when the video will be loaded depending on the isPlay() boolean we
         * will start it right away or wait for an user interaction
         */
        mYouTubePlayer.cueVideos(mVideoIds, getVideosIndex(), 0);
        setVideosMode();
    }

    private void loadPlaylist() {
        if (!isPlayerAvailable()) return;
        /*
         * we only cue the playlist in order to load it
         * when the video will be loaded depending on the isPlay() boolean we
         * will start it right away or wait for an user interaction
         */
        mYouTubePlayer.cuePlaylist(mPlaylistId);
        setVideosIndex(0);
        setPlaylistMode();
    }

    private void updateControls() {
        if (!isPlayerAvailable()) return;
        switch (mControls) {
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

    private void updateFullscreen() {
        if (!isPlayerAvailable()) return;
        mYouTubePlayer.setFullscreen(mFullscreen);
    }

    private void updateShowFullscreenButton() {
        if (!isPlayerAvailable()) return;
        mYouTubePlayer.setShowFullscreenButton(mShowFullscreenButton);
    }

    private ProgressBar findProgressBar(View view) {
        if (view instanceof ProgressBar) {
            return (ProgressBar) view;
        } else if (view instanceof ViewGroup) {
            ViewGroup viewGroup = (ViewGroup) view;
            for (int i = 0; i < viewGroup.getChildCount(); i++) {
                ProgressBar res = findProgressBar(viewGroup.getChildAt(i));
                if (res != null) return res;
            }
        }
        return null;
    }

    /**
     * Getters & Setters
     **/

    private void setLoaded(boolean loaded) {
        mIsLoaded = loaded;
    }

    private boolean isLoaded() {
        return mIsLoaded;
    }

    private void setVideoMode() {
        mMode = VIDEO_MODE;
    }

    private boolean isVideoMode() {
        return (mMode == VIDEO_MODE);
    }

    private void setVideosMode() {
        mMode = VIDEOS_MODE;
    }

    private boolean isVideosMode() {
        return (mMode == VIDEOS_MODE);
    }

    private void setPlaylistMode() {
        mMode = PLAYLIST_MODE;
    }

    private boolean isPlaylistMode() {
        return (mMode == PLAYLIST_MODE);
    }

    private boolean setVideosIndex(int index) {
        if (index >= 0 && index < mVideoIds.size()) {
            mVideosIndex = index;
            return true;
        } else return false;
    }

    public int getVideosIndex() {
        return mVideosIndex;
    }

    public void onVideoFragmentResume() {
      /**
       * we tell that the fragment just resume
       * in order to resume the video if the configuration allows it (resumePlayAndroid to true)
       *
       * /!\ We cannot just do a player.play() because of the youtube player api
       * Indeed this library at each resume of the fragment trigger its current state
       * It seems that this event is always "stopped" (probably because of the youtube player view not visible)
       * In this case if we do a regular youtubeplayer.play(), the stop event will directly stop
       * the play and stay as is.
       *
       * This is why We do a hack in the {@link #onStopped()} event on the youtube player library
       * looking if the fragment just resumed and if so, will ask for a play if the configs allows to.
       * @see {@link #onStopped()}
       */
      mJustResumed = true;
    }

    private boolean isPlay() {
        return mPlay;
    }

    private boolean isLoop() {
        return mLoop;
    }

    private boolean isFullscreen() {
        return mFullscreen;
    }

    private int getControls() {
        return mControls;
    }

    /**
     * Tells if the player is available to request
     * @return true if the player is available, false if currently initializing
     * or false if the player has been released
     */
    public boolean isPlayerAvailable() {
      return mPlayerAvailable;
    }

    private boolean isResumePlay() {
        return mResumePlay;
    }

    /**
     * React Props
     */

    public void setVideoId(String videoId) {
        mVideoId = videoId;
        if (!isPlayerAvailable()) return;
        if (isLoaded()) loadVideo();
    }

    public void setVideoIds(ReadableArray videoIds) {
        if (videoIds != null) {
            setVideosIndex(0);
            mVideoIds.clear();
            for (int i = 0; i < videoIds.size(); i++) {
                mVideoIds.add(videoIds.getString(i));
            }
            if (!isPlayerAvailable()) return;
            if (isLoaded()) loadVideos();
        }
    }

    public void setPlaylistId(String playlistId) {
        mPlaylistId = playlistId;
        if (!isPlayerAvailable()) return;
        if (isLoaded()) loadPlaylist();
    }

    public void setPlay(boolean play) {
        mPlay = play;
        automaticPlay();
    }

    public void setLoop(boolean loop) {
        mLoop = loop;
    }

    public void setFullscreen(boolean fullscreen) {
        mFullscreen = fullscreen;
        if (!isPlayerAvailable()) return;
        if (isLoaded()) updateFullscreen();
    }

    public void setControls(int controls) {
        if (controls >= 0 && controls <= 2) {
            mControls = controls;
            if (isLoaded()) updateControls();
        }
    }

    public void setShowFullscreenButton(boolean show) {
        if (!isPlayerAvailable()) return;
        mShowFullscreenButton = show;
        if (isLoaded()) updateShowFullscreenButton();
    }

    public void setResumePlay(boolean resumePlay) {
        mResumePlay = resumePlay;
    }


    public void onInitializationStarted() {
        /*
         * Initialization is in progress, we should not query the player
         * during this time
         */
        mPlayerAvailable = false;
    }

    /**
     * Called when the youtube fragment has destroyed its view
     * And so release its player based on documentation
     */
    public void onPlayerRelease() {
      mPlayerAvailable = false;
      mPlay = false;
    }
}
