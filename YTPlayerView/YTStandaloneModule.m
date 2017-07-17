// YTStandaloneModule.m
#import "YTStandaloneModule.h"
#import <XCDYouTubeKit/XCDYouTubeKit.h>

@implementation YTStandaloneModule {
    RCTPromiseResolveBlock resolver;
    RCTPromiseRejectBlock rejecter;
};

// To export a module named YTStandaloneModule
RCT_EXPORT_MODULE();

RCT_REMAP_METHOD(playVideo,
                 playVideoWithResolver:(NSString*)videoId resolver:(RCTPromiseResolveBlock)resolve
                 rejecter:(RCTPromiseRejectBlock)reject)
{
    dispatch_async(dispatch_get_main_queue(), ^{
        XCDYouTubeVideoPlayerViewController *videoPlayerViewController = [[XCDYouTubeVideoPlayerViewController alloc] initWithVideoIdentifier:videoId];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(moviePlayerPlaybackDidFinish:) name:MPMoviePlayerPlaybackDidFinishNotification object:videoPlayerViewController.moviePlayer];

        resolver = resolve;
        rejecter = reject;

        UIViewController *root = [[[[UIApplication sharedApplication] delegate] window] rootViewController];
        [root presentMoviePlayerViewControllerAnimated:videoPlayerViewController];
    });
}

- (void) moviePlayerPlaybackDidFinish:(NSNotification *)notification
{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:MPMoviePlayerPlaybackDidFinishNotification object:notification.object];
    MPMovieFinishReason finishReason = [notification.userInfo[MPMoviePlayerPlaybackDidFinishReasonUserInfoKey] integerValue];
    if (finishReason == MPMovieFinishReasonPlaybackError)
    {
        NSError *error = notification.userInfo[XCDMoviePlayerPlaybackDidFinishErrorUserInfoKey];
        // Handle error
        rejecter(@"error", @"YTError", error);
    } else {
        resolver(@"success");
    }

    rejecter = nil;
    resolver = nil;
}

@end
