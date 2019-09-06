#import "RCTYouTube.h"
#import <React/RCTBridge.h>
#import <React/UIView+React.h>

@interface RCTYouTube ()

@property (nonatomic, copy) RCTDirectEventBlock onError;
@property (nonatomic, copy) RCTDirectEventBlock onReady;
@property (nonatomic, copy) RCTDirectEventBlock onChangeState;
@property (nonatomic, copy) RCTDirectEventBlock onChangeQuality;
@property (nonatomic, copy) RCTDirectEventBlock onChangeFullscreen;
@property (nonatomic, copy) RCTDirectEventBlock onProgress;

@end

@implementation RCTYouTube {
    __weak RCTBridge *_bridge;

    BOOL _isReady;
    BOOL _playOnLoad;
    BOOL _loop;

    /* StatusBar visibility status before the player changed to fullscreen */
    // BOOL _isStatusBarHidden;
    BOOL _isFullscreen;
}

- (instancetype)initWithBridge:(RCTBridge *)bridge {
    if ((self = [super initWithFrame:CGRectZero])) {
      _bridge = bridge;

      _isReady = NO;
      _playOnLoad = NO;
      _loop = NO;
      _isFullscreen = NO;

      [self addFullscreenObserver];

      self.delegate = self;
    }
    return self;
}

- (instancetype)initWithFrame:(CGRect)frame { @throw nil; }

- (instancetype)initWithCoder:(NSCoder *)aDecoder { @throw nil; }

- (void)addFullscreenObserver {
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(playerFullscreenStateChange:)
                                                 name:UIWindowDidResignKeyNotification
                                               object:self.window];
}

- (void)removeFullScreenObserver {
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIWindowDidResignKeyNotification object:self.window];
}

- (void)dealloc {
    [self removeFullScreenObserver];
}

- (void)layoutSubviews {
    [super layoutSubviews];

    if (self.webView) {
        self.webView.frame = self.bounds;
        if (@available(iOS 11.0, *)) {
            self.webView.scrollView.contentInsetAdjustmentBehavior = UIScrollViewContentInsetAdjustmentNever;
        }
    }
}

- (void)playerFullscreenStateChange:(NSNotification*)notification
{
    if ((UIWindow*)notification.object == self.window && !_isFullscreen) {
        _isFullscreen = YES;

        _onChangeFullscreen(@{
            @"isFullscreen": @(_isFullscreen),
            @"target": self.reactTag
        });
    }
    if ((UIWindow*)notification.object != self.window && _isFullscreen) {
        _isFullscreen = NO;

        _onChangeFullscreen(@{
            @"isFullscreen": @(_isFullscreen),
            @"target": self.reactTag
        });
    }
}

#pragma mark - YTPlayer control methods

- (void)setPlayerParams:(NSDictionary *)playerParams {
    if (playerParams[@"videoId"]) {
        [self loadWithVideoId:playerParams[@"videoId"]
                   playerVars:playerParams[@"playerVars"]];
    } else if (playerParams[@"playlistId"]) {
        [self loadWithPlaylistId:playerParams[@"playlistId"]
                      playerVars:playerParams[@"playerVars"]];
    } else {
        // if no videos info provided, we would still want to initiate an iframe instance
        // so it'll be available for future method calls with the initial vars
        [self loadWithVideoId:@""
                   playerVars:playerParams[@"playerVars"]];
    }
}

- (void)setPlay:(BOOL)play {
    if (!_isReady) {
        _playOnLoad = play;
    } else {
        if (play) [self playVideo];
        else [self pauseVideo];
    }
}

- (void)setVideoId:(NSString *)videoId {
    if (videoId && _isReady) {
        if (_loop) {
            // Looping a single video is unsupported by the iframe player so we
            // must load the video as a 2 videos playlist, as suggested here:
            // https://developers.google.com/youtube/player_parameters#loop
            [self loadPlaylistByVideos:@[videoId, videoId]
                                 index:0
                          startSeconds:0
                      suggestedQuality:kWKYTPlaybackQualityDefault];
        } else {
            [self loadVideoById:videoId
                   startSeconds:0
               suggestedQuality:kWKYTPlaybackQualityDefault];
        }
    }
}

- (void)setVideoIds:(NSArray *)videoIds {
    if (_isReady) {
        [self loadPlaylistByVideos:videoIds
                             index:0
                      startSeconds:0
                  suggestedQuality:kWKYTPlaybackQualityDefault];
        [self setLoopProp:_loop];
    }
}

- (void)setPlaylistId:(NSString *)playlistId {
    if (playlistId && _isReady) {
        // TODO: there is an unidentifiable error with this method when using a playlist's id
        [self loadPlaylistByPlaylistId:playlistId
                                 index:0
                          startSeconds:0
                      suggestedQuality:kWKYTPlaybackQualityDefault];
    }
}

- (void)setLoopProp:(BOOL)loop {
    _loop = loop;
    if (_isReady) [self setLoop:loop];
}


#pragma mark - YTPlayer delegate methods

- (void)playerViewDidBecomeReady:(WKYTPlayerView *)playerView {
    if (_playOnLoad) [self playVideo];

    _isReady = YES;

    if (_onReady) {
        _onReady(@{@"target": self.reactTag});
    }
}

- (void)playerView:(WKYTPlayerView *)playerView didChangeToState:(WKYTPlayerState)state {

    NSString *playerState;
    switch (state) {
        case kWKYTPlayerStateUnknown:
            playerState = @"unknown";
            break;
        case kWKYTPlayerStateUnstarted:
            playerState = @"unstarted";
            break;
        case kWKYTPlayerStateQueued:
            playerState = @"queued";
            break;
        case kWKYTPlayerStateBuffering:
            playerState = @"buffering";
            break;
        case kWKYTPlayerStatePlaying:
            playerState = @"playing";
            break;
        case kWKYTPlayerStatePaused:
            playerState = @"paused";
            break;
        case kWKYTPlayerStateEnded:
            playerState = @"ended";
            break;
        default:
            break;
    }

    if (_onChangeState) {
        _onChangeState(@{
            @"state": playerState,
            @"target": self.reactTag
        });
    }
}

- (void)playerView:(WKYTPlayerView *)playerView didChangeToQuality:(WKYTPlaybackQuality)quality {

    NSString *playerQuality;
    switch (quality) {
        case kWKYTPlaybackQualitySmall:
            playerQuality = @"small";
            break;
        case kWKYTPlaybackQualityMedium:
            playerQuality = @"medium";
            break;
        case kWKYTPlaybackQualityLarge:
            playerQuality = @"large";
            break;
        case kWKYTPlaybackQualityHD720:
            playerQuality = @"hd720";
            break;
        case kWKYTPlaybackQualityHD1080:
            playerQuality = @"hd1080";
            break;
        case kWKYTPlaybackQualityHighRes:
            playerQuality = @"high_res";
            break;
        case kWKYTPlaybackQualityAuto: /** Addition for YouTube Live Events. */
            playerQuality = @"auto";
            break;
        case kWKYTPlaybackQualityDefault:
            playerQuality = @"default";
            break;
        case kWKYTPlaybackQualityUnknown:
            playerQuality = @"unknown";
            break;
        default:
            break;
    }

    if (_onChangeQuality) {
        _onChangeQuality(@{
            @"quality": playerQuality,
            @"target": self.reactTag
        });
    }
}

- (void)playerView:(WKYTPlayerView *)playerView didPlayTime:(float)currentTime {

    if (_onProgress) {
        _onProgress(@{
            @"currentTime": @(currentTime),
            @"target": self.reactTag
        });
    }
}

- (void)playerView:(WKYTPlayerView *)playerView receivedError:(WKYTPlayerError)error {

    NSString *playerError;
    switch (error) {
        case kWKYTPlayerErrorInvalidParam:
            playerError = @"invalid_param";
            break;
        case kWKYTPlayerErrorHTML5Error:
            playerError = @"html5_error";
            break;
        case kWKYTPlayerErrorVideoNotFound:
            playerError = @"video_not_found";
            break;
        case kWKYTPlayerErrorNotEmbeddable:
            playerError = @"not_embeddable";
            break;
        case kWKYTPlayerErrorUnknown:
            playerError = @"unknown";
            break;
        default:
            break;
    }

    if (_onError) {
        _onError(@{
            @"error": playerError,
            @"target": self.reactTag
        });
    }
}


#pragma mark - Lifecycle

- (void)removeFromSuperview {
    [self removeWebView];
    [super removeFromSuperview];
}

@end
