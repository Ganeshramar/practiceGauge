import { Component, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-swipe',
  templateUrl: './swipe.component.html',
  styleUrls: ['./swipe.component.scss']
})
export class SwipeComponent  implements AfterViewInit{
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
  swipeArray:any = {leftShow: false, dataShow:true, rightShow:false};
  showLeftButton: boolean = false;
  showRightButton: boolean = false;
  showDataLeft: boolean  = true;
  showDataRight: boolean  = true;
  showData: boolean  = true;
  showID!: number;
  previousID!: number;
  touchStart! :number;
  touchMove! :number;
  mainData:any;
  first:any;
  second:any;
  third:any;
  last:any;
  subParent:any;
  basic:number =1;
  isDrag:boolean = false;
  screenWidth = window.innerWidth /2;
  click:number = 0;
  calc!:number ;
  startInit:number = 0;
  constructor(public elementRef: ElementRef, private changeDetectorRef: ChangeDetectorRef){}
  ngOnInit(){
  }
  ngAfterViewInit(): void {
    this.loadElement();
  }

  loadElement(){
    const parentDiv = this.elementRef.nativeElement.querySelector('#mainDiv');
    this.subParent = parentDiv.querySelector('.sub-parent');
    this.mainData = this.subParent.querySelector('.main-data');
    this.first = this.subParent.querySelector('.first');
    this.second = this.subParent.querySelector('.second');
    this.third = this.subParent.querySelector('.third');
    this.last = this.subParent.querySelector('.last');
    // console.log(this.first);
    // console.log(this.second);
    // console.log(this.third);
    // console.log(this.last);
    // console.log(this.mainData);
  }

  touchInit(event:any,id:number){
    this.isDrag = true;
    this.showID = id;
    this.calc = 0;
    this.touchStart = event.touches[0].clientX;
    this.checkValue(event,'start',id);
  }

  touchStop(event:any,id:number){
    this.isDrag = false;
    if(this.click === 0){
      this.startInit = 0;
    }
    this.click = 1;
    console.log('Screen startInit:', this.startInit);
    // console.log(this.calc,'calc', this.click);
    // this.checkValue(event,'stop',id);
    // console.log('leftShow',this.swipeArray.leftShow,'dataShow',this.swipeArray.dataShow,'rightShow',this.swipeArray.rightShow);
  }

  checkValue(event:any,type:string,id:number){
    if(type === ('move' || 'start')) {
      this.touchMove = event.touches[0].clientX;
      // console.log(this.touchStart,'touchStart');
      // console.log(this.touchMove,'touchMove');
    }
    // console.log('Screen width:', this.screenWidth);
    // if((this.screenWidth > this.touchStart) && (this.screenWidth > this.touchMove)){
    //   this.checkChanges(id,event);
    // }
    // else if((this.screenWidth < this.touchStart) && (this.screenWidth < this.touchMove)){
    //   this.checkChanges(id,event);
    // }
    // else if((this.screenWidth < this.touchStart) && (this.screenWidth > this.touchMove)){
    //   this.checkChanges(id,event);
    // }
    // else if((this.screenWidth > this.touchStart) && (this.screenWidth < this.touchMove)){
    if(this.click != 0){ this.checkChanges(id,event); }
    // }else{
    //   this.showLeftButton = true;
    //   this.showRightButton = true;
    // }
    this.changeDetectorRef.detectChanges();
  }

  checkChanges(id:number,event:any){
    this.calc = this.touchStart - this.touchMove;
    // if(this.previousID != this.showID){
    //   this.previousID = this.showID;
    //   this.swipeArray.rightShow = false;
    //   this.swipeArray.dataShow = true;
    //   this.swipeArray.leftShow = false;
    //   // console.log('previos iD', this.previousID);
    // }
    if(this.isDrag && this.showID === id){
      if(this.touchStart < this.touchMove){
          if(this.calc <= -120 && this.showData && (this.startInit === 0)){
            this.showRightButton = false;
            this.showLeftButton = true;
            this.showData = false;
            this.startInit = -1;
            console.log(this.calc,'left show');
          }else if (this.calc <= -120 && this.startInit === -2){
            this.showData = true;
            this.startInit = 0;
            console.log(this.calc,'data show');
          }
      }
      else if(this.touchStart > this.touchMove){
        if(this.calc >= 120 && this.showData && (this.startInit === 0)){
          this.showLeftButton = false;
          this.showRightButton = true;
          this.showData = false;
          this.startInit = -2;
          console.log(this.calc,'right show');
        }else if (this.calc >= 120 && this.startInit === -1){
          this.showData = true;
          this.startInit = 0;
          console.log(this.calc,'data show');
        }
      }
    }
    else if(!this.isDrag && event.cancelable){
      event.preventDefault();
    }
  }

  checkClick(id:number){
    console.log('click');
    if(this.showID === id){
      console.log('click 3');
    }
  }
}
