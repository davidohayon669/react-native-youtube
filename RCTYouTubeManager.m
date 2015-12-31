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

RCT_EXPORT_METHOD(seekTo:(nonnull NSNumber *)reactTag seconds:(nonnull NSNumber *)seconds)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, UIView *> *viewRegistry) {
         RCTYouTube *youtube = viewRegistry[reactTag];
         if ([youtube isKindOfClass:[RCTYouTube class]]) {
             [youtube seekToSeconds:seconds.floatValue allowSeekAhead:@YES];
         } else {
             RCTLogError(@"Cannot seek: %@ (tag #%@) is not RCTYouTube", youtube, reactTag);
         }
     }];
}

@end
