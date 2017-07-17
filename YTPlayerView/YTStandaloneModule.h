// YTStandaloneModule.h
#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>

@interface YTStandaloneModule: NSObject <RCTBridgeModule>

- (void) moviePlayerPlaybackDidFinish:(NSNotification *)notification;

@end
