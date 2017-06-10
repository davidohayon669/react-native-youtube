#import "RCTYouTubeManager.h"
#import "RCTYouTube.h"
#if __has_include(<React/RCTAssert.h>)
#import <React/RCTUIManager.h>
#else // backwards compatibility for RN < 0.40
#import "RCTUIManager.h"
#endif

@implementation RCTYouTubeManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (UIView *)view {
    return [[RCTYouTube alloc] initWithBridge:self.bridge];
}

- (dispatch_queue_t)methodQueue {
    return _bridge.uiManager.methodQueue;
}

RCT_EXPORT_VIEW_PROPERTY(playerParams, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(videoId, NSString);
RCT_EXPORT_VIEW_PROPERTY(videoIds, NSArray);
RCT_EXPORT_VIEW_PROPERTY(playlistId, NSString);
RCT_EXPORT_VIEW_PROPERTY(play, BOOL);
RCT_EXPORT_VIEW_PROPERTY(loopProp, BOOL);

RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onReady, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onChangeState, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onChangeQuality, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onChangeFullscreen, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onProgress, RCTDirectEventBlock);

RCT_EXPORT_METHOD(seekTo:(nonnull NSNumber *)reactTag seconds:(nonnull NSNumber *)seconds)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        RCTYouTube *youtube = (RCTYouTube*)viewRegistry[reactTag];
        if ([youtube isKindOfClass:[RCTYouTube class]]) {
            [youtube seekToSeconds:seconds.floatValue allowSeekAhead:YES];
        } else {
            RCTLogError(@"Cannot seekTo: %@ (tag #%@) is not RCTYouTube", youtube, reactTag);
        }
    }];
}

RCT_EXPORT_METHOD(nextVideo:(nonnull NSNumber *)reactTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        RCTYouTube *youtube = (RCTYouTube*)viewRegistry[reactTag];
        if ([youtube isKindOfClass:[RCTYouTube class]]) {
            [youtube nextVideo];
        } else {
            RCTLogError(@"Cannot nextVideo: %@ (tag #%@) is not RCTYouTube", youtube, reactTag);
        }
    }];
}

RCT_EXPORT_METHOD(previousVideo:(nonnull NSNumber *)reactTag)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        RCTYouTube *youtube = (RCTYouTube*)viewRegistry[reactTag];
        if ([youtube isKindOfClass:[RCTYouTube class]]) {
            [youtube previousVideo];
        } else {
            RCTLogError(@"Cannot previousVideo: %@ (tag #%@) is not RCTYouTube", youtube, reactTag);
        }
    }];
}

RCT_EXPORT_METHOD(playVideoAt:(nonnull NSNumber *)reactTag index:(nonnull NSNumber *)index)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        RCTYouTube *youtube = (RCTYouTube*)viewRegistry[reactTag];
        if ([youtube isKindOfClass:[RCTYouTube class]]) {
            [youtube playVideoAt:(int)[index integerValue]];
        } else {
            RCTLogError(@"Cannot playVideoAt: %@ (tag #%@) is not RCTYouTube", youtube, reactTag);
        }
    }];
}

RCT_EXPORT_METHOD(videosIndex:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        RCTYouTube *youtube = (RCTYouTube*)viewRegistry[reactTag];
        if ([youtube isKindOfClass:[RCTYouTube class]]) {
            NSNumber *index = [NSNumber numberWithInt:[youtube playlistIndex]];
            if (index) {
                resolve(index);
            } else {
                NSError *error = nil;
                reject(@"Error getting index of video from RCTYouTube", @"", error);
            }
        } else {
            RCTLogError(@"Cannot videosIndex: %@ (tag #%@) is not RCTYouTube", youtube, reactTag);
        }
    }];
}

RCT_EXPORT_METHOD(currentTime:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
        RCTYouTube *youtube = (RCTYouTube*)viewRegistry[reactTag];
        if ([youtube isKindOfClass:[RCTYouTube class]]) {
            NSNumber *index = [NSNumber numberWithInt:[youtube currentTime]];
            if (index) {
                resolve(index);
            } else {
                NSError *error = nil;
                reject(@"Error getting current time of video from RCTYouTube", @"", error);
            }
        } else {
            RCTLogError(@"Cannot currentTime: %@ (tag #%@) is not RCTYouTube", youtube, reactTag);
        }
    }];
}

@end
