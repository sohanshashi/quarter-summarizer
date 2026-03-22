import { Injectable } from '@nestjs/common';
import * as nunjucks from 'nunjucks';

@Injectable()
export class PromptService {
  private env: nunjucks.Environment;

  constructor() {
    this.env = nunjucks.configure(__dirname, {
      autoescape: false,
      trimBlocks: true,
      lstripBlocks: true,
    });
  }

  render(templateName: string, context?: Record<string, any>) {
    return this.env.render(templateName, context);
  }
}
