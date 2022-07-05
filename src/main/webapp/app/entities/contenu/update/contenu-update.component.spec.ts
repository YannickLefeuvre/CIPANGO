import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ContenuService } from '../service/contenu.service';
import { IContenu, Contenu } from '../contenu.model';
import { IContenant } from 'app/entities/contenant/contenant.model';
import { ContenantService } from 'app/entities/contenant/service/contenant.service';

import { ContenuUpdateComponent } from './contenu-update.component';

describe('Contenu Management Update Component', () => {
  let comp: ContenuUpdateComponent;
  let fixture: ComponentFixture<ContenuUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let contenuService: ContenuService;
  let contenantService: ContenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ContenuUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ContenuUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContenuUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contenuService = TestBed.inject(ContenuService);
    contenantService = TestBed.inject(ContenantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Contenant query and add missing value', () => {
      const contenu: IContenu = { id: 456 };
      const contenantino: IContenant = { id: 17018 };
      contenu.contenantino = contenantino;

      const contenantCollection: IContenant[] = [{ id: 38476 }];
      jest.spyOn(contenantService, 'query').mockReturnValue(of(new HttpResponse({ body: contenantCollection })));
      const additionalContenants = [contenantino];
      const expectedCollection: IContenant[] = [...additionalContenants, ...contenantCollection];
      jest.spyOn(contenantService, 'addContenantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ contenu });
      comp.ngOnInit();

      expect(contenantService.query).toHaveBeenCalled();
      expect(contenantService.addContenantToCollectionIfMissing).toHaveBeenCalledWith(contenantCollection, ...additionalContenants);
      expect(comp.contenantsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const contenu: IContenu = { id: 456 };
      const contenantino: IContenant = { id: 94428 };
      contenu.contenantino = contenantino;

      activatedRoute.data = of({ contenu });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(contenu));
      expect(comp.contenantsSharedCollection).toContain(contenantino);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contenu>>();
      const contenu = { id: 123 };
      jest.spyOn(contenuService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contenu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contenu }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(contenuService.update).toHaveBeenCalledWith(contenu);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contenu>>();
      const contenu = new Contenu();
      jest.spyOn(contenuService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contenu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contenu }));
      saveSubject.complete();

      // THEN
      expect(contenuService.create).toHaveBeenCalledWith(contenu);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contenu>>();
      const contenu = { id: 123 };
      jest.spyOn(contenuService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contenu });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(contenuService.update).toHaveBeenCalledWith(contenu);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackContenantById', () => {
      it('Should return tracked Contenant primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackContenantById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
