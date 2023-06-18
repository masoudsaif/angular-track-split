import {
  Directive,
  ElementRef,
  inject,
  Input,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[balanceColor]',
})
export class BalanceColorDirective implements OnInit {
  @Input({ required: true }) balance!: number;
  private element = inject(ElementRef);
  private renderer = inject(Renderer2);

  ngOnInit() {
    this.renderer.setStyle(
      this.element.nativeElement,
      'color',
      this.balance >= 0 ? '#00FF00' : '#f44336'
    );
  }
}
