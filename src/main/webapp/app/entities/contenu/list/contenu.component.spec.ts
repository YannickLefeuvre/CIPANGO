import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ContenuService } from '../service/contenu.service';

import { ContenuComponent } from './contenu.component';

describe('Contenu Management Component', () => {
  let comp: ContenuComponent;
  let fixture: ComponentFixture<ContenuComponent>;
  let service: ContenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ContenuComponent],
    })
      .overrideTemplate(ContenuComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContenuComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ContenuService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.contenus?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
