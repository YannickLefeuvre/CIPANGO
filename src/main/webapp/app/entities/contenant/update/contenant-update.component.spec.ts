import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ContenantService } from '../service/contenant.service';
import { IContenant, Contenant } from '../contenant.model';
import { ILien } from 'app/entities/lien/lien.model';
import { LienService } from 'app/entities/lien/service/lien.service';
import { IContenu } from 'app/entities/contenu/contenu.model';
import { ContenuService } from 'app/entities/contenu/service/contenu.service';

import { ContenantUpdateComponent } from './contenant-update.component';

describe('Contenant Management Update Component', () => {
  let comp: ContenantUpdateComponent;
  let fixture: ComponentFixture<ContenantUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let contenantService: ContenantService;
  let lienService: LienService;
  let contenuService: ContenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ContenantUpdateComponent],
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
      .overrideTemplate(ContenantUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ContenantUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    contenantService = TestBed.inject(ContenantService);
    lienService = TestBed.inject(LienService);
    contenuService = TestBed.inject(ContenuService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Lien query and add missing value', () => {
      const contenant: IContenant = { id: 456 };
      const lien: ILien = { id: 5955 };
      contenant.lien = lien;

      const lienCollection: ILien[] = [{ id: 40751 }];
      jest.spyOn(lienService, 'query').mockReturnValue(of(new HttpResponse({ body: lienCollection })));
      const additionalLiens = [lien];
      const expectedCollection: ILien[] = [...additionalLiens, ...lienCollection];
      jest.spyOn(lienService, 'addLienToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ contenant });
      comp.ngOnInit();

      expect(lienService.query).toHaveBeenCalled();
      expect(lienService.addLienToCollectionIfMissing).toHaveBeenCalledWith(lienCollection, ...additionalLiens);
      expect(comp.liensSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Contenu query and add missing value', () => {
      const contenant: IContenant = { id: 456 };
      const maison: IContenu = { id: 75204 };
      contenant.maison = maison;

      const contenuCollection: IContenu[] = [{ id: 23047 }];
      jest.spyOn(contenuService, 'query').mockReturnValue(of(new HttpResponse({ body: contenuCollection })));
      const additionalContenus = [maison];
      const expectedCollection: IContenu[] = [...additionalContenus, ...contenuCollection];
      jest.spyOn(contenuService, 'addContenuToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ contenant });
      comp.ngOnInit();

      expect(contenuService.query).toHaveBeenCalled();
      expect(contenuService.addContenuToCollectionIfMissing).toHaveBeenCalledWith(contenuCollection, ...additionalContenus);
      expect(comp.contenusSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const contenant: IContenant = { id: 456 };
      const lien: ILien = { id: 5052 };
      contenant.lien = lien;
      const maison: IContenu = { id: 75159 };
      contenant.maison = maison;

      activatedRoute.data = of({ contenant });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(contenant));
      expect(comp.liensSharedCollection).toContain(lien);
      expect(comp.contenusSharedCollection).toContain(maison);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contenant>>();
      const contenant = { id: 123 };
      jest.spyOn(contenantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contenant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contenant }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(contenantService.update).toHaveBeenCalledWith(contenant);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contenant>>();
      const contenant = new Contenant();
      jest.spyOn(contenantService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contenant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: contenant }));
      saveSubject.complete();

      // THEN
      expect(contenantService.create).toHaveBeenCalledWith(contenant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Contenant>>();
      const contenant = { id: 123 };
      jest.spyOn(contenantService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ contenant });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(contenantService.update).toHaveBeenCalledWith(contenant);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLienById', () => {
      it('Should return tracked Lien primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLienById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackContenuById', () => {
      it('Should return tracked Contenu primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackContenuById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
