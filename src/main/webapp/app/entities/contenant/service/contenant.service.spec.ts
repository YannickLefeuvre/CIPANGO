import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IContenant, Contenant } from '../contenant.model';

import { ContenantService } from './contenant.service';

describe('Contenant Service', () => {
  let service: ContenantService;
  let httpMock: HttpTestingController;
  let elemDefault: IContenant;
  let expectedResult: IContenant | IContenant[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ContenantService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nom: 'AAAAAAA',
      isCapital: false,
      iconeContentType: 'image/png',
      icone: 'AAAAAAA',
      absisce: 0,
      ordonnee: 0,
      arriereplanContentType: 'image/png',
      arriereplan: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Contenant', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Contenant()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Contenant', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          isCapital: true,
          icone: 'BBBBBB',
          absisce: 1,
          ordonnee: 1,
          arriereplan: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Contenant', () => {
      const patchObject = Object.assign({}, new Contenant());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Contenant', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nom: 'BBBBBB',
          isCapital: true,
          icone: 'BBBBBB',
          absisce: 1,
          ordonnee: 1,
          arriereplan: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Contenant', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addContenantToCollectionIfMissing', () => {
      it('should add a Contenant to an empty array', () => {
        const contenant: IContenant = { id: 123 };
        expectedResult = service.addContenantToCollectionIfMissing([], contenant);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(contenant);
      });

      it('should not add a Contenant to an array that contains it', () => {
        const contenant: IContenant = { id: 123 };
        const contenantCollection: IContenant[] = [
          {
            ...contenant,
          },
          { id: 456 },
        ];
        expectedResult = service.addContenantToCollectionIfMissing(contenantCollection, contenant);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Contenant to an array that doesn't contain it", () => {
        const contenant: IContenant = { id: 123 };
        const contenantCollection: IContenant[] = [{ id: 456 }];
        expectedResult = service.addContenantToCollectionIfMissing(contenantCollection, contenant);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(contenant);
      });

      it('should add only unique Contenant to an array', () => {
        const contenantArray: IContenant[] = [{ id: 123 }, { id: 456 }, { id: 26568 }];
        const contenantCollection: IContenant[] = [{ id: 123 }];
        expectedResult = service.addContenantToCollectionIfMissing(contenantCollection, ...contenantArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const contenant: IContenant = { id: 123 };
        const contenant2: IContenant = { id: 456 };
        expectedResult = service.addContenantToCollectionIfMissing([], contenant, contenant2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(contenant);
        expect(expectedResult).toContain(contenant2);
      });

      it('should accept null and undefined values', () => {
        const contenant: IContenant = { id: 123 };
        expectedResult = service.addContenantToCollectionIfMissing([], null, contenant, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(contenant);
      });

      it('should return initial array if no Contenant is added', () => {
        const contenantCollection: IContenant[] = [{ id: 123 }];
        expectedResult = service.addContenantToCollectionIfMissing(contenantCollection, undefined, null);
        expect(expectedResult).toEqual(contenantCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
