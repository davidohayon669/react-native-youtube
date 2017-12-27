package com.inprogress.reactnativeyoutube;

import com.google.android.youtube.player.YouTubePlayerFragment;


public class VideoFragment extends YouTubePlayerFragment {
    
    public YouTubeView mYouTubeView;
    
    public VideoFragment() {
        
    }
    
    public static VideoFragment newInstance() {
        return new VideoFragment();
    }
    
    @Override
    public void onResume() {
        mYouTubeView.onVideoFragmentResume();
        super.onResume();
    }
}

