import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TheftReportPage } from './theft-report.page';

describe('TheftReportPage', () => {
  let component: TheftReportPage;
  let fixture: ComponentFixture<TheftReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheftReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TheftReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
