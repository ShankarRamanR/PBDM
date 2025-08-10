
export interface SlideContent {
  id: number;
  section: string;
  title: string;
  subtitle?: string;
  content?: string[];
  code?: string;
  codeOutput?: string;
  businessApplication?: string;
  isTitleSlide?: boolean;
  isSectionTitle?: boolean;
  isJoinDiagram?: boolean;
  isFinalChallenge?: boolean;
}
