import { ILLMProvider, GenerateAnswerRequest, ExplainDifferenceRequest } from './provider';
import { LegalAnswer } from '@/domain/legal/response';
import { v4 as uuidv4 } from 'uuid';

export class MockLLMProvider implements ILLMProvider {
  async generateLegalAnswer(request: GenerateAnswerRequest): Promise<LegalAnswer> {
    const qLower = request.question.toLowerCase();
    
    // Simulate missing jurisdiction
    if ((qLower.includes('tenant') || qLower.includes('tenancy')) && !request.jurisdiction) {
      return {
        answer: 'I need to know your jurisdiction to answer this question accurately.',
        explanation: 'Tenancy laws vary significantly by location. Please provide your country or state.',
        citations: [],
        evidence: [],
        assumptions: [],
        missingContext: ['Jurisdiction is required to determine the notice period.'],
        uncertainties: ['Notice periods vary by jurisdiction.'],
        nextSteps: ['Provide your jurisdiction to get a specific answer.'],
      };
    }

    // Simulate insufficient evidence
    if (request.evidence.length === 0) {
      return {
        answer: 'I cannot find sufficient evidence to answer this question.',
        explanation: 'The provided documents do not contain information related to your query.',
        citations: [],
        evidence: [],
        assumptions: [],
        missingContext: [],
        uncertainties: ['The available sources do not cover this topic.'],
        nextSteps: ['Upload a relevant document or ask a different question.'],
      };
    }
    
    // Simulate high risk
    if (qLower.includes('evict') || qLower.includes('arrest')) {
      return {
        answer: 'This is a high-risk situation that requires professional legal advice.',
        explanation: 'Eviction or arrest processes are complex and highly sensitive. Incorrect actions can have severe consequences.',
        citations: [],
        evidence: request.evidence,
        assumptions: [],
        missingContext: [],
        uncertainties: [],
        nextSteps: ['Consult a qualified attorney immediately.'],
        risk: {
          level: 'CRITICAL',
          category: 'Immediate Harm or Legal Jeopardy',
          reason: 'Involves potential loss of housing or liberty.'
        },
        escalation: 'Please contact a local legal aid organization or attorney immediately.'
      };
    }

    // Normal supported answer
    return {
      answer: 'Based on the provided evidence, the landlord must give 90 days written notice.',
      explanation: 'The Residential Tenancies Act 1986 specifies that for periodic tenancies, a 90-day written notice is required.',
      citations: [
        {
          citationId: uuidv4(),
          evidenceId: request.evidence[0]?.evidenceId || uuidv4(),
          sourceId: request.evidence[0]?.sourceId || uuidv4(),
          displayLabel: 'Section 51(1)(a)'
        }
      ],
      evidence: request.evidence,
      assumptions: ['The tenancy is periodic.'],
      missingContext: [],
      uncertainties: [],
      nextSteps: ['Ensure the notice is provided in writing.', 'Count 90 days from the date of service.'],
    };
  }
  async explainDifference(request: ExplainDifferenceRequest): Promise<string> {
    if (request.changeType === 'UNCHANGED') {
      return 'The sections are identical.';
    }
    if (request.changeType === 'ADDED') {
      return 'This section was added. It introduces new terms or obligations.';
    }
    if (request.changeType === 'REMOVED') {
      return 'This section was removed, eliminating its previous terms or obligations.';
    }
    if (request.changeType === 'MODIFIED') {
      if (request.afterText?.includes('60 days') && request.beforeText?.includes('30 days')) {
        return 'The notice period was increased from 30 days to 60 days. This gives the party more time to prepare.';
      }
      return 'The text was modified, which may alter the legal meaning or obligations.';
    }
    if (request.changeType === 'MOVED') {
      return 'The section was moved to a different part of the document, but the core text remains similar.';
    }
    return 'The difference requires manual review.';
  }

  async generateDocumentSummary(text: string): Promise<import('@/domain/documents/document').DocumentSummary> {
    const isHighRisk = text.toLowerCase().includes('indemnify') || text.toLowerCase().includes('liability');
    
    return {
      summary: 'This document outlines the standard terms and conditions. It specifies the obligations of both parties, the notice periods required for termination, and the confidentiality requirements.',
      checklist: [
        'Review the termination clause and ensure you can comply with the notice period.',
        'Verify that the liability cap is acceptable to your business risk.',
        'Ensure all confidential information is properly marked as per the confidentiality section.'
      ],
      riskLevel: isHighRisk ? 'High' : 'Medium'
    };
  }
}
