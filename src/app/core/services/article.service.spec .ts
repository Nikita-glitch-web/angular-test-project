import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ArticleService, Article } from './article.service';
import { take } from 'rxjs';
import { environment } from '../../environments/environment';

describe('ArticleService', () => {
  let service: ArticleService;
  let httpMock: HttpTestingController;

  const API_BASE_URL = `${environment.apiUrl}/articles`;

  const mockApiResponse = {
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

  const mockArticles: Article[] = [
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
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ArticleService]
    });

    service = TestBed.inject(ArticleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('fetchArticles', () => {
    it('should fetch articles and update the articles$ BehaviorSubject', () => {
      service.fetchArticles();

      const req = httpMock.expectOne(API_BASE_URL);
      expect(req.request.method).toBe('GET');

      req.flush(mockApiResponse);

      service.getArticles().pipe(take(1)).subscribe(articles => {
        expect(articles).toEqual(mockArticles);
        expect(articles.length).toBe(2);
      });
    });
  });

  describe('getArticles', () => {
    it('should return current articles from BehaviorSubject', () => {
      service.fetchArticles();
      const req = httpMock.expectOne(API_BASE_URL);
      req.flush(mockApiResponse);
      service.getArticles().pipe(take(1)).subscribe(articles => {
        expect(articles).toEqual(mockArticles);
      });
    });
  });

  describe('getFilteredArticles', () => {
    beforeEach(() => {
      service.fetchArticles();
      const req = httpMock.expectOne(API_BASE_URL);
      req.flush(mockApiResponse);
    });

    it('should return all articles when no search term is provided', () => {
      service.getFilteredArticles('').pipe(take(1)).subscribe(articles => {
        expect(articles).toEqual(mockArticles);
      });
    });

    it('should filter articles by title match', () => {
      service.getFilteredArticles('SpaceX').pipe(take(1)).subscribe(articles => {
        expect(articles.length).toBe(1);
        expect(articles[0].title).toContain('SpaceX');
      });
    });
  });

  describe('getArticleById', () => {
    it('should return the correct article when ID exists', () => {
      const mockArticle = mockArticles[0];

      service.getArticleById(1).pipe(take(1)).subscribe(article => {
        expect(article).toBeDefined();
        expect(article?.id).toBe(1);
        expect(article?.title).toBe('SpaceX Launches Falcon Heavy');
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockArticle);
    });

    it('should return undefined when article ID does not exist', () => {
      service.getArticleById(999).pipe(take(1)).subscribe(article => {
        expect(article).toBeUndefined();
      });

      const req = httpMock.expectOne(`${API_BASE_URL}/999`);
      expect(req.request.method).toBe('GET');
      req.error(new ProgressEvent('Not Found'), { status: 404, statusText: 'Not Found' });
    });
  });

  describe('error handling', () => {
    it('should handle malformed API response gracefully', () => {
      const spy = spyOn(console, 'error');

      service.fetchArticles();
      const req = httpMock.expectOne(API_BASE_URL);

      // Send malformed response
      req.flush(null);

      // Should not crash and should log error
      expect(spy).toHaveBeenCalled();
    });

    it('should handle HTTP error responses', () => {
      const spy = spyOn(console, 'error');

      service.fetchArticles();
      const req = httpMock.expectOne(API_BASE_URL);

      req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });

      service.getArticles().pipe(take(1)).subscribe(articles => {
        expect(articles).toEqual([]);
        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
