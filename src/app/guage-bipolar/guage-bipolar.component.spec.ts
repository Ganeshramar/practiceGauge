import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuageBipolarComponent } from './guage-bipolar.component';

describe('GuageBipolarComponent', () => {
  let component: GuageBipolarComponent;
  let fixture: ComponentFixture<GuageBipolarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuageBipolarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuageBipolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
