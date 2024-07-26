import { Component } from '@angular/core';
import { trigger, state,style,animate,transition} from '@angular/animations';

@Component({
  selector: 'app-sample-swipe',
  templateUrl: './sample-swipe.component.html',
  styleUrls: ['./sample-swipe.component.scss'],
  animations: [
    trigger('fadeInOut',[
      state('visible', style({opacity: 1})),
      state('hidden', style({opacity: 0})),
      transition('visible => hidden', animate('300ms ease-out')),
      transition('hidden => visible', animate('300ms ease-in'))
    ])
  ]
})
export class SampleSwipeComponent {
  leftButtonVisible:boolean = false;
  rightButtonVisible:boolean = false;

  showButton(direction:string){
    if(direction === 'left'){
      this.leftButtonVisible = true;
      this.rightButtonVisible = false;
    }
    else if(direction === 'right'){
      this.leftButtonVisible = false;
      this.rightButtonVisible = true;
    }

    const leftWidth = this.leftButtonVisible ? this.getButtonWidth('left-button') : 0;
    const rightWidth = this.rightButtonVisible ? this.getButtonWidth('right-button') : 0;
  }

  getButtonWidth(buttonClass: string){
    const buttonElement = document.querySelector(`${buttonClass}`) as HTMLElement;
    return buttonElement;
  }

}
