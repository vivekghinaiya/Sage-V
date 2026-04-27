import { ULCAFeedbackRequest } from "../components/Feedback/FeedbackTypes";
import { sageVAPI, apiInstance } from "./apiConfig";

const listServices = async (): Promise<ServiceList[]> => {
  const response = await apiInstance({
    method: "GET",
    url: sageVAPI.listServices,
  });
  return response.data;
};

const listallkeys = async (target_service_id: string) => {
  const response = await apiInstance.get(
    `/auth/api-key/list?target_service_id=${target_service_id}`
  );
  return response.data;
};

const listalluserkeys = async (target_service_id: string, user_id: string) => {
  const response = await apiInstance.get(
    `/auth/api-key/list?target_user_id=${user_id}&target_service_id=${target_service_id}`
  );
  return response.data;
};

const getService = async (
  serviceId: string | string[]
): Promise<ServiceView> => {
  const response = await apiInstance({
    method: "POST",
    url: sageVAPI.viewService,
    data: { serviceId },
  });
  return response.data;
};

const submitFeedback = async (feedback: ULCAFeedbackRequest) => {
  const response = await apiInstance.post(
    `/services/feedback/submit`,
    feedback
  );
  return response.data;
};

const fetchFeedbackQuestions = async (feedbackRequest: unknown) => {
  const response = await apiInstance.post(
    "/services/feedback/questions",
    feedbackRequest
  );
  return response.data;
};

export {
  listServices,
  getService,
  submitFeedback,
  listallkeys,
  listalluserkeys,
  fetchFeedbackQuestions,
};
