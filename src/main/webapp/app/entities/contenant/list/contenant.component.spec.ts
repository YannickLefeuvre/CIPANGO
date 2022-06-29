import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ContenantService } from '../service/contenant.service';

import { ContenantComponent } from './contenant.component';

describe('Contenant Management Component', () => {
  let comp: ContenantComponent;
  let fixture: ComponentFixture<ContenantComponent>;
  let service: ContenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ContenantComponent],
    })
      .overrideTemplate(ContenantComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContenantComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ContenantService);

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
    expect(comp.contenants?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
