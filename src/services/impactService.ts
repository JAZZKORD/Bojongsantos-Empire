// ============================================================
// AksesPangan — Impact & Carbon Analytics Microservice Client
// ============================================================

import { requestApi } from './apiClient';
import type { ImpactData, ImpactTimeline } from '@/types';
import * as localData from '@/lib/data';

export const impactService = {
  async getStats(): Promise<ImpactData> {
    try {
      return await requestApi<ImpactData>('/api/impact/stats');
    } catch {
      return localData.calculateImpact();
    }
  },

  async getTimeline(): Promise<ImpactTimeline[]> {
    try {
      return await requestApi<ImpactTimeline[]>('/api/impact/timeline');
    } catch {
      return localData.getImpactTimeline();
    }
  },
};
