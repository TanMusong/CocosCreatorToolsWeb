import { Color, Component, EditBox, Graphics, IVec2Like, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('bezier')
export class Bezier extends Component {

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


    private isCubicBezier: boolean = false;
    private isPointChanged: boolean = false;

    private startPoint: IVec2Like = null;
    private endPoint: IVec2Like = null;
    private controlPoint1: IVec2Like = null;
    private controlPoint2: IVec2Like = null;


    protected onLoad(): void {
        this.graphicsPanel.lineWidth = 10;
        this.graphicsPanel.strokeColor = Color.GREEN;

        this.startPoint = { x: 0, y: 0 };
        this.endPoint = { x: 0, y: 0 };
        this.controlPoint1 = { x: 0, y: 0 };
        this.controlPoint2 = { x: 0, y: 0 };
    }

    protected update(dt: number): void {
        if (!this.isPointChanged) return;
        this.isPointChanged = false;
        this.graphicsPanel.clear();
        this.graphicsPanel.moveTo(this.startPoint.x, this.startPoint.y);
        if (this.isCubicBezier) {
            this.graphicsPanel.bezierCurveTo(this.controlPoint1.x, this.controlPoint1.y, this.controlPoint2.x, this.controlPoint2.y, this.endPoint.x, this.endPoint.y);
        } else {
            this.graphicsPanel.quadraticCurveTo(this.controlPoint1.x, this.controlPoint1.y, this.endPoint.x, this.endPoint.y);
        }
        this.graphicsPanel.stroke();
    }

    private readEditBoxNumber(editBox: EditBox): number {
        const content = editBox.string;
        const value = (content ? parseFloat(content) : 0) || 0;
        return value;
    }

    protected onPointInput(): void {

        this.startPoint.x = this.readEditBoxNumber(this.startPointEditBoxs[0]);
        this.startPoint.y = this.readEditBoxNumber(this.startPointEditBoxs[1]);

        this.endPoint.x = this.readEditBoxNumber(this.endPointEditBoxs[0]);
        this.endPoint.y = this.readEditBoxNumber(this.endPointEditBoxs[1]);

        this.controlPoint1.x = this.readEditBoxNumber(this.controlPoint1EditBoxs[0]);
        this.controlPoint1.y = this.readEditBoxNumber(this.controlPoint1EditBoxs[1]);

        this.controlPoint2.x = this.readEditBoxNumber(this.controlPoint2EditBoxs[0]);
        this.controlPoint2.y = this.readEditBoxNumber(this.controlPoint2EditBoxs[1]);

        this.isPointChanged = true;
    }
}

