//
//  MYNReactYouTubeViewManager.m
//  Myntra
//
//  Created by Param Aggarwal on 15/06/15.
//  Copyright (c) 2015 Myntra Designs. All rights reserved.
//

#import "RCTYouTubeManager.h"
#import "RCTYouTube.h"
#import "RCTBridge.h"
#import "RCTUIManager.h"
#import "RCTWebView.h"
#import "UIView+React.h"

@implementation RCTYouTubeManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (UIView *)view
{
    return [[RCTYouTube alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

- (NSArray *)customDirectEventTypes
{
    return @[
        @"youtubeVideoReady",
        @"youtubeVideoChangeState",
        @"youtubeVideoChangeQuality",
        @"youtubeVideoError",
        @"youtubeProgress"
     ];
}

- (dispatch_queue_t)methodQueue
{
    return _bridge.uiManager.methodQueue;
}

- (NSDictionary *)constantsToExport {
    return @{
             @"exportedProps": @{
                 @"videoId": @YES,
                 @"play": @YES,
                 @"hidden": @YES,
                 @"playsInline": @YES,
                 @"playerParams": @YES
             }
            };
}

RCT_EXPORT_VIEW_PROPERTY(videoId, NSString);
RCT_EXPORT_VIEW_PROPERTY(play, BOOL);
RCT_EXPORT_VIEW_PROPERTY(hidden, BOOL);
RCT_EXPORT_VIEW_PROPERTY(playsInline, BOOL);
RCT_EXPORT_VIEW_PROPERTY(playerParams, NSDictionary);

RCT_EXPORT_METHOD(playVideo:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
         RCTYouTube *youtube = (RCTYouTube*)viewRegistry[reactTag];
         if ([youtube isKindOfClass:[RCTYouTube class]]) {
             [youtube playVideo];
         } else {
             RCTLogError(@"Cannot playVideo: %@ (tag #%@) is not RCTYouTube", youtube, reactTag);
         }
     }];
}

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

RCT_EXPORT_METHOD(loadVideoById:(nonnull NSNumber *)reactTag videoId:(nonnull NSString *)videoId)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
         RCTYouTube *youtube = (RCTYouTube*)viewRegistry[reactTag];
         if ([youtube isKindOfClass:[RCTYouTube class]]) {
             [youtube loadVideoById:videoId startSeconds:0 suggestedQuality:(YTPlaybackQuality)@"auto"];
         } else {
             RCTLogError(@"Cannot loadVideoById: %@ (tag #%@) is not RCTYouTube", youtube, reactTag);
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

RCT_EXPORT_METHOD(playlistIndex:(nonnull NSNumber *)reactTag resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
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
             RCTLogError(@"Cannot playlistIndex: %@ (tag #%@) is not RCTYouTube", youtube, reactTag);
         }
     }];
}

@end
