import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-bipolar',
  templateUrl: './bipolar.component.html',
  styleUrls: ['./bipolar.component.scss']
})
export class BipolarComponent {
    position: any;
    lastPosition: any;
    canSlide: boolean = false;
    prevVal: number = 0;
    overAllPoints: number = 1650; //overall value
    minFwPoints: number = 100; //rect min postion
    maxFwPoints: number = 1500; //rect min postion
    valuePoints: number = 1490; // default value from backend
    minRvPoints: number = 100; // rect min position
    maxRvPoints: number = 1500; // rect max position
    acceleratePoints: number = 1000; // rect max position
    degreeChange: number = (this.overAllPoints * 65.63636363636364) / 100;
    maxFwDegree: number = 0;
    minFwDegree: number = 0;
    maxRvDegree: number = 0;
    minRvDegree:number = 0;
    valDegree:number = 0;

    maxRvValue: string = "";
    maxFwValue: string = "";
    minRvValue: string = "";
    minFwValue: string = "";
    isReverse:boolean = false;
    isForward:boolean = true;
    maxRangeForward = 'M135.2366 21C137.01 20.9303 158.47 25.8305 176.078 36.9997 C193.685 48.1688 207.7 64.1369 216.455 83.0049  C225.21 101.873 228.336 122.847 225.463 143.432 C222.589 164.018 213.837 183.349 200.246 199.126';
    maxRangeReverse = 'M101.246 20.9C96.01 21 75.47 26.8305 58.078 37.9997C40.685 48.1688 26.7 64.1369 18.455 83.0049C9.21 102.873 6.336 123.847 9.463 144.432C12.589 164.018 21.837 183.349 35.246 199.126';

    constructor(private renderer: Renderer2, private elementRef: ElementRef) { }

    @ViewChild('blackReverseElement') blackReverseElement !: ElementRef;
    @ViewChild('blackForwardElement') blackForwardElement !: ElementRef;
    @ViewChild('greenReverseElement') greenReverseElement !: ElementRef;
    @ViewChild('greenForwardElement') greenForwardElement !: ElementRef;
    @ViewChild('svgEle') svgEle !: ElementRef;
    @ViewChild('outerTrack') outerTrack !: ElementRef;
    @ViewChild('innerTrack') innerTrack !: ElementRef;
    @ViewChild('track') track !: ElementRef;
    @ViewChild('leftMaxTag') leftMaxTag !: ElementRef;
    @ViewChild('leftMinTag') leftMinTag !: ElementRef;
    @ViewChild('rightMaxTag') rightMaxTag !: ElementRef;
    @ViewChild('rightMinTag') rightMinTag !: ElementRef;
    @ViewChild('mainDiv') mainDiv !: ElementRef;

    ngAfterViewInit() {
      let deg: any;
      let ratio:any;
      if(this.isReverse === true){
        ratio = this.overAllPoints / 136;
        let minPoint = this.overAllPoints - this.minRvPoints;
        let maxPoint = this.overAllPoints - this.maxRvPoints;
        let trackPoint = this.overAllPoints - this.valuePoints;
        this.minRvDegree = Math.ceil((minPoint / ratio) + 134);
        this.maxRvDegree = Math.ceil((maxPoint / ratio) + 134);
        this.valDegree = Math.ceil((trackPoint / ratio) + 134);
        this.setReverseMinTagPosition();
        this.setReverseMaxTagPosition();
      }
      else if(this.isForward == true){
        ratio = this.overAllPoints / 137 ;
        if (this.valuePoints <= this.degreeChange) {
            this.minFwDegree = Math.ceil((this.minFwPoints / ratio) + 270);
            this.maxFwDegree = Math.ceil((this.maxFwPoints / ratio) + 270);
            this.valDegree = Math.ceil((this.valuePoints / ratio) + 270);
        }
        else if (this.valuePoints > this.degreeChange) {
            let minPoint = (this.minFwPoints >= this.degreeChange) ? (this.minFwPoints - this.degreeChange) : this.minFwPoints;
            this.minFwDegree = (this.minFwPoints >= this.degreeChange) ? Math.ceil( minPoint / ratio) : (Math.ceil( minPoint / ratio) + 270);
            this.maxFwDegree = Math.ceil((this.maxFwPoints - this.degreeChange) / ratio);
            this.valDegree = Math.ceil((this.valuePoints - this.degreeChange) / ratio);
        }
        this.setForwardMinTagPosition();
        this.setForwardMaxTagPosition();
      }
      deg = this.valDegree;
      const angle = deg * (Math.PI / 180);
      this.updateBipolarTrackerPosition(deg, angle);
      this.animateBiPolarProgressBar(this.acceleratePoints);
      this.animateBipolarMaxBar();
      //this.checkSVG();
    }

    ngOnInit():void{debugger
      this.checkSVG();
    }

    animateBiPolarProgressBar(points: number) {
      const progress = (this.isReverse === true) ? Math.floor(points * 249 / this.overAllPoints) : Math.floor(points * 245 / this.overAllPoints) ;
      const endValue = (this.isReverse === true) ? 249 - progress : 245 - progress ;
      const green = (this.isReverse === true) ? this.greenReverseElement.nativeElement : this.greenForwardElement.nativeElement;
      let maxDeg = (this.isReverse === true) ? this.maxRvDegree : (this.maxFwDegree <= 48) ? this.maxFwDegree + 360 : this.maxFwDegree;
      let minDeg = (this.isReverse === true) ? this.minRvDegree : (this.minFwDegree <= 48) ? this.minFwDegree + 360 : this.minFwDegree;
      let degree = (this.isReverse === true) ? this.valDegree : (this.valDegree <= 48) ? this.valDegree + 360 : this.valDegree;
      if((this.isReverse === true) && (maxDeg <= degree && minDeg >= degree)){
        green.style['stroke-dashoffset'] = endValue;
      }
      else if((this.isForward === true) && (minDeg <= degree && degree <= maxDeg)){
        green.style['stroke-dashoffset'] = endValue;
      }
    }

    animateBipolarMaxBar() {
      const progress = (this.isReverse === true) ? Math.floor(this.maxRvPoints * 249 / this.overAllPoints) : Math.floor(this.maxFwPoints * 245 / this.overAllPoints) ;
      const endValue = (this.isReverse === true) ? 249 - progress : 245 - progress ;
      const black = (this.isReverse === true) ? this.blackReverseElement.nativeElement : this.blackForwardElement.nativeElement;
      let maxDeg = (this.isReverse === true) ? this.maxRvDegree : (this.maxFwDegree <= 48) ? this.maxFwDegree + 360 : this.maxFwDegree;
      let minDeg = (this.isReverse === true) ? this.minRvDegree : (this.minFwDegree <= 48) ? this.minFwDegree + 360 : this.minFwDegree;
      let degree = (this.isReverse === true) ? this.valDegree : (this.valDegree <= 48) ? this.valDegree + 360 : this.valDegree;
      const grey = (this.isReverse === true) ? this.blackForwardElement.nativeElement : this.blackReverseElement.nativeElement;
      if((this.isReverse === true) && (maxDeg <= degree && minDeg > degree)){
        black.style['stroke-dashoffset'] = endValue;
        grey.style['stroke-dashoffset'] = 100;
        this.blackForwardElement.nativeElement.setAttribute('d',`${this.maxRangeForward}`);
      }
      else if((this.isForward === true) && (minDeg < degree && degree <= maxDeg)){
        black.style['stroke-dashoffset'] = endValue;
        grey.style['stroke-dashoffset'] = 106;
        this.blackReverseElement.nativeElement.setAttribute('d',`${this.maxRangeReverse}`)
      }
    }

    callEvent(e: any) {
      if (e.type == 'mousedown' || e.type == 'touchstart') {
        this.rangeSliderInit();
      } else if (e.type == 'mouseup' || e.type == 'mousedown') {
        this.rangeSliderStop();
      } else if (e.type == 'mousemove' || e.type == 'touchend') {
        this.rangeSliderUpdate(e);
      }
    }

    rangeSliderInit() {
      this.canSlide = true;
    }

    rangeSliderStop() {
      this.canSlide = false;
    }

    rangeSliderUpdate(e: any) {
      if (this.overAllPoints == 0) return;
      let clientX:any;
      let clientY:any;
      if(e instanceof MouseEvent){
        clientX = e.clientX;
        clientY = e.clientY;
      }else if(e instanceof TouchEvent){
        const touch = e.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
      }
      // this.position = this.pointerEvents(e);
      const outerEle = this.svgEle.nativeElement.getBoundingClientRect();
      const centerX = outerEle.left + 234 / 2;
      const centerY = outerEle.top + 234 / 2;
      const angle = Math.atan2(clientY - centerY, clientX - centerX);
      let deg = Math.ceil((angle * 180) / Math.PI);
      if (deg < 0) {
        deg += 360;
      }
      this.updateBipolarTrackerPosition(deg, angle);
      this.valDegree = deg;
      this.animateBiPolarProgressBar(this.acceleratePoints);
    }

    changeRvMaxValue() {
      this.maxRvPoints = Number(this.maxRvValue);
      this.setReverseMaxTagPosition();
    }

    changeRvMinValue() {
      this.minRvPoints = Number(this.minRvValue);
      this.setReverseMinTagPosition();
    }

    changeFwMaxValue() {
      this.maxFwPoints = Number(this.maxFwValue);
      this.setForwardMaxTagPosition();
    }

    changeFwMinValue() {
      this.minFwPoints = Number(this.minFwValue);
      this.setForwardMinTagPosition();
    }

    updateBipolarTrackerPosition(deg:number, angle:number){
      let ratio:any;
      const [xValue, yValue, xPos, yPos, rotation] = this.getTrackerPosition(deg, angle);
      let points:any;
      if(this.isReverse === true){
          ratio = this.overAllPoints / 136;
          let trackPoint = Math.ceil((deg - 134 ) * ratio);
          points = this.overAllPoints - trackPoint;
          if( deg <= this.minRvDegree && deg >= this.maxRvDegree){
              this.setTrackerPosition(xPos, yPos, rotation,xValue, yValue);
          }
      }
      else if(this.isForward === true){
          deg = deg < 49 ? deg + 360 : deg;
          ratio = this.overAllPoints / 137;
          points = Math.ceil((deg - 270 ) * ratio);
          let maxDeg = (this.maxFwDegree <= 48) ? this.maxFwDegree + 360 : this.maxFwDegree;
          let minDeg = (this.minFwDegree <= 48) ? this.minFwDegree - 360 : this.minFwDegree;
          if( deg >= minDeg && deg <= maxDeg){
              this.valuePoints = points;
              this.setTrackerPosition(xPos, yPos, rotation,xValue, yValue);
          }
      }
      this.valuePoints = points;
    }

    setTrackerPosition(xPos:number,yPos:number,rotation:number,xValue:number,yValue:number){
        const outerTrackEle = this.outerTrack.nativeElement;
        const innerTrackEle = this.innerTrack.nativeElement;
        const trackEle = this.track.nativeElement;
        this.renderer.setStyle(outerTrackEle, 'cx', `${xPos}`);
        this.renderer.setStyle(outerTrackEle, 'cy', `${yPos}`);
        this.renderer.setStyle(innerTrackEle, 'cx', `${xPos}`);
        this.renderer.setStyle(innerTrackEle, 'cy', `${yPos}`);
        this.renderer.setStyle(trackEle, 'cx', `${xPos}`);
        this.renderer.setStyle(trackEle, 'cy', `${yPos}`);
        const transformVal = `rotate(${rotation} ${xValue}, ${yValue})`;
        this.outerTrack.nativeElement.setAttribute('transform', transformVal);
        this.innerTrack.nativeElement.setAttribute('transform', transformVal);
        this.track.nativeElement.setAttribute('transform', transformVal);
    }

    getTrackerPosition(deg:number, angle:number){
      const centerX = 8 + 234 / 2; //rightElement.left + 234/ 2;
      const centerY = 8 + 234 / 2; //rightElement.top + 234 / 2;
      if (deg < 0) {
        deg += 360;
      }
      const outerEle = this.svgEle.nativeElement.getBoundingClientRect();
      const radius = outerEle.width / 2;
      let xVal = Math.ceil(centerX + (Math.cos(angle) * radius));
      let yVal = Math.ceil(centerY + (Math.sin(angle) * radius));
      let xPos = 0;
      let yPos = 0;
      if((deg >= 270 && deg <=360) || (deg <=48)){
        xPos =  (deg >= 270 && deg < 293) ? xVal - 7 : (deg >= 293 && deg < 304) ? xVal - 16 : (deg >= 304 && deg < 326) ? xVal - 18 : (deg >= 326 && deg < 337) ? xVal - 20 : (deg >= 337 && deg < 358) ? xVal - 23 : (deg >= 358 || deg < 46) ? xVal - 24 : (deg >= 46 && deg < 48) ? xVal - 22 : xVal;
        yPos = (deg >= 270 && deg < 304) ? yVal + 11 : (deg >= 304 && deg < 342) ? yVal + 9 : (deg >= 342 || deg < 49) ? yVal + 8 : yVal;
      }else{
        xPos = (deg >= 134 && deg < 144) ? xVal - 13 : (deg >= 144 && deg < 151) ? xVal - 11 :  (deg >= 151 && deg < 185) ? xVal - 9 : (deg >= 185 && deg < 191) ? xVal - 7 : (deg >= 191 && deg < 212) ? xVal - 6 : (deg >= 212 && deg < 242) ? xVal - 7 : (deg >= 242 && deg < 267) ? xVal - 8 : xVal - 6 ; //(deg >= 267 && deg < 270) ? xVal - 6;
        yPos = (deg >= 134 && deg < 190) ? yVal + 12 : (deg >= 190 && deg < 209) ? yVal + 14 : (deg >= 209 && deg < 227) ? yVal + 14 : (deg >= 227 && deg < 253) ? yVal + 13 :  yVal + 12 ; //(deg >= 267 && deg < 270) ? yVal + 3;
      }
      let rotation = 90;
      if (deg > 270 || deg <= 360) {
        rotation = (deg - 270);
      } else if (deg < 270 || deg <= 180) {
        rotation = -(deg - 180);
      } else if (deg < 180 || deg >= 134) {
        rotation = -(deg - 90);
      } else if (deg > 0 || deg < 48) {
        rotation = (deg);
      }
      let xValue = xVal - 11;
      let yValue = yVal + 2;
      return [xValue, yValue,xPos,yPos,rotation];
    }

    setReverseMaxTagPosition() {
      let ratio = this.overAllPoints / 136;
      let maxPoint = this.overAllPoints - this.maxRvPoints;
      let deg = Math.ceil((maxPoint / ratio) + 134);
      deg = (deg > 134) ? deg : 134;
      const angle = deg * (Math.PI / 180);
      const [xValue, yValue, xPos, yPos, rotation] = this.getTagPosition(deg, angle);
      this.maxRvDegree = deg ;
      const rightEle = this.leftMaxTag.nativeElement;
      if (this.minRvDegree > this.maxRvDegree) {
        if(this.valuePoints > this.maxRvPoints) {
          this.valuePoints = this.maxRvPoints;
          this.valDegree = this.maxRvDegree;
          const angle = this.maxRvDegree * (Math.PI / 180);
          this.updateBipolarTrackerPosition(this.maxRvDegree, angle);
        }
        this.renderer.setStyle(rightEle, 'x', `${xPos}`);
        this.renderer.setStyle(rightEle, 'y', `${yPos}`);
        let transformVal = `rotate(${rotation} ${xValue}, ${yValue})`;
        this.leftMaxTag.nativeElement.setAttribute('transform', transformVal);
        this.animateBiPolarProgressBar(this.acceleratePoints);
        this.animateBipolarMaxBar();
      }
    }

    setReverseMinTagPosition(){
      let ratio = this.overAllPoints / 136;
      let minPoint = this.overAllPoints -this.minRvPoints;
      let deg = Math.ceil((minPoint / ratio) + 134);
      deg = (deg > 134) ? deg : 134;
      const angle = deg * (Math.PI / 180);
      const [xValue, yValue, xPos, yPos, rotation] = this.getTagPosition(deg, angle);
      this.minRvDegree = deg;
      const rightEle = this.leftMinTag.nativeElement;
      if (this.minRvDegree > this.maxRvDegree && this.minRvDegree < 261) {
        if(this.valDegree > this.minRvDegree) {
          const angle = this.maxRvDegree * (Math.PI / 180);
          this.updateBipolarTrackerPosition(this.minRvDegree, angle);
        }
        this.renderer.setStyle(rightEle, 'x', `${xPos}`);
        this.renderer.setStyle(rightEle, 'y', `${yPos}`);
        let transformVal = `rotate(${rotation} ${xValue}, ${yValue})`;
        this.leftMinTag.nativeElement.setAttribute('transform', transformVal);
      }
    }

    setForwardMaxTagPosition() {
      let deg: any;
      let ratio = this.overAllPoints / 137 ;
      if (this.maxFwPoints < this.degreeChange) {
          deg = Math.ceil((this.maxFwPoints / ratio) + 270);
      }
      else if (this.maxFwPoints >= this.degreeChange) {
          deg = Math.ceil((this.maxFwPoints - this.degreeChange) / ratio);
      }
      deg = ((deg == 48) || (deg > 48 && deg < 134)) ? 47 : deg;
      const angle = deg * (Math.PI / 180);
      const [xValue, yValue, xPos, yPos, rotation] = this.getTagPosition(deg, angle);
      this.maxFwDegree = deg;
      const maxDeg = (this.maxFwDegree <= 48) ? this.maxFwDegree + 360 : this.maxFwDegree;
      const minDeg = (this.minFwDegree <= 48) ? this.minFwDegree - 360 : this.minFwDegree;
      const degree = (this.valDegree <= 48) ? this.valDegree + 360 : this.valDegree;
      const rightEle = this.rightMaxTag.nativeElement;
      if (minDeg < maxDeg) {
        if(degree > maxDeg) {
          this.valuePoints = this.maxFwPoints;
          this.valDegree = this.maxFwDegree;
          const angle = this.maxFwDegree * (Math.PI / 180);
          this.updateBipolarTrackerPosition(this.maxFwDegree, angle);
        }
        this.renderer.setStyle(rightEle, 'x', `${xPos}`);
        this.renderer.setStyle(rightEle, 'y', `${yPos}`);
        let transformVal = `rotate(${rotation} ${xValue}, ${yValue})`;
        this.rightMaxTag.nativeElement.setAttribute('transform', transformVal);
        this.animateBiPolarProgressBar(this.acceleratePoints);
        this.animateBipolarMaxBar();
      }
    }

    setForwardMinTagPosition(){
      let deg: any;
      let ratio = this.overAllPoints / 137;
      if (this.minFwPoints < this.degreeChange) {
          deg = Math.ceil((this.minFwPoints / ratio) + 270);
      }
      else if (this.minFwPoints >= this.degreeChange) {
          deg = Math.ceil((this.minFwPoints - this.degreeChange) / ratio);
      }
      deg = ((deg == 48) || (deg > 48 && deg < 134)) ? 47 : deg;
      const angle = deg * (Math.PI / 180);
      const [xValue, yValue, xPos, yPos, rotation] = this.getTagPosition(deg, angle);
      this.minFwDegree = deg;
      const maxDeg = (this.maxFwDegree <= 48) ? this.maxFwDegree + 360 : this.maxFwDegree;
      const minDeg = (this.minFwDegree <= 48) ? this.minFwDegree - 360 : this.minFwDegree;
      const degree = (this.valDegree <= 48) ? this.valDegree + 360 : this.valDegree;
      const rightEle = this.rightMinTag.nativeElement;
      if (minDeg < maxDeg) {
        if(degree < minDeg) {
          this.valuePoints = this.minFwPoints;
          const angle = this.minFwDegree * (Math.PI / 180);
          this.updateBipolarTrackerPosition(this.minFwDegree, angle);
        }
        this.renderer.setStyle(rightEle, 'x', `${xPos}`);
        this.renderer.setStyle(rightEle, 'y', `${yPos}`);
        let transformVal = `rotate(${rotation} ${xValue}, ${yValue})`;
        this.rightMinTag.nativeElement.setAttribute('transform', transformVal);
      }
    }

    getTagPosition(deg:number,angle:number){
      const centerX = 8 + 234 / 2; //rightElement.left + 234/ 2;
      const centerY = 8 + 234 / 2; //rightElement.top + 234 / 2;
      if (deg < 0) {
        deg += 360;
      }
      const outerEle = this.svgEle.nativeElement.getBoundingClientRect();
      const radius = outerEle.width / 2;
      let xVal = Math.ceil(centerX + (Math.cos(angle) * radius));
      let yVal = Math.ceil(centerY + (Math.sin(angle) * radius));
      let xPos = 0;
      let yPos = 0;
      if((deg >= 270 && deg <=360) || (deg <=48)){
        xPos =  (deg >= 270 && deg < 293) ? xVal - 9 : (deg >= 293 && deg < 304) ? xVal - 11 : (deg >= 304 && deg < 326) ? xVal - 12 : (deg >= 326 && deg < 337) ? xVal - 15 : (deg >= 342 && deg < 357) ? xVal - 16 : (deg >= 358 || deg < 2) ? xVal - 17 : (deg >= 2 && deg < 18) ? xVal - 21 : (deg >= 18 && deg < 32) ? xVal - 22 : (deg >= 32 && deg < 46) ? xVal - 24 : (deg >= 46 && deg < 48) ? xVal - 22 : xVal;
        yPos = (deg >= 270 && deg < 304) ? yVal + 2 : (deg >= 304 && deg < 342) ? yVal  : (deg >= 342 || deg < 24) ? yVal - 1 : (deg >= 24 && deg < 40) ? yVal - 2 : yVal;
      }else{
        xPos = (deg >= 138 && deg < 144) ? xVal : (deg >= 144 && deg < 151) ? xVal - 8 :  (deg >= 151 && deg < 185) ? xVal - 7 : (deg >= 185 && deg < 191) ? xVal - 6 : (deg >= 191 && deg < 212) ? xVal - 6 : (deg >= 212 && deg < 242) ? xVal - 7 : (deg >= 242 && deg < 267) ? xVal - 8 : xVal - 6 ; //(deg >= 267 && deg < 270) ? xVal - 6;
        yPos = (deg >= 134 && deg < 191) ? yVal + 4 : (deg >= 191 && deg < 209) ? yVal + 5 : (deg >= 209 && deg < 227) ? yVal + 6 : (deg >= 227 && deg < 267) ? yVal + 4 :  yVal + 4 ; //(deg >= 267 && deg < 270) ? yVal + 3;
      }
      let rotation = 90;
      if (deg > 270 || deg <= 360) {
        rotation = (deg - 270);
      } else if (deg < 270 || deg <= 180) {
        rotation = -(deg - 180);
      } else if (deg < 180 || deg >= 134) {
        rotation = -(deg - 90);
      } else if (deg > 0 || deg < 48) {
        rotation = (deg);
      }
      let xValue = xVal - 11;
      let yValue = yVal + 2;
      return [xValue, yValue,xPos,yPos,rotation];
    }

    checkSVG(){
      const mainDiv = this.elementRef.nativeElement.querySelector('#mainDiv');
      console.log(mainDiv.querySelector('div:nth-child(3)'));
      // mainDiv.querySelector(':nth-child(1)').style['display'] ='none';
      // console.log(mainDiv);
      // console.log(mainDiv.querySelector(':nth-child(1)'));
      // console.log(mainDiv.querySelector(':nth-child(2)'));
      // console.log(mainDiv.querySelector(':nth-child(3)'));
      // console.log(mainDiv.querySelector(':nth-child(4)'));
      // console.log(mainDiv.querySelector(':nth-child(15)'));
      // const mainDiv = this.elementRef.nativeElement.querySelector('div');
      // mainDiv.setAttribute('display', 'none');
      const svgElement = this.elementRef.nativeElement.querySelector('svg');
      console.log(svgElement.width.animVal.value);
      console.log(svgElement.querySelector(':nth-child(3)'));
      const g = svgElement.querySelector('g');
      console.log(g);
      const circle = g.querySelector('.circleTrack');
      circle.setAttribute('fill','#E57402');
      console.log(g.querySelector('.circleTrack'));
      // console.log(g.querySelector('.track:nth-child(2)'));
      // const circle = g.querySelector('g:nth-child(1)');
      // console.log(circle.querySelector('circle:nth-child(2)'));
      // console.log(svgElement.querySelector('g:nth-child(12)'));
    }

}
