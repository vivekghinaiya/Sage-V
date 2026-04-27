interface ServiceList {
  serviceId: string;
  name: string;
  serviceDescription: string;
  hardwareDescription: string;
  publishedOn: number;
  modelId: string;
  task: { type?: string } | null;
  languages: LanguageConfig[];
  isActive?: boolean;
  taskType?: string;
}

interface ServiceView {
  name: string;
  serviceDescription: string;
  hardwareDescription: string;
  publishedOn: number;
  modelId: string;
  isActive?: boolean;
  model: {
    version: string;
    task: { type: string };
    languages: LanguageConfig[];
    inferenceEndPoint: {
      schema: {
        request: unknown;
        response: unknown;
      };
    };
  };
}

interface LanguageConfig {
  sourceLanguage: string;
  targetLanguage: string;
}
