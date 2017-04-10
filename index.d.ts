declare module "react-native-youtube" {

    interface Event {
        target: number;
    }

    export interface State extends Event {
        state: "buffering" | "playing" | "paused" | "ended";
    }

    export interface Progress extends Event {
        duration: number;
        currentTime: number;
    }

    export interface Error extends Event {
        error: "invalid_param" | "html5_error" | "video_not_found" | "not_embeddable" | "unknown";
    }

    export interface Quality extends Event {
        quality: "small" | "medium" | "large" | "hd720" | "hd1080" | "high_res" | "auto" | "default" | "unknown";
    }

    export interface YoutubeProps {
        videoId: string;
        play?: boolean;
        hidden?: boolean;
        playsInline?: boolean;
        loop?: boolean;
        modestbranding?: boolean;
        fs?: boolean;
        rel? :boolean;
        showinfo?: boolean;
        onRead?: () => void;
        onChangeState?: (event: State) => void;
        onChangeQuality?: (event: Quality) => void;
        onError?: (event: Error) => void;
        onProgress?: (event: Progress) => void;
        onFullScreenExit?: () => void;
        onFullScreenEnter?: () => void;
        apiKey?: string;
        style?: React.ViewStyle;
        ref?: React.Ref<React.WebViewStatic & React.ViewStatic>
    }
    export default class Youtube extends React.Component<YoutubeProps, any>{}
}
