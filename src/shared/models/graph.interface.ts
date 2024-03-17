export interface GraphNode {
    id: string;
    index: number;
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    fx: number;
    fy: number;
    fz: number;
    content: GraphContent;
    parent?: string;
}

export interface GraphLink {
    source: string;
    target: string;
    index?: number;
}

export interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export interface GraphContent {
    title: string;
    color: string;
    imageLink?: string;
    canCollapse?: boolean,
    elements?: GraphContent[];
}

export interface GraphCamera {
    x: number;
    y: number;
    z: number;
}