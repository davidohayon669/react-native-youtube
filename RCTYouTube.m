#import "RCTYouTube.h"
#if __has_include(<React/RCTAssert.h>)
#import <React/RCTBridge.h>
#import <React/UIView+React.h>
#else // backwards compatibility for RN < 0.40
#import "RCTBridge.h"
#import "UIView+React.h"
#endif

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
                      suggestedQuality:kYTPlaybackQualityDefault];
        } else {
            [self loadVideoById:videoId
                   startSeconds:0
               suggestedQuality:kYTPlaybackQualityDefault];
        }
    }
}

- (void)setVideoIds:(NSArray *)videoIds {
    if (_isReady) {
        [self loadPlaylistByVideos:videoIds
                             index:0
                      startSeconds:0
                  suggestedQuality:kYTPlaybackQualityDefault];
        [self setLoopProp:_loop];
    }
}

- (void)setPlaylistId:(NSString *)playlistId {
    if (playlistId && _isReady) {
        // TODO: there is an unidentifiable error with this method when using a playlist's id
        [self loadPlaylistByPlaylistId:playlistId
                                 index:0
                          startSeconds:0
                      suggestedQuality:kYTPlaybackQualityDefault];
    }
}

- (void)setLoopProp:(BOOL)loop {
    _loop = loop;
    if (_isReady) [self setLoop:loop];
}


#pragma mark - YTPlayer delegate methods

- (void)playerViewDidBecomeReady:(YTPlayerView *)playerView {
    if (_playOnLoad) [self playVideo];

    _isReady = YES;

    if (_onReady) {
        _onReady(@{@"target": self.reactTag});
    }
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

    if (_onChangeState) {
        _onChangeState(@{
            @"state": playerState,
            @"target": self.reactTag
        });
    }
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

    if (_onChangeQuality) {
        _onChangeQuality(@{
            @"quality": playerQuality,
            @"target": self.reactTag
        });
    }
}

- (void)playerView:(YTPlayerView *)playerView didPlayTime:(float)currentTime {

    if (_onProgress) {
        _onProgress(@{
            @"currentTime": @(currentTime),
            @"duration": @(self.duration),
            @"target": self.reactTag
        });
    }
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
