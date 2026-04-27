import { sageVAPI, apiInstance } from "./apiConfig";

const listModels = async (): Promise<ModelList[]> => {
  const response = await apiInstance({
    method: "GET",
    url: sageVAPI.listModels,
  });
  return response.data;
};

const getModel = async (modelId: string | string[]): Promise<ModelView> => {
  const response = await apiInstance({
    method: "POST",
    url: sageVAPI.viewModel,
    data: { modelId },
  });
  return response.data;
};

export { listModels, getModel };
