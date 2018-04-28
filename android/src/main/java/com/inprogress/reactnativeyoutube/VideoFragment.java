package com.inprogress.reactnativeyoutube;

import com.google.android.youtube.player.YouTubePlayerFragment;


public class VideoFragment extends YouTubePlayerFragment {

    private YouTubeView mYouTubeView;

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
}
