export const environment = {
  production: true,
  apiUrl: 'https://algamoney-api-java.herokuapp.com',
  tokenWhitelistedDomains: [ new RegExp('algamoney-api-java.herokuapp.com') ],
  tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ]
};
