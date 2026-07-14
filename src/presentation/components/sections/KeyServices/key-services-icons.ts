import {
  IconServiceDispatch,
  IconServiceTariff,
  IconServiceWagonSupply,
} from '$presentation/components/icons';
import type { KeyServicesIconId } from '$shared/constants/key-services';
import type { Component } from 'svelte';

export const keyServicesIcons = {
  'wagon-supply': IconServiceWagonSupply,
  'tariff-payment': IconServiceTariff,
  'dispatch-support': IconServiceDispatch,
} satisfies Record<KeyServicesIconId, Component>;
