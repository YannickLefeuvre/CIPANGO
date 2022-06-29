export interface IAudio {
  id?: number;
  url?: string | null;
}

export class Audio implements IAudio {
  constructor(public id?: number, public url?: string | null) {}
}

export function getAudioIdentifier(audio: IAudio): number | undefined {
  return audio.id;
}
