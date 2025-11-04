import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArticlesService } from './articles.service';
import { environment } from '../../environments/environment';
import { ApiResponse, Article } from './types';

describe('ArticlesService', () => {
  let service: ArticlesService;
  let httpMock: HttpTestingController;

  const API_BASE_URL = `${environment.apiUrl}/articles`;

  const mockApiResponse: ApiResponse = {
    count: 2,
    next: null,
    previous: null,
    results: [
      {
        id: 1,
        title: 'SpaceX Launches Falcon Heavy',
        summary: 'SpaceX successfully launched its Falcon Heavy rocket with multiple payloads.',
        published_at: '2024-01-15T10:30:00Z',
        image_url: 'https://example.com/spacex.jpg',
        url: 'https://example.com/article/1'
      },
      {
        id: 2,
        title: 'NASA Mars Rover Discovery',
        summary: 'NASA rover makes groundbreaking discovery on Mars surface.',
        published_at: '2024-01-10T14:20:00Z',
        image_url: 'https://example.com/nasa.jpg',
        url: 'https://example.com/article/2'
      }
    ]
  };

  const mockArticle: Article = mockApiResponse.results[0];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArticlesService],
    });

    service = TestBed.inject(ArticlesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('creates the service', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchArticlesApi', () => {
    it('returns the API response', () => {
      service.fetchArticlesApi(1, 10, 0).subscribe((response) => {
        expect(response).toEqual(mockApiResponse);
      });

      const req = httpMock.expectOne(API_BASE_URL + '?offset=0&page=1&limit=10');
      expect(req.request.method).toBe('GET');
      req.flush(mockApiResponse);
    });

    it('propagates HTTP errors', (done) => {
      service.fetchArticlesApi(1, 10, 0).subscribe({
        next: () => done.fail('expected an error'),
        error: (error) => {
          expect(error.status).toBe(500);
          done();
        },
      });

      const req = httpMock.expectOne(API_BASE_URL + '?offset=0&page=1&limit=10');
      expect(req.request.method).toBe('GET');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getArticleById', () => {
    it('returns a single article when found', () => {
      service.getArticleById(1).subscribe((article) => {
        expect(article).toEqual(mockArticle);
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockArticle);
    });

    it('maps 404 responses to undefined', () => {
      service.getArticleById(999).subscribe((article) => {
        expect(article).toBeUndefined();
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/999`);
      expect(req.request.method).toBe('GET');
      req.flush('Not Found', { status: 404, statusText: 'Not Found' });
    });

    it('propagates non-404 errors', (done) => {
      const consoleSpy = spyOn(console, 'error');

      service.getArticleById(1).subscribe({
        next: () => done.fail('expected an error'),
        error: (error) => {
          expect(error.status).toBe(500);
          expect(consoleSpy).toHaveBeenCalled();
          done();
        },
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
    });
  });
});
