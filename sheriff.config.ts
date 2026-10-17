import { anyTag, sameTag, SheriffConfig } from '@softarc/sheriff-core';

export const config: SheriffConfig = {
  version: 1,
  enableBarrelLess: true,
  modules: {
    'projects/market-watch-frontend/src/app/domains/<domain>/features/<feature>': [
      'domain:<domain>',
      'type:feature',
    ],
    'projects/market-watch-frontend/src/app/domains/<domain>/ui/<component>': [
      'domain:<domain>',
      'type:ui',
    ],
    'projects/market-watch-frontend/src/app/domains/<domain>/data-access/<module>': [
      'domain:<domain>',
      'type:data-access',
    ],
    'projects/market-watch-frontend/src/app/domains/<domain>/utils/<module>': [
      'domain:<domain>',
      'type:util',
    ],
    'projects/market-watch-frontend/src/app/domains/<domain>/<subdomain>/features/<feature>': [
      'domain:<domain>',
      'type:feature',
    ],
    'projects/market-watch-frontend/src/app/domains/<domain>/<subdomain>/ui/<component>': [
      'domain:<domain>',
      'type:ui',
    ],
    'projects/market-watch-frontend/src/app/domains/<domain>/<subdomain>/data-access/<module>': [
      'domain:<domain>',
      'type:data-access',
    ],
    'projects/market-watch-frontend/src/app/domains/<domain>/<subdomain>/utils/<module>': [
      'domain:<domain>',
      'type:util',
    ],
    'projects/market-watch-frontend/src/app/shared/<module>': 'domain:shared',
  },
  depRules: {
    root: anyTag,
    'domain:*': [sameTag, 'domain:shared', 'root'],
    'type:feature': [sameTag, 'type:ui', 'type:data-access', 'type:util', 'domain:shared', 'root'],
    'type:ui': [sameTag, 'type:util', 'domain:shared', 'root'],
    'type:data-access': [sameTag, 'type:util', 'domain:shared', 'root'],
    'type:util': ['domain:shared', 'root'],
    'type:shared': ['type:shared'],
  },
};