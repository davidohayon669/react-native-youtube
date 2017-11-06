#if __has_include(<React/RCTAssert.h>)
#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>
#else // backwards compatibility for RN < 0.40
#import "RCTBridgeModule.h"
#import "RCTUtils.h"
#endif

@interface RCTYouTubeStandalone: NSObject <RCTBridgeModule>

- (void) moviePlayerPlaybackDidFinish:(NSNotification *)notification;

@end
