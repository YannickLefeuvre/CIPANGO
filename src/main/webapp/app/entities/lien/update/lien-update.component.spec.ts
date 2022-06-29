import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LienService } from '../service/lien.service';
import { ILien, Lien } from '../lien.model';
import { IContenant } from 'app/entities/contenant/contenant.model';
import { ContenantService } from 'app/entities/contenant/service/contenant.service';

import { LienUpdateComponent } from './lien-update.component';

describe('Lien Management Update Component', () => {
  let comp: LienUpdateComponent;
  let fixture: ComponentFixture<LienUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let lienService: LienService;
  let contenantService: ContenantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LienUpdateComponent],
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
      .overrideTemplate(LienUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LienUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    lienService = TestBed.inject(LienService);
    contenantService = TestBed.inject(ContenantService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call villeOrigine query and add missing value', () => {
      const lien: ILien = { id: 456 };
      const villeOrigine: IContenant = { id: 8070 };
      lien.villeOrigine = villeOrigine;

      const villeOrigineCollection: IContenant[] = [{ id: 1716 }];
      jest.spyOn(contenantService, 'query').mockReturnValue(of(new HttpResponse({ body: villeOrigineCollection })));
      const expectedCollection: IContenant[] = [villeOrigine, ...villeOrigineCollection];
      jest.spyOn(contenantService, 'addContenantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lien });
      comp.ngOnInit();

      expect(contenantService.query).toHaveBeenCalled();
      expect(contenantService.addContenantToCollectionIfMissing).toHaveBeenCalledWith(villeOrigineCollection, villeOrigine);
      expect(comp.villeOriginesCollection).toEqual(expectedCollection);
    });

    it('Should call villeCible query and add missing value', () => {
      const lien: ILien = { id: 456 };
      const villeCible: IContenant = { id: 47445 };
      lien.villeCible = villeCible;

      const villeCibleCollection: IContenant[] = [{ id: 14590 }];
      jest.spyOn(contenantService, 'query').mockReturnValue(of(new HttpResponse({ body: villeCibleCollection })));
      const expectedCollection: IContenant[] = [villeCible, ...villeCibleCollection];
      jest.spyOn(contenantService, 'addContenantToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ lien });
      comp.ngOnInit();

      expect(contenantService.query).toHaveBeenCalled();
      expect(contenantService.addContenantToCollectionIfMissing).toHaveBeenCalledWith(villeCibleCollection, villeCible);
      expect(comp.villeCiblesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const lien: ILien = { id: 456 };
      const villeOrigine: IContenant = { id: 26027 };
      lien.villeOrigine = villeOrigine;
      const villeCible: IContenant = { id: 83412 };
      lien.villeCible = villeCible;

      activatedRoute.data = of({ lien });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(lien));
      expect(comp.villeOriginesCollection).toContain(villeOrigine);
      expect(comp.villeCiblesCollection).toContain(villeCible);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Lien>>();
      const lien = { id: 123 };
      jest.spyOn(lienService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lien });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lien }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(lienService.update).toHaveBeenCalledWith(lien);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Lien>>();
      const lien = new Lien();
      jest.spyOn(lienService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lien });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: lien }));
      saveSubject.complete();

      // THEN
      expect(lienService.create).toHaveBeenCalledWith(lien);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Lien>>();
      const lien = { id: 123 };
      jest.spyOn(lienService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ lien });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(lienService.update).toHaveBeenCalledWith(lien);
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
