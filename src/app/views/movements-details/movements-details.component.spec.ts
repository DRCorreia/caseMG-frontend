import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementsDetailsComponent } from './movements-details.component';

describe('MovementsDetailsComponent', () => {
  let component: MovementsDetailsComponent;
  let fixture: ComponentFixture<MovementsDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MovementsDetailsComponent]
    });
    fixture = TestBed.createComponent(MovementsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
