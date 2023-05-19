import { _decorator, Component, Node, director, Director, view, View, Canvas, screen, ResolutionPolicy } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Index')
export class Index extends Component {

    private resizeScene: boolean = true;

    protected onLoad() {
        view.resizeWithBrowserSize(true);
        view.setResizeCallback(() => { this.resizeScene = true });
    }

    protected lateUpdate(dt: number): void {
        if (!this.resizeScene) return;
        this.resizeScene = false;
        const designResolution = view.getDesignResolutionSize()
        // const designScale = designResolution.width / designResolution.height;
        // const screenScale = screen.windowSize.width / screen.windowSize.height;
        view.setDesignResolutionSize(designResolution.width,screen.windowSize.height,ResolutionPolicy.FIXED_HEIGHT);
        // view.setResolutionPolicy(screenScale < designScale ? ResolutionPolicy.FIXED_WIDTH : ResolutionPolicy.FIXED_HEIGHT);
    }

}

