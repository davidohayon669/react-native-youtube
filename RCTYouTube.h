//
//  MYNReactYouTubeView.h
//  Myntra
//
//  Created by Param Aggarwal on 15/06/15.
//  Copyright (c) 2015 Myntra Designs. All rights reserved.
//

#import "YTPlayerView.h"

@class RCTEventDispatcher;

@interface RCTYouTube : YTPlayerView <YTPlayerViewDelegate>

- (instancetype)initWithEventDispatcher:(RCTEventDispatcher *)eventDispatcher NS_DESIGNATED_INITIALIZER;

@end
