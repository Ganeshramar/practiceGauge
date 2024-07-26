import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxGaugeModule } from 'ngx-gauge';
import { StepComponent } from './step/step.component';
import { GuageComponent } from './guage/guage.component';
import { ClockComponent } from './clock/clock.component';
import { FormsModule } from '@angular/forms';
import { BipolarComponent } from './bipolar/bipolar.component';
import { LongPressDirective } from './long-press.directive';
import { CanvasComponent } from './canvas/canvas.component';
import { GuageBipolarComponent } from './guage-bipolar/guage-bipolar.component';
import { SwipeComponent } from './swipe/swipe.component';
import { SampleSwipeComponent } from './sample-swipe/sample-swipe.component';
import { SwipeSampleComponent } from './swipe-sample/swipe-sample.component';

@NgModule({
  declarations: [
    AppComponent,
    StepComponent,
    GuageComponent,
    ClockComponent,
    BipolarComponent,
    LongPressDirective,
    CanvasComponent,
    GuageBipolarComponent,
    SwipeComponent,
    SampleSwipeComponent,
    SwipeSampleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxGaugeModule,FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
