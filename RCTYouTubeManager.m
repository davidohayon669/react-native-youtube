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

@implementation RCTYouTubeManager

RCT_EXPORT_MODULE();

@synthesize bridge = _bridge;

- (UIView *)view
{
    return [[RCTYouTube alloc] initWithEventDispatcher:self.bridge.eventDispatcher];
}

- (NSDictionary *)customDirectEventTypes
{
    return @{
             RNYouTubeEventReady: @{
                     @"registrationName": @"onReady"
                     },
             RNYouTubeEventChangeState: @{
                     @"registrationName": @"onChangeState"
                     },
             RNYouTubeEventChangeQuality: @{
                     @"registrationName": @"onChangeQuality"
                     },
             RNYouTubeEventError: @{
                     @"registrationName": @"onError"
                     },
             };
}


RCT_EXPORT_VIEW_PROPERTY(videoId, NSString);
RCT_EXPORT_VIEW_PROPERTY(play, BOOL);
RCT_EXPORT_VIEW_PROPERTY(hidden, BOOL);
RCT_EXPORT_VIEW_PROPERTY(playsInline, BOOL);

@end
