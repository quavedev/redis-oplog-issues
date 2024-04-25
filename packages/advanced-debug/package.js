Package.describe({
  name: 'advanced-debug',
  summary: 'Advanced debug',
  version: '1.0.0',
  documentation: null,
});

Package.onUse(function (api) {
  api.versionsFrom(['2.14']);

  api.use('ecmascript');

  api.mainModule('advanced-debug.js');
});
