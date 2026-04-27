import axios from "axios";

const sageVRootURL: string = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;

const sageVAPI: { [key: string]: string } = {
  listServices: `${sageVRootURL}/services/details/list_services`,
  viewService: `${sageVRootURL}/services/details/view_service`,
  listModels: `${sageVRootURL}/services/details/list_models`,
  viewModel: `${sageVRootURL}/services/details/view_model`,
  genericInference: `${sageVRootURL}/services/inference`,
  translationInference: `${sageVRootURL}/services/inference/translation`,
  ttsInference: `${sageVRootURL}/services/inference/tts`,
  asrInference: `${sageVRootURL}/services/inference/asr`,
  asrStreamingInference: `wss://${sageVRootURL?.replace(/^https?:\/\//, "")}`,
  nerInference: `${sageVRootURL}/services/inference/ner`,
  pipelineInference: `${sageVRootURL}/services/inference/pipeline`,
  xlitInference: `${sageVRootURL}/services/inference/transliteration`,
};

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const apiInstance = axios.create({ baseURL: sageVRootURL });

function onTokenRefreshed(token: string): void {
  refreshSubscribers.forEach((subscriber) => subscriber(token));
  refreshSubscribers = [];
}

apiInstance.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && window.location.pathname !== "/") {
    localStorage.setItem("current_page", window.location.href);
  }
  if (config.headers) {
    config.headers["request-startTime"] = String(new Date().getTime());
    const accessToken =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
      config.headers["x-auth-source"] = "AUTH_TOKEN";
    }
  }
  return config;
});

apiInstance.interceptors.response.use(
  (response) => {
    const currentTime = new Date().getTime();
    const startTime = response.config.headers?.["request-startTime"];
    if (startTime) {
      response.headers["request-duration"] = String(
        currentTime - Number(startTime)
      );
    }
    return response;
  },
  (error: unknown) => {
    const axiosError = error as {
      response?: { status: number };
      config?: { _retry?: boolean; url?: string; headers?: Record<string, string> };
    };
    const originalRequest = axiosError.config;
    if (
      axiosError.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      originalRequest.url !== `${sageVRootURL}/auth/refresh`
    ) {
      if (!isRefreshing) {
        isRefreshing = true;
        const refreshToken =
          typeof window !== "undefined"
            ? localStorage.getItem("refresh_token")
            : null;
        return axios
          .post(`${sageVRootURL}/auth/refresh`, { token: refreshToken })
          .then((res) => {
            if (res.status === 200) {
              if (typeof window !== "undefined") {
                localStorage.setItem("access_token", res.data.token);
              }
              apiInstance.defaults.headers.common["Authorization"] =
                "Bearer " + res.data.token;
              onTokenRefreshed(res.data.token);
              return apiInstance(originalRequest as Parameters<typeof apiInstance>[0]);
            }
          })
          .catch((e: unknown) => {
            if (
              typeof window !== "undefined" &&
              window.location.pathname !== "/"
            ) {
              window.location.replace("/");
            }
            throw e;
          })
          .finally(() => {
            isRefreshing = false;
          });
      } else {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            if (originalRequest?.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            resolve(apiInstance(originalRequest as Parameters<typeof apiInstance>[0]));
          });
        });
      }
    }
    throw error;
  }
);

export { sageVAPI, apiInstance };
