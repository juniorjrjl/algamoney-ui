export const environment = {
  production: true,
  apiUrl: 'https://algamoney-api-java.herokuapp.com',
  tokenAllowedDomains: [ new RegExp('algamoney-api-java.herokuapp.com') ],
  tokenDisallowedRoutes: [ new RegExp('\/oauth\/token') ]
};
