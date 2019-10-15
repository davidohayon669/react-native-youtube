#import "RCTYouTubeStandalone.h"
#if __has_include(<XCDYouTubeKit/XCDYouTubeKit.h>)
#import <XCDYouTubeKit/XCDYouTubeKit.h>
#define XCD_YOUTUBE_KIT_INSTALLED
#endif

@implementation RCTYouTubeStandalone {
    RCTPromiseResolveBlock resolver;
    RCTPromiseRejectBlock rejecter;
};

RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(playVideo,
                 playVideoWithResolver:(NSString*)videoId
                 resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    #ifndef XCD_YOUTUBE_KIT_INSTALLED
        reject(@"error", @"XCDYouTubeKit is not installed. Refer to README for instructions.", nil);
    #else
        dispatch_async(dispatch_get_main_queue(), ^{
            UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
            AVPlayerViewController *playerViewController = [AVPlayerViewController new];
            [root presentViewController:playerViewController animated:YES completion:nil];

            __weak AVPlayerViewController *weakPlayerViewController = playerViewController;
            [[XCDYouTubeClient defaultClient] getVideoWithIdentifier:videoId completionHandler:^(XCDYouTubeVideo * _Nullable video, NSError * _Nullable error) {
                if (video) {
                    NSDictionary *streamURLs = video.streamURLs;
                    NSURL *streamURL = streamURLs[
                        XCDYouTubeVideoQualityHTTPLiveStreaming] ?:
                        streamURLs[@(XCDYouTubeVideoQualityHD720)] ?:
                        streamURLs[@(XCDYouTubeVideoQualityMedium360)] ?:
                        streamURLs[@(XCDYouTubeVideoQualitySmall240)
                    ];
                    weakPlayerViewController.player = [AVPlayer playerWithURL:streamURL];
                    [weakPlayerViewController.player play];
                    [[NSNotificationCenter defaultCenter] addObserver:self
                                                            selector:@selector(moviePlayerPlaybackDidFinish:)
                                                                name:AVPlayerItemDidPlayToEndTimeNotification
                                                            object:weakPlayerViewController.player.currentItem];
                } else {
                    [root dismissViewControllerAnimated:YES completion:nil];
                }
            }];

            resolver = resolve;
            rejecter = reject;
        });
    #endif
}

#ifdef XCD_YOUTUBE_KIT_INSTALLED
    - (void) moviePlayerPlaybackDidFinish:(NSNotification *)notification
    {
        [[NSNotificationCenter defaultCenter] removeObserver:self
                                                        name:AVPlayerItemDidPlayToEndTimeNotification
                                                      object:notification.object];
        resolver(@"success");
        rejecter = nil;
        resolver = nil;
    }
#endif

@end
