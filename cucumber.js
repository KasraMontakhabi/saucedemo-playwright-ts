module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'features/support/world.ts',
      'features/support/hooks.ts',
      'features/step_definitions/**/*.ts'
    ],
    paths: ['features/**/*.feature'],
    format: ['progress', 'json:reports/cucumber/report.json'],
    publishQuiet: true,
    parallel: 2
  }
};
