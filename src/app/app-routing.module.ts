import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepComponent } from './step/step.component';
import { GuageComponent } from './guage/guage.component';
import { ClockComponent } from './clock/clock.component';
import { BipolarComponent } from './bipolar/bipolar.component';
import { GuageBipolarComponent } from './guage-bipolar/guage-bipolar.component';
import { CanvasComponent } from './canvas/canvas.component';
import {SampleSwipeComponent} from './sample-swipe/sample-swipe.component';
import {SwipeComponent} from './swipe/swipe.component';
import { SwipeSampleComponent } from './swipe-sample/swipe-sample.component';

const routes: Routes = [
  { path: 'step', component: StepComponent },
  { path: 'guage', component: GuageComponent },
  { path: 'clock', component: ClockComponent },
  { path: 'bipolar', component: BipolarComponent },
  { path: 'guage-bipolar', component: GuageBipolarComponent },
  { path: 'canvas', component: CanvasComponent },
  { path: 'sample-swipe', component: SampleSwipeComponent },
  { path: 'swipe', component: SwipeComponent },
  { path: 'swipe-sample', component: SwipeSampleComponent },
  { path: '', redirectTo: 'step', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
