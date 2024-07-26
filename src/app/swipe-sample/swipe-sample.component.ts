import { Component, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-swipe-sample',
  templateUrl: './swipe-sample.component.html',
  styleUrls: ['./swipe-sample.component.scss']
})
export class SwipeSampleComponent {
  deviceList:any = [
    {id:1, data:'Swipe Me 1'},
    {id:2, data:'Swipe Me 2'},
    {id:3, data:'Swipe Me 3'},
    {id:4, data:'Swipe Me 4'},
    {id:5, data:'Swipe Me 5'},
    {id:6, data:'Swipe Me 6'},
    {id:7, data:'Swipe Me 7'},
    {id:8, data:'Swipe Me 8'},
    {id:9, data:'Swipe Me 9'},
    {id:10, data:'Swipe Me 10'},
    {id:11, data:'Swipe Me 11'}
  ];
  subParent:any;
  mainData:any;
  touchStart: any;
  touchMove: any;
  constructor(public elementRef: ElementRef){}

  ngAfterViewInit(): void {
    this.loadElement();
  }

  loadElement(){
    const parentDiv = this.elementRef.nativeElement.querySelector('#mainDiv');
    this.subParent = parentDiv.querySelector('.sub-parent');
    this.mainData = this.subParent.querySelector('.main-data');
    // this.first = this.subParent.querySelector('.first');
    // this.second = this.subParent.querySelector('.second');
    // this.third = this.subParent.querySelector('.third');
    // this.last = this.subParent.querySelector('.last');
  }

  touchInit(event:any, id:number){
    this.touchStart = event.touches[0].clientX;
  }

  checkValue(event:any, id:number){
    this.touchMove = event.touches[0].clientX;
    const calc = this.touchMove - this.touchStart;
    const fourthMainData = this.elementRef.nativeElement.querySelector(`#mainDiv .sub-parent:nth-child(${id}) .main-data`);
    fourthMainData.setAttribute('style', `transform:translateX(${calc}px)`);
    fourthMainData.setAttribute('style', `width:${100 - (calc*0.25)}%`);
    // console.log(fourthMainData,id);
  }

  touchStop(event:any, id:number){
    console.log(this.touchMove);
  }
}
