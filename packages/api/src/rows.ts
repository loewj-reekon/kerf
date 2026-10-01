import type { Measurement } from '@kerf/shared';

export interface MeasurementRow {
  id: number;
  group_id: number;
  value: number;
  label: string;
  device_id: string;
  created_at: number;
  created_by: number;
}

export function toMeasurement(row: MeasurementRow): Measurement {
  return {
    id: row.id,
    groupId: row.group_id,
    value: row.value,
    label: row.label,
    deviceId: row.device_id,
    createdAt: row.created_at,
    createdBy: row.created_by,
  };
}
