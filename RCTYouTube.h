#import "WKYTPlayerView.h"

@class RCTBridge;

@interface RCTYouTube : WKYTPlayerView <WKYTPlayerViewDelegate>

- (instancetype)initWithBridge:(RCTBridge *)bridge NS_DESIGNATED_INITIALIZER;

// Overriding designated initializers on UIView (Demanded by compiler)
- (instancetype)initWithFrame:(CGRect)frame NS_UNAVAILABLE;

- (instancetype)initWithCoder:(NSCoder *)aDecoder NS_UNAVAILABLE;

@end
