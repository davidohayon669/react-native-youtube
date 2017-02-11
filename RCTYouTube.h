#import "YTPlayerView.h"

@class RCTBridge;

@interface RCTYouTube : YTPlayerView <YTPlayerViewDelegate>

- (instancetype)initWithBridge:(RCTBridge *)bridge NS_DESIGNATED_INITIALIZER;

// Overriding designated initializers on UIView (Demanded by compiler)
- (instancetype)initWithFrame:(CGRect)frame NS_UNAVAILABLE;

- (instancetype)initWithCoder:(NSCoder *)aDecoder NS_UNAVAILABLE;

@end
