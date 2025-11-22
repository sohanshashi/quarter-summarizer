import { Injectable } from '@nestjs/common';
import * as nunjucks from 'nunjucks';
import * as path from 'path';

@Injectable()
export class PromptService {
  private env: nunjucks.Environment;

  constructor() {
    this.env = nunjucks.configure(path.join(__dirname, 'templates'), {
      autoescape: false,
      trimBlocks: true,
      lstripBlocks: true,
    });
  }

  render(templateName: string, context: Record<string, any>) {
    return this.env.render(templateName, context);
  }
}
