//
//  MYNReactYouTubeView.h
//  Myntra
//
//  Created by Param Aggarwal on 15/06/15.
//  Copyright (c) 2015 Myntra Designs. All rights reserved.
//

#import "YTPlayerView.h"

@class RCTBridge;

@interface RCTYouTube : YTPlayerView <YTPlayerViewDelegate>

- (instancetype)initWithBridge:(RCTBridge *)bridge NS_DESIGNATED_INITIALIZER;

// Overriding designated initializers on UIView (Demanded by compiler)
- (instancetype)initWithFrame:(CGRect)frame NS_UNAVAILABLE;

- (instancetype)initWithCoder:(NSCoder *)aDecoder NS_UNAVAILABLE;

@end
