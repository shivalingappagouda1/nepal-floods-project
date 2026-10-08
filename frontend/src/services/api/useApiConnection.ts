/**
 * HIMALAYA-SHIELD: API Connection Status Manager
 * 
 * Provides reactive tracking of FastAPI backend connection.
 * Explicitly distinguishes between "API CONNECTED" and "LOCAL PROTOTYPE FALLBACK".
 */

import { useState, useEffect, useCallback } from 'react';
import { disasterApi } from './disasterApi';

export type ApiConnectionState = 'API CONNECTED' | 'LOCAL PROTOTYPE FALLBACK' | 'CHECKING';

let globalApiStatus: ApiConnectionState = 'CHECKING';
const listeners = new Set<(status: ApiConnectionState) => void>();

export const notifyApiStatus = (status: ApiConnectionState) => {
  if (globalApiStatus !== status) {
    globalApiStatus = status;
    listeners.forEach((listener) => listener(status));
  }
};

export const getApiStatus = (): ApiConnectionState => globalApiStatus;

export const checkBackendHealth = async (): Promise<ApiConnectionState> => {
  try {
    const health = await disasterApi.checkHealth();
    if (health && health.status === 'healthy') {
      notifyApiStatus('API CONNECTED');
      return 'API CONNECTED';
    }
  } catch {
    // API unavailable
  }
  notifyApiStatus('LOCAL PROTOTYPE FALLBACK');
  return 'LOCAL PROTOTYPE FALLBACK';
};

export const useApiConnection = () => {
  const [status, setStatus] = useState<ApiConnectionState>(globalApiStatus);

  useEffect(() => {
    const handleStatusChange = (newStatus: ApiConnectionState) => {
      setStatus(newStatus);
    };

    listeners.add(handleStatusChange);

    // Initial check on mount
    checkBackendHealth().then(setStatus);

    // Periodic heartbeat check every 15s
    const interval = setInterval(() => {
      checkBackendHealth().then(setStatus);
    }, 15000);

    return () => {
      listeners.delete(handleStatusChange);
      clearInterval(interval);
    };
  }, []);

  const refreshStatus = useCallback(async () => {
    return checkBackendHealth();
  }, []);

  return {
    status,
    isConnected: status === 'API CONNECTED',
    isFallback: status === 'LOCAL PROTOTYPE FALLBACK',
    refreshStatus,
  };
};
