import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAddComponent } from './user-add.component';

describe('UserAddComponent', () => {
  let component: UserAddComponent;
  let fixture: ComponentFixture<UserAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAddComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
