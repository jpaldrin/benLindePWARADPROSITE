import { AppPage } from './app.po';

describe('RadAppPro App', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
    });

    it('should display application title: RadAppPro', () => {
        page.navigateTo();
        expect(page.getAppTitle()).toEqual('RadAppPro');
    });
});
