import { Component, EditBox, EventTouch, Graphics, IVec2Like, Node, _decorator, Color, Toggle, Tween, tween, Vec3, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('bezier')
export class Bezier extends Component {

    @property(Color)
    private bezierLineColor: Color = null;

    @property(Color)
    private controlLineColor: Color = null;

    @property(Toggle)
    private cubicBezierToggle: Toggle = null;

    @property(Node)
    private controlPoint2UI: Node = null;

    @property(Node)
    private startPointNode: Node = null;

    @property(Node)
    private controlPoint1Node: Node = null;

    @property(Node)
    private controlPoint2Node: Node = null;

    @property(Node)
    private endPointNode: Node = null;

    @property([EditBox])
    private startPointEditBox: EditBox[] = [];

    @property([EditBox])
    private controlPoint1EditBox: EditBox[] = [];

    @property([EditBox])
    private controlPoint2EditBox: EditBox[] = [];

    @property([EditBox])
    private endPointEditBox: EditBox[] = [];

    @property(Graphics)
    private graphicsPanel: Graphics = null;

    @property(Toggle)
    private animationToggle: Toggle = null;

    @property(Node)
    private animationNode: Node = null;

    // @property()
    private animationDuration: number = 2;

    private isCubicBezier: boolean = true;
    private isNeedUpdate: boolean = false;

    private startPoint: IVec2Like = null;
    private endPoint: IVec2Like = null;
    private controlPoint1: IVec2Like = null;
    private controlPoint2: IVec2Like = null;


    protected onLoad(): void {

        this.isCubicBezier = this.cubicBezierToggle.isChecked;


        this.startPoint = { x: -300, y: 0 };
        this.endPoint = { x: 300, y: 0 };
        this.controlPoint1 = this.isCubicBezier ? { x: -100, y: 200 } : { x: 0, y: 200 };
        this.controlPoint2 = { x: 100, y: -200 };



        this.cubicBezierToggle.node.on(Toggle.EventType.TOGGLE, this.onCubicBezierToggleClicked, this);

        this.setupPointNode(this.startPointNode);
        this.setupPointNode(this.controlPoint1Node);
        this.setupPointNode(this.controlPoint2Node);
        this.setupPointNode(this.endPointNode);

        this.setupPointEditBox(this.startPointEditBox);
        this.setupPointEditBox(this.controlPoint1EditBox);
        this.setupPointEditBox(this.controlPoint2EditBox);
        this.setupPointEditBox(this.endPointEditBox);

        this.onCubicBezierToggleClicked();
        this.updatePointNodePosition();
        this.updatePointEditBoxContent();
        this.updateCubicBezierUI();


        this.isNeedUpdate = true;

        this.startBezierAnimation();
    }

    protected update(_dt: number): void {
        if (!this.isNeedUpdate) return;
        this.isNeedUpdate = false;
        this.graphicsPanel.clear();
        if (this.isCubicBezier) {
            this.graphicsPanel.lineWidth = 2;
            this.graphicsPanel.strokeColor = this.controlLineColor;

            this.graphicsPanel.moveTo(this.startPoint.x, this.startPoint.y);
            this.graphicsPanel.lineTo(this.controlPoint1.x, this.controlPoint1.y);
            this.graphicsPanel.lineTo(this.controlPoint2.x, this.controlPoint2.y);
            this.graphicsPanel.lineTo(this.endPoint.x, this.endPoint.y);
            this.graphicsPanel.stroke();

            this.graphicsPanel.lineWidth = 5;
            this.graphicsPanel.strokeColor = this.bezierLineColor;

            this.graphicsPanel.moveTo(this.startPoint.x, this.startPoint.y);
            this.graphicsPanel.bezierCurveTo(this.controlPoint1.x, this.controlPoint1.y, this.controlPoint2.x, this.controlPoint2.y, this.endPoint.x, this.endPoint.y);
            this.graphicsPanel.stroke();
        } else {
            this.graphicsPanel.lineWidth = 2;
            this.graphicsPanel.strokeColor = this.controlLineColor;

            this.graphicsPanel.moveTo(this.startPoint.x, this.startPoint.y);
            this.graphicsPanel.lineTo(this.controlPoint1.x, this.controlPoint1.y);
            this.graphicsPanel.lineTo(this.endPoint.x, this.endPoint.y);
            this.graphicsPanel.stroke();

            this.graphicsPanel.lineWidth = 5;
            this.graphicsPanel.strokeColor = this.bezierLineColor;

            this.graphicsPanel.moveTo(this.startPoint.x, this.startPoint.y);
            this.graphicsPanel.quadraticCurveTo(this.controlPoint1.x, this.controlPoint1.y, this.endPoint.x, this.endPoint.y);
            this.graphicsPanel.stroke();
        }
    }

    private setupPointNode(node: Node): void {
        node.on(Node.EventType.TOUCH_START, () => node.on(Node.EventType.TOUCH_MOVE, this.onPointTouchMove, this));
        node.on(Node.EventType.TOUCH_CANCEL, () => node.off(Node.EventType.TOUCH_MOVE, this.onPointTouchMove, this));
        node.on(Node.EventType.TOUCH_END, () => node.off(Node.EventType.TOUCH_MOVE, this.onPointTouchMove, this));

        node.on(Node.EventType.MOUSE_ENTER, () => node.getChildByName('Tip').active = true, this);
        node.on(Node.EventType.MOUSE_LEAVE, () => node.getChildByName('Tip').active = false, this);
        node.getChildByName('Tip').active = false;
    }

    private setupPointEditBox(editBox: EditBox[]): void {
        editBox.forEach(value => value.node.on(EditBox.EventType.TEXT_CHANGED, this.onPointInput, this));
    }

    private readEditBoxNumber(editBox: EditBox): number {
        const content = editBox.string;
        const value = (content ? parseFloat(content) : 0) || 0;
        return value;
    }

    private onCubicBezierToggleClicked(): void {
        this.isCubicBezier = this.cubicBezierToggle.isChecked;
        this.updateCubicBezierUI();
        this.isNeedUpdate = true;
    }

    private onPointTouchMove(event: EventTouch): void {
        const node: Node = event.target;
        const delta = event.getDelta();
        node.setPosition(node.position.x + delta.x, node.position.y + delta.y);
        this.onPointMove();
    }

    private onPointMove(): void {
        this.startPoint.x = this.startPointNode.position.x;
        this.startPoint.y = this.startPointNode.position.y;

        this.endPoint.x = this.endPointNode.position.x;
        this.endPoint.y = this.endPointNode.position.y;

        this.controlPoint1.x = this.controlPoint1Node.position.x;
        this.controlPoint1.y = this.controlPoint1Node.position.y;

        this.controlPoint2.x = this.controlPoint2Node.position.x;
        this.controlPoint2.y = this.controlPoint2Node.position.y;

        this.updatePointEditBoxContent();

        this.isNeedUpdate = true;
    }

    private onPointInput(): void {

        this.startPoint.x = this.readEditBoxNumber(this.startPointEditBox[0]);
        this.startPoint.y = this.readEditBoxNumber(this.startPointEditBox[1]);

        this.endPoint.x = this.readEditBoxNumber(this.endPointEditBox[0]);
        this.endPoint.y = this.readEditBoxNumber(this.endPointEditBox[1]);

        this.controlPoint1.x = this.readEditBoxNumber(this.controlPoint1EditBox[0]);
        this.controlPoint1.y = this.readEditBoxNumber(this.controlPoint1EditBox[1]);

        this.controlPoint2.x = this.readEditBoxNumber(this.controlPoint2EditBox[0]);
        this.controlPoint2.y = this.readEditBoxNumber(this.controlPoint2EditBox[1]);

        this.updatePointNodePosition();

        this.isNeedUpdate = true;
    }

    private updateCubicBezierUI(): void {
        this.controlPoint1Node.getComponentInChildren(Label).string = this.isCubicBezier ? '控制点1' : '控制点';
        this.controlPoint2Node.active = this.isCubicBezier;
        this.controlPoint2UI.active = this.isCubicBezier;
    }

    private updatePointNodePosition(): void {
        this.startPointNode.setPosition(this.startPoint.x, this.startPoint.y);
        this.endPointNode.setPosition(this.endPoint.x, this.endPoint.y);
        this.controlPoint1Node.setPosition(this.controlPoint1.x, this.controlPoint1.y);
        this.controlPoint2Node.setPosition(this.controlPoint2.x, this.controlPoint2.y);
    }

    private updatePointEditBoxContent(): void {
        this.startPointEditBox[0].string = this.startPoint.x.toFixed(1);
        this.startPointEditBox[1].string = this.startPoint.y.toFixed(1);

        this.endPointEditBox[0].string = this.endPoint.x.toFixed(1);
        this.endPointEditBox[1].string = this.endPoint.y.toFixed(1);

        this.controlPoint1EditBox[0].string = this.controlPoint1.x.toFixed(1);
        this.controlPoint1EditBox[1].string = this.controlPoint1.y.toFixed(1);

        this.controlPoint2EditBox[0].string = this.controlPoint2.x.toFixed(1);
        this.controlPoint2EditBox[1].string = this.controlPoint2.y.toFixed(1);
    }

    private startBezierAnimation(): void {

        // https://github.com/cocos/cocos-awesome-tech-solutions/blob/3.7.x-release/demo/Creator3.7.3_GameTimeScale/assets/scripts/ModelTween.ts#L20

        const bezierPoint = new Vec3(this.startPoint.x, this.startPoint.y, 0);
        const bezierTween = new Tween(bezierPoint);
        const progressX = (_start: number, _end: number, current: number, ratio: number) => {
            current = this.isCubicBezier ?
                this.bezier(this.startPoint.x, this.controlPoint1.x, this.controlPoint2.x, this.endPoint.x, ratio) :
                this.quadratic(this.startPoint.x, this.controlPoint1.x, this.endPoint.x, ratio)
            return current;
        };

        const progressY = (_start: number, _end: number, current: number, ratio: number) => {
            current = this.isCubicBezier ?
                this.bezier(this.startPoint.y, this.controlPoint1.y, this.controlPoint2.y, this.endPoint.y, ratio) :
                this.quadratic(this.startPoint.y, this.controlPoint1.y, this.endPoint.y, ratio)
            return current;
        };


        bezierTween.parallel(
            tween().to(this.animationDuration, { x: this.endPoint.x }, { progress: progressX, onUpdate: () => this.animationNode.setPosition(bezierPoint) }),
            tween().to(this.animationDuration, { y: this.endPoint.y }, { progress: progressY, onUpdate: () => this.animationNode.setPosition(bezierPoint) }),
        ).repeatForever().start();
    }

    // copy from cc.bezier
    private bezier(start: number, control1: number, control2: number, end: number, ratio: number): number {
        return (1 - ratio) * ((1 - ratio) * (start + (control1 * 3 - start) * ratio) + control2 * 3 * ratio * ratio) + end * ratio * ratio * ratio;
    }

    private quadratic(start: number, control: number, end: number, ratio: number): number {
        const t1 = 1 - ratio;
        return t1 * t1 * start + 2 * ratio * t1 * control + ratio * ratio * end;
    }

    private genCode(): void {
        const tween3: string = `//Bezier参数\nconst startPointX = ${this.startPoint.x}, startPointY = ${this.startPoint.y};\nconst endPointX = ${this.endPoint.x}, endPointY = ${this.endPoint.y};\nconst controlPoint1X = ${this.controlPoint1.x}, controlPoint1Y = ${this.controlPoint1.y};\nconst controlPoint2X = ${this.controlPoint2.x}, controlPoint2Y = ${this.controlPoint2.y};\n\n//动画参数\nconst bezierNode:cc.Node = xxx;\nconst bezierTweenTag: number = xxx;\nconst animationDuration: number = xxx;\n\nconst progressX = (start: number, end: number, _current: number, ratio: number) =>\n    (1 - ratio) * ((1 - ratio) * (start + (controlPoint1X * 3 - start) * ratio) + controlPoint2X * 3 * ratio * ratio) + end * ratio * ratio * ratio;\nconst progressY = (start: number, end: number, _current: number, ratio: number) =>\n    (1 - ratio) * ((1 - ratio) * (start + (controlPoint1Y * 3 - start) * ratio) + controlPoint2Y * 3 * ratio * ratio) + end * ratio * ratio * ratio;\nconst bezierPosition: Vec3 = new Vec3(startPointX, startPointY);\nconst bezierTween: Tween<Vec3> = new Tween(bezierPosition);\nbezierTween.tag(bezierTweenTag);\nbezierTween.parallel(\n    tween().to(animationDuration, { x: endPointX }, { progress: progressX, onUpdate: () => bezierNode.setPosition(bezierPosition) }),\n    tween().to(animationDuration, { y: endPointY }, { progress: progressY, onUpdate: () => bezierNode.setPosition(bezierPosition) }),\n);\nbezierTween.start();\n`;
        const tween2: string = ``;
        console.log(tween3);
    }
}

