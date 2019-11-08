




import { Component, OnInit, OnDestroy, Input } from "@angular/core";

import { AlertService, MessageSeverity, DialogType } from '../../services/alert.service';
import { AppTranslationService } from "../../services/app-translation.service";
import { AuthService } from "../../services/auth.service";
import { ConfigurationService } from '../../services/configuration.service';
import { Utilities } from '../../services/utilities';
import { UserLogin } from '../../models/user-login.model';

@Component({
  selector: "app-login",
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {

  userLogin = new UserLogin();
  isLoading = false;
  formResetToggle = true;
  modalClosedCallback: () => void;
  loginStatusSubscription: any;

  @Input()
  isModal = false;

  gT = (key: string | Array<string>, interpolateParams?: Object) => this.translationService.getTranslation(key, interpolateParams);


  constructor(private alertService: AlertService, private translationService: AppTranslationService, private authService: AuthService, private configurations: ConfigurationService) {

  }


  ngOnInit() {

    this.userLogin.rememberMe = this.authService.rememberMe;

    if (this.getShouldRedirect()) {
      this.authService.redirectLoginUser();
    }
    else {
      this.loginStatusSubscription = this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
        if (this.getShouldRedirect()) {
          this.authService.redirectLoginUser();
        }
      });
    }
  }


  ngOnDestroy() {
    if (this.loginStatusSubscription)
      this.loginStatusSubscription.unsubscribe();
  }


  getShouldRedirect() {
    return !this.isModal && this.authService.isLoggedIn && !this.authService.isSessionExpired;
  }


  showErrorAlert(caption: string, message: string) {
    if (caption)
      caption = this.gT(caption);

    if (message)
      message = this.gT(message);

    this.alertService.showMessage(caption, message, MessageSeverity.error);
  }

  closeModal() {
    if (this.modalClosedCallback) {
      this.modalClosedCallback();
    }
  }


  changeLanguage(language: string) {
    this.configurations.globalLanguage = language;
    this.configurations.language = language;
  }


  login() {
    this.isLoading = true;
    this.alertService.startLoadingMessage("", this.gT("login.alerts.AttemptingLogin"));

    this.authService.login(this.userLogin.userName, this.userLogin.password, this.userLogin.rememberMe)
      .subscribe(
        user => {
          setTimeout(() => {
            this.alertService.stopLoadingMessage();
            this.isLoading = false;
            this.reset();

            if (!this.isModal) {
              this.alertService.showMessage(this.gT("login.alerts.Login"), this.gT("login.alerts.Welcome", { username: user.userName }), MessageSeverity.success);
            }
            else {
              this.alertService.showMessage(this.gT("login.alerts.Login"), this.gT("login.alerts.UserSessionRestored", { username: user.userName }), MessageSeverity.success);
              setTimeout(() => {
                this.alertService.showStickyMessage(this.gT("login.alerts.SessionRestored"), this.gT("login.alerts.RetryLastOperation"), MessageSeverity.default);
              }, 500);

              this.closeModal();
            }
          }, 500);
        },
        error => {

          this.alertService.stopLoadingMessage();

          if (Utilities.checkNoNetwork(error)) {
            this.alertService.showStickyMessage(this.gT("app.NoNetwork"), this.gT("app.ServerCannotBeReached"), MessageSeverity.error, error);
            this.offerAlternateHost();
          }
          else {
            let errorMessage = Utilities.findHttpResponseMessage("error_description", error);

            if (errorMessage)
              this.alertService.showStickyMessage(this.gT("login.alerts.UnableToLogin"), this.mapLoginErrorMessage(errorMessage), MessageSeverity.error, error);
            else
              this.alertService.showStickyMessage(this.gT("login.alerts.UnableToLogin"), this.gT("login.alerts.LoginErrorOccured", { error: Utilities.getResponseBody(error) }), MessageSeverity.error, error);
          }

          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
  }


  offerAlternateHost() {
    if (Utilities.checkIsLocalHost(location.origin) && Utilities.checkIsLocalHost(this.configurations.baseUrl)) {
      this.alertService.showDialog(this.gT("login.alerts.DeveloperDemoApiNotice"), DialogType.prompt, (value: string) => {
        this.configurations.baseUrl = value;
        this.configurations.tokenUrl = value;
        this.alertService.showStickyMessage(this.gT("login.alerts.ApiChanged"), this.gT("login.alerts.ApiChangedTo", { API: value }), MessageSeverity.warn);
      },
        null,
        null,
        null,
        this.configurations.fallbackBaseUrl);
    }
  }


  mapLoginErrorMessage(error: string) {
    if (error == 'invalid_username_or_password')
      return this.gT("login.alerts.InvalidUsernameOrPassword");

    if (error == 'invalid_grant')
      return this.gT("login.alerts.AccountDisabled");

    return error;
  }


  reset() {
    this.formResetToggle = false;

    setTimeout(() => {
      this.formResetToggle = true;
    });
  }
}
