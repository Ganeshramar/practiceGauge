import { Component, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent {
  canva:any;
  spanProcent:any;
  canvaElemet:any;
  posX:any;
  posY:any;
  fps:any;
  procent:number = 0;
  oneProcent!: number;
  result: any;
  max: any;
  accelerateBar:number = 80;
  maxBar:number = 90;
  circleX:number = 100;
  circleY:number = 100;
  radius:number = 100;
  overAllPoints:number = 100;
  valuePoints:number = 0;
  isDragging:boolean = false;
  pointerValue:string = "";
  minPointerValue:string = "";
  maxPointerValue:string = "";
  ctx!: CanvasRenderingContext2D;
  constructor(private renderer: Renderer2){}
  @ViewChild('canvasElement') canvasElement !: ElementRef;
  @ViewChild('dail') dail !: ElementRef;
  @ViewChild('minLine') minLine !: ElementRef;
  @ViewChild('maxLine') maxLine !: ElementRef;

  ngAfterViewInit(){
    this.ctx = this.canvasElement.nativeElement.getContext('2d');
    this.drawCircle();
    this.canva = document.getElementById('canva');
    this.spanProcent = document.getElementById('procent');
    this.canvaElemet = this.canva.getContext('2d');
    this.setValue();
    this.posX = this.canva.width/2;
    this.posY = this.canva.height/2;
    //this.fps = ;
    this.oneProcent = 360 / 100,
    this.result = this.oneProcent * this.accelerateBar,
    this.max = this.oneProcent * this.maxBar;
    this.canvaElemet.lineCap = 'round';
    if(this.result <= 130){
      this.result = this.result + 230;
    }else if(this.result >= 230){
      this.result = this.result - 230;
    }
    if(this.max <= 130){
      this.max = this.max + 230;
    }else if(this.max >= 230){
      this.max = this.max - 230;
    }
    this.setArch();
  }

  drawCircle(){
    // this.ctx.clearRect(0,0,this.canvasElement.nativeElement.width,this.canvasElement.nativeElement.height);
    // this.ctx.beginPath();
  }

  startDrag(e:any){
    let clientX:any;
    let clientY:any;
    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
  }
  else if (e instanceof TouchEvent) {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
  }
    if(Math.sqrt((clientX - this.circleX) ** 2 + (clientY - this.circleY) ** 2) <= this.radius){
      this.isDragging = true;
    }
  }

  drag(e:any,str:string){
    let clientX:any;
    let clientY:any;
    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
  }
  else if (e instanceof TouchEvent) {
      const touch = e.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
  }
  const outerEle = this.canvasElement.nativeElement.getBoundingClientRect();
  const centerX = 8 + outerEle.width/2;//outerEle.left + outerEle.width/2;
  const centerY = 8 + outerEle.height/2;//outerEle.top + outerEle.height/2;
    if(this.isDragging || str ==='click'){
      this.circleX = clientX;
      this.circleY = clientY;
      const angle = Math.atan2(this.circleX - centerX, this.circleY - centerY);
      let deg = Math.ceil((angle * 180) / Math.PI);
      console.log(deg,'degree',angle,'angle');
      const xVal = Math.ceil(centerX + (Math.sin(angle) * this.radius));
      const yVal = Math.ceil(centerY + (Math.cos(angle) * this.radius));
      if(deg >= 50 || deg <= -50){
        if(deg <= -50 && deg < 0){
          const ratio = (this.overAllPoints /2) / 130;
          this.valuePoints = Math.floor(((deg + 50) * ratio) / -1);
        }
        if(deg >= 50 && deg <= 180){
          const ratio = (this.overAllPoints /2) / 130;
          const points = Math.floor((deg - 50) * ratio);
          this.valuePoints = (this.overAllPoints - points);
        }
        this.spanProcent.innerHTML = this.valuePoints;
        console.log(this.valuePoints, ' Points');
        this.renderer.setStyle(this.dail.nativeElement, 'transform',`translate(${xVal}px,${yVal}px)`);
      }
    }
  }

  stopDrag(e:any){
    this.isDragging = false;
  }

  setArch(){
    // var deegres = 0;
    // deegres += 1;
    var valDeg = 0;
    var maxDeg = 0;
    this.canvaElemet.clearRect( 0, 0, this.canva.width, this.canva.height );

    // this.spanProcent.innerHTML = this.accelerateBar.toFixed();

    this.canvaElemet.beginPath();
    this.canvaElemet.arc( this.posX, this.posY, this.radius, (Math.PI/180) * (270 + 230), (Math.PI/180) * (270 + 130) );//deg=231
    this.canvaElemet.strokeStyle = '#E8EBED ';
    this.canvaElemet.lineWidth = '10';
    this.canvaElemet.stroke();

    this.canvaElemet.beginPath();
    this.canvaElemet.strokeStyle = '#B8BCBF';
    this.canvaElemet.lineWidth = '4';
    this.canvaElemet.arc( this.posX, this.posY, this.radius, (Math.PI/180) * (270 + 230), (Math.PI/180) * (270 + this.max) );//deg=130
    this.canvaElemet.stroke();

    this.canvaElemet.beginPath();
    this.canvaElemet.strokeStyle = '#1D9E5E';
    this.canvaElemet.lineWidth = '4';
    this.canvaElemet.arc( this.posX, this.posY, this.radius, (Math.PI/180) * (270 + 230), (Math.PI/180) * (270 + this.result) );//deg=130
    this.canvaElemet.stroke();
  }

  setValue(){
    this.spanProcent.innerHTML = Number(this.pointerValue);
    this.valuePoints = Number(this.pointerValue);
    const degreeChange = (this.overAllPoints * 50) / 100;
    const ratio = (this.overAllPoints /2) / 130;
    const deg = -1 * Math.ceil((this.valuePoints / ratio) + 50);
    const outerEle = this.canvasElement.nativeElement.getBoundingClientRect();
    const centerX = outerEle.left + outerEle.width/2;
    const centerY = outerEle.top + outerEle.height/2;
    const angle = deg * (Math.PI / 180);
    console.log(deg,'degree',angle,'angle');
    const xVal = Math.ceil(centerX + (Math.sin(angle) * this.radius));
    const yVal = Math.ceil(centerY + (Math.cos(angle) * this.radius));
    if(deg >= -310 && deg <= -50){
      this.renderer.setStyle(this.dail.nativeElement, 'transform',`translate(${xVal}px,${yVal}px)`);
    }
  }

  setMinValue(){
    const value = Number(this.minPointerValue);
    const degreeChange = (this.overAllPoints * 50) / 100;
    const ratio = (this.overAllPoints /2) / 130;
    const deg = -1 * Math.ceil((value / ratio) + 50);
    const outerEle = this.canvasElement.nativeElement.getBoundingClientRect();
    const centerX = outerEle.left + outerEle.width/2;
    const centerY = outerEle.top + outerEle.height/2;
    const radius = 100.5;
    const angle = deg * (Math.PI / 180);
    console.log(deg,'degree',angle,'angle');
    const xVal = Math.ceil(centerX + (Math.sin(angle) * radius));
    const yVal = Math.ceil(centerY + (Math.cos(angle) * radius));
    if(deg >= -310 && deg <= -50){
      this.renderer.setStyle(this.minLine.nativeElement, 'transform',`translate(${xVal}px,${yVal}px)`);
    }
  }

  setMaxValue(){
    const value = Number(this.maxPointerValue);
    const degreeChange = (this.overAllPoints * 50) / 100;
    const ratio = (this.overAllPoints /2) / 130;
    const deg = -1 * Math.ceil((value / ratio) + 50);
    const outerEle = this.canvasElement.nativeElement.getBoundingClientRect();
    const centerX = outerEle.left + outerEle.width/2;
    const centerY = outerEle.top + outerEle.height/2;
    const radius = 105;
    const angle = deg * (Math.PI / 180);
    console.log(deg,'degree',angle,'angle');
    const xVal = Math.ceil(centerX + (Math.sin(angle) * radius));
    const yVal = Math.ceil(centerY + (Math.cos(angle) * radius));
    if(deg >= -310 && deg <= -50){
      this.renderer.setStyle(this.maxLine.nativeElement, 'transform',`translate(${xVal}px,${yVal}px)`);
    }
  }

  setTrackerPosition(deg:number, xVal:number, yVal:number){
    let xPos =  (deg < -50 && deg >= -60)? xVal +17: (deg < -60 && deg >= -75) ? xVal+18 : (deg < -75 && deg >= -85) ? xVal+17 : (deg < -85 && deg >= -105) ? xVal+16 : (deg < -105 && deg >= -112) ? xVal+13 : (deg < -112 && deg >= -122) ? xVal+12 : (deg < -122 && deg >= -138) ? xVal+8 : (deg < -138 && deg >= -148) ? xVal+6 : (deg < -148 && deg >= -157) ? xVal+5 : (deg < -157 && deg >= -165) ? xVal+3 : (deg < -165 && deg >= -174) ? xVal+1 : (deg < 175 && deg >= 170) ? xVal+1 : (deg < 170 && deg >= 161) ? xVal-3 : (deg < 161 && deg >= 153) ? xVal-5 : (deg < 153 && deg >= 145) ? xVal-6 : (deg < 145 && deg >= 138) ? xVal-8 : (deg < 138 && deg >= 127) ? xVal-10 : (deg < 127 && deg >= 120) ? xVal-12 : (deg < 120 && deg >= 112) ? xVal-13 : (deg < 112 && deg >= 102) ? xVal-15 : (deg < 102 && deg >= 85) ? xVal-17 : (deg < 85 && deg >= 63) ? xVal-18 : (deg < 63 && deg >= 56) ? xVal-19 : (deg < 56 && deg >= 50) ? xVal-17 : xVal;

    let yPos =  (deg < -50 && deg >= -60)? yVal -13: (deg < -60 && deg >= -75) ? yVal-10 :  (deg < -75 && deg >= -85) ? yVal-6 : (deg < -85 && deg >= -89) ? yVal-3 : (deg < -92 && deg >= -105) ? yVal+2 : (deg < -105 && deg >= -112) ? yVal+4 : (deg < -112 && deg >= -122) ? yVal+3 : (deg < -122 && deg >= -138) ? yVal+7 : (deg < -138 && deg >= -148) ? yVal+8 : (deg < -148 && deg >= -157) ? yVal+10 : (deg < -157 && deg >= -165) ? yVal+10 : (deg < -165 && deg >= -174) ? yVal+8 : (deg < -174 || deg >= 174) ? yVal+9 : (deg < 174 && deg >= 170) ? yVal+9 : (deg < 170 && deg >= 161) ? yVal+10 : (deg < 161 && deg >= 153) ? yVal+10 : (deg < 153 && deg >= 145) ? yVal+9 : (deg < 145 && deg >= 138) ? yVal+9 : (deg < 138 && deg >= 127) ? yVal+8 : (deg < 127 && deg >= 120) ? yVal+7 : (deg < 120 && deg >= 112) ? yVal+6 : (deg < 112 && deg >= 102) ? yVal+4 : (deg < 102 && deg >= 94) ? yVal+1 : (deg < 94 && deg >= 85) ? yVal-1 : (deg < 85 && deg >= 75) ? yVal-4 : (deg < 75 && deg >= 65) ? yVal-7 : (deg < 65 && deg >= 56) ? yVal-11 : (deg < 56 && deg >= 50) ? yVal-14 : yVal;
    console.log(xPos, yPos, deg);
    return[xPos, yPos];
  }
}


