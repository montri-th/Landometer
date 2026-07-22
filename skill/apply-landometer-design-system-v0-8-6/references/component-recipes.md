# Landometer component recipes v0.8.6

Machine schema/preflight validation is pending. These recipes implement the human-readable normative master.

## DecisionCard

Order: Object → status/metric → meaning → evidence/limit → one next useful action.

Required fields: object ID/version, truth status, source/date, limitation, next action or deliberate clean completion. Missing is never zero. Partial is never success.

## SourceLedger

Show source, publisher, date, supported claim, boundary, limitation, and allowed use. Keep material source/date/confidence beside the claim; disclose full method when requested.

## Button

Use a native button with one intent, 44px minimum target, visible focus, pending/disabled reason, authoritative receipt, duplicate-action protection, and failure recovery.

## Empty and error states

Keep the governed object and user input visible. Say what is unavailable, why, what remains possible, and how to retry or continue safely.

## MapLegend

Keep geometry, selected object, legend, readout, source/date, classification, limitation, and accessible table synchronized from one state.
