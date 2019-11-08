namespace RadAppPro.Pwa.Authorization
{
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using DAL.Core;
    using DAL.Models;
    using IdentityServer4.Extensions;
    using IdentityServer4.Models;
    using IdentityServer4.Services;
    using Microsoft.AspNetCore.Identity;

    public class ProfileService : IProfileService
    {
        #region Setup
        private readonly UserManager<ApplicationUser> _usrMgr;
        private readonly IUserClaimsPrincipalFactory<ApplicationUser> _claimsFactory;

        public ProfileService(UserManager<ApplicationUser> userManager, IUserClaimsPrincipalFactory<ApplicationUser> claimsFactory)
        {
            _usrMgr = userManager;
            _claimsFactory = claimsFactory;
        }
        #endregion
        #region GetProfileDataAsync
        public async Task GetProfileDataAsync(ProfileDataRequestContext context)
        {
            //throw new System.NotImplementedException();
            var sub = context.Subject.GetSubjectId();
            var user = await _usrMgr.FindByIdAsync(sub);
            var principal = await _claimsFactory.CreateAsync(user);

            //return list of claims identities
            var claims = principal.Claims.ToList();
            // get using a lambda of claims where requested claim type contains the type of claim requested.
            claims = claims.Where(claim => context.RequestedClaimTypes.Contains(claim.Type)).ToList();

            if (user.JobTitle != null)
            {
                claims.Add(new System.Security.Claims.Claim(PropertyConstants.JobTitle, user.JobTitle));
            }
            if (user.FullName != null)
            {
                claims.Add(new Claim(PropertyConstants.FullName, user.FullName));
            }

            if (user.Configuration != null)
            {
                claims.Add(new Claim(PropertyConstants.Configuration, user.Configuration));
            }
            context.IssuedClaims = claims;
        }
        #endregion
        #region IsActive
        public async Task IsActiveAsync(IsActiveContext context)
        {
            //throw new System.NotImplementedException();
            var sub = context.Subject.GetSubjectId();
            var user = await _usrMgr.FindByIdAsync(sub);

            context.IsActive = (user != null) && user.IsEnabled;
        }
        #endregion
    }
}
