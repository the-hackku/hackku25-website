export interface ParticipantInfo {
  [key: string]: string | number | boolean | null; // Allows for dynamic fields
}

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  ParticipantInfo: ParticipantInfo | null;
}
