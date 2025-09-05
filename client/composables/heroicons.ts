import * as OutlineIcons from '@heroicons/vue/24/outline'
import * as SolidIcons from '@heroicons/vue/24/solid'
import type { Component } from 'vue'

export const allIcons: Record<'outline' | 'solid', Record<string, Component>> = {
  outline: OutlineIcons as Record<string, Component>,
  solid: SolidIcons as Record<string, Component>,
}
