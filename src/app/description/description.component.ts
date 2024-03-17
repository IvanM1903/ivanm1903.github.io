import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NodeCategory } from '../../shared/enums/graph.enum';
import { GraphContent, GraphNode } from '../../shared/models/graph.interface';
import { KeyToTitlePipe } from '../../shared/pipes/key-to-title.pipe';

@Component({
  selector: 'imp-description',
  standalone: true,
  imports: [KeyToTitlePipe, CommonModule],
  templateUrl: './description.component.html',
  styleUrl: './description.component.scss'
})
export class DescriptionComponent {
  @Input()
  public node: GraphNode | null = null;
  @Input()
  public parentNode: GraphNode | null = null;
  @Output()
  public categorySelected: EventEmitter<GraphContent> = new EventEmitter<GraphContent>();

  public nodeCategories: typeof NodeCategory = NodeCategory;

  public getNodeChildren() {
    return this.node?.content.elements;
  }

  public sectionSelected(category: GraphContent) {
    this.categorySelected.emit(category);
  }

  public goBack() {
    const category: GraphContent = {color: this.parentNode?.content.color, title: this.parentNode?.content.title} as GraphContent;
    this.categorySelected.emit(category);
  }
}
