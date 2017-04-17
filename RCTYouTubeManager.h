#if __has_include(<React/RCTAssert.h>)
#import <React/RCTViewManager.h>
#else // backwards compatibility for RN < 0.40
#import "RCTViewManager.h"
#endif

@interface RCTYouTubeManager : RCTViewManager

@end
