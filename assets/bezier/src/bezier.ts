import { color } from 'cc';
import { Color, Component, EditBox, EventTouch, Graphics, IVec2Like, Node, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('bezier')
export class Bezier extends Component {

    @property(Color)
    private bezierLineColor: Color = null;

    @property(Color)
    private controlLineColor: Color = null;

    @property(Node)
    private startPointNode: Node = null;

    @property(Node)
    private controlPoint1Node: Node = null;

    @property(Node)
    private controlPoint2Node: Node = null;

    @property(Node)
    private endPointNode: Node = null;

    @property([EditBox])
    private startPointEditBoxs: EditBox[] = [];

    @property([EditBox])
    private controlPoint1EditBoxs: EditBox[] = [];

    @property([EditBox])
    private controlPoint2EditBoxs: EditBox[] = [];

    @property([EditBox])
    private endPointEditBoxs: EditBox[] = [];

    @property(Graphics)
    private graphicsPanel: Graphics = null;


    private isCubicBezier: boolean = true;
    private isNeedUpdate: boolean = false;

    private startPoint: IVec2Like = null;
    private endPoint: IVec2Like = null;
    private controlPoint1: IVec2Like = null;
    private controlPoint2: IVec2Like = null;


    protected onLoad(): void {

        this.startPoint = { x: 0, y: 0 };
        this.endPoint = { x: 0, y: 0 };
        this.controlPoint1 = { x: 0, y: 0 };
        this.controlPoint2 = { x: 0, y: 0 };

        this.setupPointNode(this.startPointNode);
        this.setupPointNode(this.controlPoint1Node);
        this.setupPointNode(this.controlPoint2Node);
        this.setupPointNode(this.endPointNode);
    }

    private setupPointNode(node: Node): void {
        node.on(Node.EventType.TOUCH_START, () => node.on(Node.EventType.TOUCH_MOVE, this.onPointTouchMove, this));
        node.on(Node.EventType.TOUCH_CANCEL, () => node.off(Node.EventType.TOUCH_MOVE, this.onPointTouchMove, this));
        node.on(Node.EventType.TOUCH_END, () => node.off(Node.EventType.TOUCH_MOVE, this.onPointTouchMove, this));
    }

    protected update(dt: number): void {
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

    private onPointTouchMove(event: EventTouch): void {
        const node: Node = event.target;
        const delta = event.getDelta();
        node.setPosition(node.position.x + delta.x, node.position.y + delta.y);
        this.onPointMove();
    }

    private readEditBoxNumber(editBox: EditBox): number {
        const content = editBox.string;
        const value = (content ? parseFloat(content) : 0) || 0;
        return value;
    }

    protected onPointMove(): void {
        this.startPoint.x = this.startPointNode.position.x;
        this.startPoint.y = this.startPointNode.position.y;
        this.startPointEditBoxs[0].string = this.startPoint.x.toFixed(1);
        this.startPointEditBoxs[1].string = this.startPoint.y.toFixed(1);

        this.endPoint.x = this.endPointNode.position.x;
        this.endPoint.y = this.endPointNode.position.y;
        this.endPointEditBoxs[0].string = this.endPoint.x.toFixed(1);
        this.endPointEditBoxs[1].string = this.endPoint.y.toFixed(1);

        this.controlPoint1.x = this.controlPoint1Node.position.x;
        this.controlPoint1.y = this.controlPoint1Node.position.y;
        this.controlPoint1EditBoxs[0].string = this.controlPoint1.x.toFixed(1);
        this.controlPoint1EditBoxs[1].string = this.controlPoint1.y.toFixed(1);

        this.controlPoint2.x = this.controlPoint2Node.position.x;
        this.controlPoint2.y = this.controlPoint2Node.position.y;
        this.controlPoint2EditBoxs[0].string = this.controlPoint2.x.toFixed(1);
        this.controlPoint2EditBoxs[1].string = this.controlPoint2.y.toFixed(1);

        this.isNeedUpdate = true;
    }

    protected onPointInput(): void {

        this.startPoint.x = this.readEditBoxNumber(this.startPointEditBoxs[0]);
        this.startPoint.y = this.readEditBoxNumber(this.startPointEditBoxs[1]);
        this.startPointNode.setPosition(this.startPoint.x, this.startPoint.y);

        this.endPoint.x = this.readEditBoxNumber(this.endPointEditBoxs[0]);
        this.endPoint.y = this.readEditBoxNumber(this.endPointEditBoxs[1]);
        this.endPointNode.setPosition(this.endPoint.x, this.endPoint.y);

        this.controlPoint1.x = this.readEditBoxNumber(this.controlPoint1EditBoxs[0]);
        this.controlPoint1.y = this.readEditBoxNumber(this.controlPoint1EditBoxs[1]);
        this.controlPoint1Node.setPosition(this.controlPoint1.x, this.controlPoint1.y);

        this.controlPoint2.x = this.readEditBoxNumber(this.controlPoint2EditBoxs[0]);
        this.controlPoint2.y = this.readEditBoxNumber(this.controlPoint2EditBoxs[1]);
        this.controlPoint2Node.setPosition(this.controlPoint2.x, this.controlPoint2.y);

        this.isNeedUpdate = true;
    }
}

