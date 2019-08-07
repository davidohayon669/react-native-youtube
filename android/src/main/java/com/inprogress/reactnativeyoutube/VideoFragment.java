package com.inprogress.reactnativeyoutube;

import android.view.LayoutInflater;
import android.view.ViewGroup;
import android.os.Bundle;
import android.view.View;

import com.google.android.youtube.player.YouTubeInitializationResult;
import com.google.android.youtube.player.YouTubePlayerFragment;
import com.google.android.youtube.player.YouTubePlayer;


public class VideoFragment extends YouTubePlayerFragment implements YouTubePlayer.OnInitializedListener {

    private YouTubeView mYouTubeView;
    private boolean mPlayerReleased = true;

    private String mApiKey = null;
    private YouTubePlayer.OnInitializedListener mInitializationListener = null;

    public VideoFragment() {}


    public void setYoutubeView(YouTubeView youTubeView) {
        mYouTubeView = youTubeView;
    }

    public static VideoFragment newInstance(YouTubeView youTubeView) {
        VideoFragment fragment = new VideoFragment();
        fragment.setYoutubeView(youTubeView);
        return fragment;
    }

    @Override
    public void onResume() {
        if (mYouTubeView != null) {
            mYouTubeView.onVideoFragmentResume();
        }

        super.onResume();
    }

    @Override
    public View onCreateView (LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
      View v = super.onCreateView(inflater, container, savedInstanceState);
      /*
       * According to the Youtube Api documentation :
       * The YouTubePlayer associated with this fragment will be released
       * whenever its onDestroyView() method is called.
       *
       * If we do not initialize again the player, it will crash telling that
       * the youtube player has been released
       */
      if (mPlayerReleased) {
        initialize(mApiKey, mInitializationListener);
        /* Now that the player has been initialize we track that we can use it */
        mPlayerReleased = false;
      }
      return v;
    }

    @Override
    public void onDestroyView() {
      /*
       * According to youtube Player api :
       * The YouTubePlayer associated with this fragment will be released
       * whenever its onDestroyView() method is called.
       *
       * This is important since it cause Exception : The youtube player has been release
       * on some cases
       *
       * We keep track of this release in order to do a proper initialization
       * back again at view creation
       */
      mPlayerReleased = true;
      /*
       * Tell out view that the player is release in order to stop all actions
       * on the youtube player until next initialization
       */
      mYouTubeView.onPlayerRelease();
      super.onDestroyView();
    }

    @Override
    public void initialize(String developerKey, YouTubePlayer.OnInitializedListener listener) {
      /*
       * Inform the player that an initialization has started
       */
      mYouTubeView.onInitializationStarted();
      /*
       * Save the developer key and the listener for later use
       * (in onCreateView after a onDestroyView occurs)
       */
      mApiKey = developerKey;
      mInitializationListener = listener;

      /* Now we call the actual API */
      super.initialize(developerKey, this);
    }

    @Override
    public void onInitializationSuccess(YouTubePlayer.Provider provider, YouTubePlayer youTubePlayer, boolean wasRestored) {
      if (mInitializationListener != null) mInitializationListener.onInitializationSuccess(provider, youTubePlayer, wasRestored);
      /* Keep track that the player is now available */
      mPlayerReleased = false;
    }

    @Override
    public void onInitializationFailure(YouTubePlayer.Provider provider, YouTubeInitializationResult result) {
      if (mInitializationListener != null) mInitializationListener.onInitializationFailure(provider, result);
      /* Keep track that the player is not available */
      mPlayerReleased = true;
    }
}
