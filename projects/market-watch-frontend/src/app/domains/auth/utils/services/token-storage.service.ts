import { inject, Service } from '@angular/core';
import { LocalStorageService } from '../../../../shared/data-access/local-storage-service/local-storage.service';

@Service()
export class TokenStorage {
  private readonly storage = inject(LocalStorageService);

  private readonly accessTokenKey = 'market-watch:access-token';
  private readonly refreshTokenKey = 'market-watch:refresh-token';

  getAccessToken(): string | null {
    return this.storage.getItem<string>(this.accessTokenKey);
  }

  getRefreshToken(): string | null {
    return this.storage.getItem<string>(this.refreshTokenKey);
  }

  getRefreshAndAccessTokens(): { accessToken: string; refreshToken: string } | null {
    const accessToken = this.storage.getItem<string>(this.accessTokenKey);
    const refreshToken = this.storage.getItem<string>(this.refreshTokenKey);

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  }

  setTokens(accessToken: string, refreshToken: string): void {
    this.storage.setItem(this.accessTokenKey, accessToken);
    this.storage.setItem(this.refreshTokenKey, refreshToken);
  }

  clearTokens(): void {
    this.storage.removeItem(this.accessTokenKey);
    this.storage.removeItem(this.refreshTokenKey);
  }
}
