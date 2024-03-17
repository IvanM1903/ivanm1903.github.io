import ForceGraph3D, { ForceGraph3DInstance } from '3d-force-graph';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SelectiveUnrealBloomPass } from '@visualsource/selective-unrealbloompass';
import { delay, of, take } from 'rxjs';
import * as THREE from 'three';
import { GRAPH_CONTENT } from '../../shared/data/graph.data';
import { NodeCategory } from '../../shared/enums/graph.enum';
import { GraphCamera, GraphContent, GraphData, GraphLink, GraphNode } from '../../shared/models/graph.interface';
import { DescriptionComponent } from '../description/description.component';

@Component({
  selector: 'imp-dashboard',
  standalone: true,
  imports: [DescriptionComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  animations: [
    trigger('sidebarTrigger', [
      state('open', style({ transform: 'translate(0%, -50%)'})),
      state('close', style({ transform: 'translate(-110%, -50%)'})),
      transition('open => close', [
        animate('300ms')
      ]),
      transition('close => open', [
        animate('300ms')
      ])
    ])
  ]
})
export class DashboardComponent implements AfterViewInit {
  public nodeCategories: typeof NodeCategory = NodeCategory;
  public nodeClicked: GraphNode | null = null;
  public parentNodeOfClicked: GraphNode | null = null;
  public isNodePreviewOpen = false;

  @ViewChild('graphWrapper')
  private graphHTMLElement: ElementRef;
  private graph: ForceGraph3DInstance;
  private cameraPosition: GraphCamera | null;

  private CAMERA_DELAY_MS = 1000;
  private CAMERA_ZOOM_OUT = 100;
  private CAMERA_ROTATE_DISTANCE = 400;

  private graphLoaded = false;
  private rootTitles: string[] = Object.values(NodeCategory);
  private rotationCameraInterval: ReturnType<typeof setTimeout>;

  @HostListener("window:resize")
  public windowResize(): void {
    const box = this.graphHTMLElement.nativeElement.getBoundingClientRect();
    this.graph?.width(box.width);
    this.graph?.height(box.height);
    // @ts-ignore
    this.graph?.controls().handleResize();
  }

  public ngAfterViewInit(): void {
    this.createGraph();
    this.addBloomPostprocessing();
    this.windowResize();
  }

  public restoreCameraView() {
    if (!this.cameraPosition) return;
    
    clearInterval(this.rotationCameraInterval);
    this.graph.cameraPosition(this.cameraPosition, { x: 0, y: 0, z: 0 }, this.CAMERA_DELAY_MS + 500);
    this.cameraPosition = null;
    this.nodeClicked = null;
    this.isNodePreviewOpen = !!this.nodeClicked;
  }

  public focusToData(nodeCategory: NodeCategory) {
    const nodeToFocus: GraphNode = this.graph.graphData().nodes.find((node) => (node as GraphNode).content.title === nodeCategory) as GraphNode;
    this.onNodeClick(nodeToFocus);
  }

  public categorySelected(event: GraphContent) {
    const nodeToFocus: GraphNode = this.graph.graphData().nodes.find((node) => (node as GraphNode).content.title === event.title) as GraphNode;
    if(!nodeToFocus) return;

    this.onNodeClick(nodeToFocus);
  }

  private createGraph() {
    this.graph = ForceGraph3D()(this.graphHTMLElement.nativeElement)
      //--- MISC ---
      .backgroundColor('#000')
      .onBackgroundClick(() => this.restoreCameraView())
      .graphData(this.generateGraphData())
      .cooldownTicks(100)
      //--- NODE PROPS ---
      .nodeColor(node => (node as GraphNode).content?.color ?? '#fff')
      .nodeLabel(node => (node as GraphNode).content.imageLink ? '' : (node as GraphNode).content.title.toUpperCase())
      .nodeThreeObject((node: any) => this.setNodeGeometry(node as GraphNode))
      .onNodeHover((node, prevNode) => this.onNodeHover(node as GraphNode, prevNode as GraphNode))
      .onNodeClick(node => this.onNodeClick(node as GraphNode))
      //--- LINK PROPS ---
      .linkOpacity(0.3);

    this.graph.onEngineStop(() => this.renderGraphOnStop());
    this.graph.d3Force('link')?.['distance'](() => 10)
  }

  private setNodeGeometry(node: GraphNode) {
    let nodeSize: number = 2;
    if(this.rootTitles.includes(node.content.title)){
      nodeSize = 4;
    }

    if(node.content.imageLink) {
      const imgTexture = new THREE.TextureLoader().load(`../../assets/${node.content.imageLink}`);
        imgTexture.colorSpace = THREE.SRGBColorSpace;
        const material = new THREE.SpriteMaterial({ map: imgTexture });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(8, 8, 8);
        return sprite;
    }
    
    return new THREE.Mesh(
      new THREE.SphereGeometry(nodeSize),
      new THREE.MeshLambertMaterial({
        color: node.content.color,
        transparent: true,
        opacity: 0.75
      })
    )
  }

  private renderGraphOnStop() {
    if (!this.graphLoaded && !this.nodeClicked) {
      this.graphLoaded = true;
      this.graph.zoomToFit(400);
    }
  }

  private generateGraphData(): GraphData {
    const nodes: GraphNode[] = this.generateNodes(GRAPH_CONTENT);
    const links: GraphLink[] = this.generateLinks(nodes);
    
    return { nodes, links } as GraphData;
  }

  private generateNodes(graphContent: GraphContent[], parentId?: string): GraphNode[] {
    const flattenedNodes: GraphNode[] = [];

    for (const item of graphContent) {
      const currentNodeId: string = window.crypto.randomUUID();
      const canShowNestedNodes = item.elements && !item.canCollapse;
      const nestedNodes = canShowNestedNodes ? this.generateNodes(item.elements || [], currentNodeId) : [];

      const currentNode = {
        id: currentNodeId,
        content: item,
        parent: parentId,
      } as GraphNode;

      flattenedNodes.push(...nestedNodes, currentNode);
    }

    return flattenedNodes;
  }

  private generateLinks(nodes: GraphNode[]): GraphLink[] {
    return nodes.filter((node) => node.parent).map((node) => ({
        source: `${(node as GraphNode).id}`,
        target: `${(node as GraphNode).parent}` ?? ''
    }));
  }

  private onNodeHover(node: GraphNode, prevNode: GraphNode) {
    //console.log(node, prevNode);
  }

  private onNodeClick(node: GraphNode) {
    this.setCameraView(node);
    this.updateHighlight(node);

    if(this.nodeClicked) {
      this.parentNodeOfClicked = this.graph.graphData().nodes.find((element) => (element as GraphNode).id === node.parent) as GraphNode;
    }

    this.nodeClicked = node;
    this.isNodePreviewOpen = !!this.nodeClicked;
  }

  
  private setCameraView(node: GraphNode) {
    if (!this.cameraPosition) {
      this.cameraPosition = this.graph.cameraPosition();
    }
        
    // Aim at node from outside it
    const distRatio = 1 + this.CAMERA_ZOOM_OUT / Math.hypot(node.x, node.y, node.z);
    
    const newPos = node.x || node.y || node.z
    ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
    : { x: 0, y: 0, z: this.CAMERA_ZOOM_OUT }; // special case if node is in (0,0,0)
    
    this.setCameraLiveRotate(newPos, node);
  }

  private setCameraLiveRotate(newPos: any, node: GraphNode) {
    clearInterval(this.rotationCameraInterval);
    let angle = 0;

    of(
      this.graph.cameraPosition({
        x: newPos.x * Math.sin(angle),
        z: newPos.z * Math.cos(angle)
      }, node, this.CAMERA_DELAY_MS)
    ).pipe(
      delay(this.CAMERA_DELAY_MS),
      take(1)
    ).subscribe({
      next: () => {
        this.rotationCameraInterval = setInterval(() => {
          this.graph.cameraPosition({
            x: newPos.x * Math.sin(angle),
            z: newPos.z * Math.cos(angle)
          }, node);
          angle += Math.PI / 300;
        }, 20);
      }
    });
  }

  private updateHighlight(node: GraphNode) {
    console.log(node);
  }

  private addBloomPostprocessing() {
    const bloomPass = new SelectiveUnrealBloomPass();
    bloomPass.strength = 4;
    bloomPass.radius = 1;
    bloomPass.threshold = 0;

    this.graph.postProcessingComposer().addPass(bloomPass);
  }
}
