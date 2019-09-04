#import <React/RCTBridgeModule.h>
#import <React/RCTUtils.h>

@interface RCTYouTubeStandalone: NSObject <RCTBridgeModule>

#ifdef XCD_YOUTUBE_KIT_INSTALLED
    - (void) moviePlayerPlaybackDidFinish:(NSNotification *)notification;
#endif

@end
