import { defineProject } from 'vitest/config';

export default defineProject({
  test: {
    name: 'api',
    execArgv: ['--no-warnings=ExperimentalWarning'],
  },
});
