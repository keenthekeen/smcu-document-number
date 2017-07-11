import { browser, by, element } from 'protractor';

export class SmcuDocumentNumberPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('smcu-root h1')).getText();
  }
}
