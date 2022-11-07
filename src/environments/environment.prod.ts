export const environment = {
  production: true,
  apiUrl: 'https://algamoney-api-java.herokuapp.com',
  tokenAllowedDomains: [ new RegExp('algamoney-api-java.herokuapp.com') ],
  tokenDisallowedRoutes: [ new RegExp('\/oauth2\/token') ],
  oauthCallbackUrl: 'https://algamoney-api-java.herokuapp.com/authorized',
  logoutRedirectTo: 'https://algamoney-api-java.herokuapp.com/'
};
