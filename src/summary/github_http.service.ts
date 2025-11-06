import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

import { GITHUB_CONSTANTS } from 'src/config/constants';

@Injectable()
export class GithubHttpService {
  private client: AxiosInstance;

  constructor(private readonly configService: ConfigService) {
    this.initializeClient();
  }

  private initializeClient() {
    this.client = axios.create({
      baseURL: GITHUB_CONSTANTS.API_BASE_URL,
      headers: this.generateHeaders(),
      timeout: GITHUB_CONSTANTS.API_REQUEST_TIMEOUT,
    });
  }

  private generateHeaders() {
    const bearerToken = this.configService.get(
      'GITHUB_PERSONAL_ACCESS_TOKEN',
    ) as string;

    if (!bearerToken) {
      throw new Error('Github personal access token not provided');
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${bearerToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
    };
  }

  public async getPullRequests(query: string) {
    // TODO
  }
}
