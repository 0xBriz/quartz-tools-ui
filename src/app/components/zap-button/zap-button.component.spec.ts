import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZapButtonComponent } from './zap-button.component';

describe('ZapButtonComponent', () => {
  let component: ZapButtonComponent;
  let fixture: ComponentFixture<ZapButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZapButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZapButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
