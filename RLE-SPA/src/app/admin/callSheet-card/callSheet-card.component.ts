import { Component, OnInit, Input, Renderer2, ElementRef, Output, EventEmitter, ViewChild } from '@angular/core';
import { CardRotatingComponent } from 'ng-uikit-pro-standard';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-callSheet-card',
  templateUrl: './callSheet-card.component.html',
  styleUrls: ['./callSheet-card.component.scss']
})
export class CallSheetCardComponent implements OnInit {
  @Input() user: any;
  @Input() index: number;
  @Output() setSelection = new EventEmitter<any>();
  firstClick = true;

  constructor(private renderer: Renderer2, private el: ElementRef) { }
  @ViewChild('cards', { static: true }) flippingCard: CardRotatingComponent;

  ngOnInit() {
    const cardWrapper = this.el.nativeElement.querySelectorAll('.card-wrapper');
    this.renderer.setStyle(cardWrapper[0], 'height', '180px');

    if (this.user.isSelected) {
      // const cardRotating = this.el.nativeElement.querySelectorAll('.card-rotating');
      // this.renderer.addClass(cardRotating[0], 'flipped');
      this.flippingCard.toggle();
    }
  }

  addSelection(index, userId) {
    const absenceData = <any>{};
    absenceData.index = index;
    absenceData.userId = userId;
    this.setSelection.emit(absenceData);
  }
}
