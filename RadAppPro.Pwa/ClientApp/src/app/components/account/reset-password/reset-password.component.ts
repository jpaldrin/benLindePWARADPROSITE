import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';

import { AlertService, MessageSeverity } from '../../../services/alert.service';
import { AppTranslationService } from "../../../services/app-translation.service";
import { AuthService } from "../../../services/auth.service";
import { AccountService } from "../../../services/account.service";
import { Utilities } from '../../../services/utilities';

@Component({
  selector: "reset-password",
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  isLoading = false;
  isSuccess: boolean;
  formResetToggle = true;
  resetCode: string;
  usernameOrEmail: string;
  newPassword: string;
  confirmationPassword: string;

  gT = (key: string | Array<string>, interpolateParams?: Object) => this.translationService.getTranslation(key, interpolateParams);

  constructor(private route: ActivatedRoute, private alertService: AlertService, private translationService: AppTranslationService, private authService: AuthService, private accountService: AccountService) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      let loweredParams = Utilities.GetObjectWithLoweredPropertyNames(params);
      this.resetCode = loweredParams['code'];

      if (!this.resetCode)
        this.accountService.gotoHomePage();
    });
  }

  showErrorAlert(caption: string, message: string) {
    if (caption)
      caption = this.gT(caption);

    if (message)
      message = this.gT(message);

    this.alertService.showMessage(caption, message, MessageSeverity.error);
  }

  resetPassword() {
    this.isLoading = true;
    this.alertService.startLoadingMessage("", this.gT("resetPassword.alerts.ResettingPassword"));

    this.accountService.resetPassword(this.usernameOrEmail, this.newPassword, this.resetCode)
      .subscribe(response => {
        this.alertService.stopLoadingMessage();
        this.isLoading = false;
        this.isSuccess = true;
        this.alertService.showMessage(this.gT("resetPassword.alerts.PasswordChange"), this.gT("resetPassword.alerts.PasswordSuccessfullyReset"), MessageSeverity.success);
        this.authService.logout();
      },
        error => {
          this.alertService.stopLoadingMessage();
          this.isLoading = false;
          this.isSuccess = false;

          let errorMessage = Utilities.findHttpResponseMessage("error_description", error);

          if (errorMessage)
            this.alertService.showStickyMessage(this.gT("resetPassword.alerts.PasswordResetFailed"), errorMessage, MessageSeverity.error, error);
          else
            this.alertService.showStickyMessage(this.gT("resetPassword.alerts.PasswordResetFailed"), this.gT("resetPassword.alerts.PasswordResetErrorOccured", { error: Utilities.getResponseBody(error) }), MessageSeverity.error, error);
        });
  }

  reset() {
    this.formResetToggle = false;

    setTimeout(() => {
      this.formResetToggle = true;
    });
  }
}
