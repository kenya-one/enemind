/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ServiceConfigStatus } from '../types/index.js';
import { api } from '../services/api.js';

interface ConfigContextType {
  services: ServiceConfigStatus[];
  isLoading: boolean;
  isStatusModalOpen: boolean;
  openStatusModal: () => void;
  closeStatusModal: () => void;
  refreshConfigStatus: () => Promise<void>;
  unconfiguredCount: number;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<ServiceConfigStatus[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState<boolean>(false);

  useEffect(() => {
    refreshConfigStatus();
  }, []);

  async function refreshConfigStatus() {
    try {
      setIsLoading(true);
      const data = await api.getConfigStatus();
      setServices(data.services || []);
    } catch (err) {
      console.error('Failed to load config status:', err);
    } finally {
      setIsLoading(false);
    }
  }

  const unconfiguredCount = services.filter((s) => s.requiresSetup).length;

  return (
    <ConfigContext.Provider
      value={{
        services,
        isLoading,
        isStatusModalOpen,
        openStatusModal: () => setIsStatusModalOpen(true),
        closeStatusModal: () => setIsStatusModalOpen(false),
        refreshConfigStatus,
        unconfiguredCount,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
