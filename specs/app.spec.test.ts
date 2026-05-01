import { AppSpec } from './app.spec';

describe('AppSpec Configuration', () => {
  it('should have valid auth config', () => {
    expect(AppSpec.auth).toBeDefined();
  });
});
