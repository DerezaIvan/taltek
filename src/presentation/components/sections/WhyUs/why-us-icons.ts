import {
  IconWhyAutomation,
  IconWhyCompetencies,
  IconWhyGeography,
  IconWhyOwnFleet,
  IconWhySpeed,
  IconWhyTeam,
} from '$presentation/components/icons';
import type { WhyUsIconId } from '$shared/constants/why-us';
import type { Component } from 'svelte';

export const whyUsIcons = {
  'own-fleet': IconWhyOwnFleet,
  geography: IconWhyGeography,
  automation: IconWhyAutomation,
  speed: IconWhySpeed,
  competencies: IconWhyCompetencies,
  team: IconWhyTeam,
} satisfies Record<WhyUsIconId, Component>;
