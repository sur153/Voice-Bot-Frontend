/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Scenario, Assessment } from '../types'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


function extractUserText(conversationMessages: any[]): string {
  return conversationMessages
    .filter(msg => msg.role === 'user')
    .map(msg => msg.content)
    .join(' ')
    .trim()
}

export const api = {
  async getConfig() {
    const res = await fetch('https://voice-bot-backend-fmgfctdkaac7hads.eastus2-01.azurewebsites.net/api/config')
    return res.json()
  },

  async getScenarios(): Promise<Scenario[]> {
    const res = await fetch('https://voice-bot-backend-fmgfctdkaac7hads.eastus2-01.azurewebsites.net/api/scenarios')
    return res.json()
  },

  async createAgent(scenarioId: string) {
    const res = await fetch('https://voice-bot-backend-fmgfctdkaac7hads.eastus2-01.azurewebsites.net/api/agents/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenario_id: scenarioId }),
    })
    if (!res.ok) throw new Error('Failed to create agent')
    return res.json()
  },

  async analyzeConversation(
    scenarioId: string,
    transcript: string,
    audioData: any[],
    conversationMessages: any[]
  ): Promise<Assessment> {
    const referenceText = extractUserText(conversationMessages)

    const res = await fetch('https://voice-bot-backend-fmgfctdkaac7hads.eastus2-01.azurewebsites.net/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scenario_id: scenarioId,
        transcript,
        audio_data: audioData,
        reference_text: referenceText,
      }),
    })
    if (!res.ok) throw new Error('Analysis failed')
    return res.json()
  },

  async generateGraphScenario(): Promise<Scenario> {
    const res = await fetch('https://voice-bot-backend-fmgfctdkaac7hads.eastus2-01.azurewebsites.net//api/scenarios/graph', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    if (!res.ok) throw new Error('Failed to generate Graph scenario')
    return res.json()
  },
}
