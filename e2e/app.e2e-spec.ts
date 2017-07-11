import { SmcuDocumentNumberPage } from './app.po';

describe('smcu-document-number App', () => {
  let page: SmcuDocumentNumberPage;

  beforeEach(() => {
    page = new SmcuDocumentNumberPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to smcu!!');
  });
});
