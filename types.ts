
export interface NewsletterOptions {
  topic: string;
  style: string;
  tone: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface ResearchResult {
  summary: string;
  sources: GroundingChunk[];
}
