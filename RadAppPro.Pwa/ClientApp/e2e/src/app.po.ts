import { browser, by, element } from 'protractor';

export class AppPage {
    navigateTo() {
        return browser.get('/');
    }

    getAppTitle() {
        return element(by.css('app-root .appTitle')).getText();
    }
}
