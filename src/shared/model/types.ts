export type treatmentDataProps = {
  name: string;
  id: number;
  imgPath?: string;
  description?: string;
};

/** JSON-compatible API contract: each pair is [heading, one-sentence description]. */
export type TreatmentTextPair = [title: string, description: string];

export type Treatment = {
  id: number;
  name: string;
  imgPath: string;
  description: string;
  priceILS?: number;
  durationMinutes?: number;
  concernsDescription: string;
  concerns: TreatmentTextPair[];
  stepsDescription: string;
  steps: TreatmentTextPair[];
  skinTypes: string[];
  skinDescription: string;
  contraindications: string[];
  contraindicationsNote: string;
  evidence: {
    sourceIds: string[];
    limitations: string;
    reviewedAt: string;
    status: "draft-needs-clinical-review";
  };
};
