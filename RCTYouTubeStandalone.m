#import "RCTYouTubeStandalone.h"
#if __has_include(<XCDYouTubeKit/XCDYouTubeKit.h>)
#import <XCDYouTubeKit/XCDYouTubeKit.h>
#define XCD_YOUTUBE_KIT_INSTALLED
#endif
@import AVKit;

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

            [[XCDYouTubeClient defaultClient] getVideoWithIdentifier:videoId
                                                   completionHandler:^(XCDYouTubeVideo * _Nullable video, NSError * _Nullable error) {
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

                    resolve(@"YouTubeStandaloneIOS player launched successfully");
                } else {
                    reject(@"error", error.localizedDescription, nil);
                    [root dismissViewControllerAnimated:YES completion:nil];
                }
            }];
        });
    #endif
}

@end
