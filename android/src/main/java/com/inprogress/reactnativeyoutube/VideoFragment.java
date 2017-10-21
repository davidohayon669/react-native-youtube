package com.inprogress.reactnativeyoutube;

import com.google.android.youtube.player.YouTubePlayerFragment;


public class VideoFragment extends YouTubePlayerFragment {

    private YouTubeView mYouTubeView;

    public VideoFragment(YouTubeView youTubeView) {
        mYouTubeView = youTubeView;
    }

    public static VideoFragment newInstance(YouTubeView youTubeView) {
        return new VideoFragment(youTubeView);
    }

    @Override
    public void onResume() {
        mYouTubeView.onVideoFragmentResume();
        super.onResume();
    }
}
