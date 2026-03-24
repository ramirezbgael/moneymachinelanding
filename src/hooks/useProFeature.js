import { useCallback, useState } from 'react'
import { usePlan } from './usePlan'

/**
 * Bloqueo de features Pro + modal de upgrade.
 * @returns {{ isPro: boolean, ensurePro: (fn: () => void) => boolean, upgradeOpen: boolean, setUpgradeOpen: (v: boolean) => void, refresh: () => Promise<void> }}
 */
export function useProFeature() {
  const { isPro, refresh } = usePlan()
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  /** Ejecuta fn solo si es Pro; si no, abre el modal. @returns true si ejecutó */
  const ensurePro = useCallback(
    (fn) => {
      if (isPro) {
        fn()
        return true
      }
      setUpgradeOpen(true)
      return false
    },
    [isPro],
  )

  return {
    isPro,
    ensurePro,
    upgradeOpen,
    setUpgradeOpen,
    refresh,
  }
}
