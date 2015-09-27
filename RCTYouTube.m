//
//  MYNReactYouTubeView.m
//  Myntra
//
//  Created by Param Aggarwal on 15/06/15.
//  Copyright (c) 2015 Myntra Designs. All rights reserved.
//

#import "RCTYouTube.h"
#import "RCTBridgeModule.h"
#import "RCTEventDispatcher.h"
#import "UIView+React.h"

@implementation RCTYouTube
{
    NSString *_videoId;
    BOOL _playsInline;
    NSDictionary *_playerParams;
    BOOL _isPlaying;
    
    /* Check to see if commands can
     * be sent to the player
     */
    BOOL _isReady;
    BOOL _playsOnLoad;
    
    /* Required to publish events */
    RCTEventDispatcher *_eventDispatcher;
}

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher
{
    if ((self = [super init])) {
        _eventDispatcher = eventDispatcher;
        _playsInline = NO;
        _isPlaying = NO;
        
        self.delegate = self;
    }
    
    return self;
}

- (void)layoutSubviews {
    [super layoutSubviews];
    
    if (self.webView) {
        self.webView.frame = self.bounds;
    }
}

#pragma mark - YTPlayer control methods

- (void)setPlay:(BOOL)play {
    
    // if not ready, configure for later
    if (!_isReady) {
        _playsOnLoad = play;
        return;
    }
    
    if (!_isPlaying && play) {
        [self playVideo];
        _isPlaying = YES;
    } else if (_isPlaying && !play) {
        [self pauseVideo];
        _isPlaying = NO;
    }
}

- (void)setPlaysInline:(BOOL)playsInline {
    if (_videoId && playsInline) {
        [self loadWithVideoId:_videoId playerVars:@{@"playsinline": @1}];
    } else if (_videoId && !playsInline){
        [self loadWithVideoId:_videoId];
    } else {
        // will get set when videoId is set
    }

    _playsInline = playsInline;
}

- (void)setVideoId:(NSString *)videoId {
    if (_videoId) {
        [self cueVideoById:videoId startSeconds:0 suggestedQuality:kYTPlaybackQualityDefault];
    } else if (_playsInline) {
        [self loadWithVideoId:videoId playerVars:@{@"playsinline": @1}];
    } else {
        // will get set when playsInline is set
    }
    
    _videoId = videoId;
}

- (void)setPlayerParams:(NSDictionary *)playerParams {
    _playerParams = playerParams;
    [self loadWithPlayerParams:playerParams];
}

#pragma mark - YTPlayer delegate methods

- (void)playerViewDidBecomeReady:(YTPlayerView *)playerView {
    if (_playsOnLoad) {
        [self playVideo];
        _isPlaying = YES;
    }
    _isReady = YES;

    [_eventDispatcher sendInputEventWithName:@"youtubeVideoReady"
                                        body:@{
                                               @"target": self.reactTag
                                               }];
}

- (void)playerView:(YTPlayerView *)playerView didChangeToState:(YTPlayerState)state {
    
    NSString *playerState;
    switch (state) {
        case kYTPlayerStateUnknown:
            playerState = @"unknown";
            break;
        case kYTPlayerStateUnstarted:
            playerState = @"unstarted";
            break;
        case kYTPlayerStateQueued:
            playerState = @"queued";
            break;
        case kYTPlayerStateBuffering:
            playerState = @"buffering";
            break;
        case kYTPlayerStatePlaying:
            playerState = @"playing";
            break;
        case kYTPlayerStatePaused:
            playerState = @"paused";
            break;
        case kYTPlayerStateEnded:
            playerState = @"ended";
            break;
        default:
            break;
    }
    
    [_eventDispatcher sendInputEventWithName:@"youtubeVideoChangeState"
                                        body:@{
                                               @"state": playerState,
                                               @"target": self.reactTag
                                               }];

}

- (void)playerView:(YTPlayerView *)playerView didChangeToQuality:(YTPlaybackQuality)quality {
    
    NSString *playerQuality;
    switch (quality) {
        case kYTPlaybackQualitySmall:
            playerQuality = @"small";
            break;
        case kYTPlaybackQualityMedium:
            playerQuality = @"medium";
            break;
        case kYTPlaybackQualityLarge:
            playerQuality = @"large";
            break;
        case kYTPlaybackQualityHD720:
            playerQuality = @"hd720";
            break;
        case kYTPlaybackQualityHD1080:
            playerQuality = @"hd1080";
            break;
        case kYTPlaybackQualityHighRes:
            playerQuality = @"high_res";
            break;
        case kYTPlaybackQualityAuto: /** Addition for YouTube Live Events. */
            playerQuality = @"auto";
            break;
        case kYTPlaybackQualityDefault:
            playerQuality = @"default";
            break;
        case kYTPlaybackQualityUnknown:
            playerQuality = @"unknown";
            break;
        default:
            break;
    }

    [_eventDispatcher sendInputEventWithName:@"youtubeVideoChangeQuality"
                                        body:@{
                                               @"quality": playerQuality,
                                               @"target": self.reactTag
                                               }];
}

- (void)playerView:(YTPlayerView *)playerView didPlayTime:(float)currentTime {

    [_eventDispatcher sendInputEventWithName:@"youtubeProgress"
                                        body:@{
                                               @"currentTime": @(currentTime),
                                               @"duration": @(self.duration),
                                               @"target": self.reactTag
                                               }];

}

- (void)playerView:(YTPlayerView *)playerView receivedError:(YTPlayerError)error {

    NSString *playerError;
    switch (error) {
        case kYTPlayerErrorInvalidParam:
            playerError = @"invalid_param";
            break;
        case kYTPlayerErrorHTML5Error:
            playerError = @"html5_error";
            break;
        case kYTPlayerErrorVideoNotFound:
            playerError = @"video_not_found";
            break;
        case kYTPlayerErrorNotEmbeddable:
            playerError = @"not_embeddable";
            break;
        case kYTPlayerErrorUnknown:
            playerError = @"unknown";
            break;
        default:
            break;
    }
    
    [_eventDispatcher sendInputEventWithName:@"youtubeVideoError"
                                        body:@{
                                               @"error": playerError,
                                               @"target": self.reactTag
                                               }];

}

#pragma mark - Lifecycle

- (void)removeFromSuperview
{
    [self removeWebView];
    [super removeFromSuperview];
}

@end
