const lang2label: { [key: string]: string } = {
  as: "Assamese",
  awa: "Awadhi",
  bho: "Bhojpuri",
  bn: "Bangla",
  brx: "Boro",
  doi: "Dogri",
  en: "English",
  gom: "Goan-Konkani",
  gu: "Gujarati",
  hi: "Hindi",
  hne: "Hindi-Eastern (Chhattisgarhi)",
  kn: "Kannada",
  ks: "Kashmiri",
  ks_Deva: "Kashmiri (Devanagari)",
  kha: "Khasi",
  lus: "Lushai (Mizo)",
  mag: "Magahi",
  mai: "Maithili",
  ml: "Malayalam",
  mni: "Manipuri",
  mni_Beng: "Manipuri (Bengali)",
  mr: "Marathi",
  ne: "Nepali",
  or: "Oriya",
  pa: "Panjabi",
  raj: "Rajasthani",
  sa: "Sanskrit",
  sat: "Santali",
  sd: "Sindhi",
  sd_Deva: "Sindhi (Devanagari)",
  si: "Sinhala",
  ta: "Tamil",
  te: "Telugu",
  ur: "Urdu",
};

const sageVRootURL: string = process.env.NEXT_PUBLIC_BACKEND_API_URL as string;

const sageVConfig: { [key: string]: string } = {
  listServices: `${sageVRootURL}/services/details/list_services`,
  viewService: `${sageVRootURL}/services/details/view_service`,
  listModels: `${sageVRootURL}/services/details/list_models`,
  viewModel: `${sageVRootURL}/services/details/view_model`,
  genericInference: `${sageVRootURL}/services/inference`,
  translationInference: `${sageVRootURL}/services/inference/translation`,
  ttsInference: `${sageVRootURL}/services/inference/tts`,
  asrInference: `${sageVRootURL}/services/inference/asr`,
  asrStreamingInference: `wss://${sageVRootURL?.replace(/^https?:\/\//, "") ?? ""}`,
  stsInference: `${sageVRootURL}/services/inference/s2s`,
  nerInference: `${sageVRootURL}/services/inference/ner`,
};

const tag2Color: Record<string, [string, string]> = {
  "B-LOC": ["#ffcccc", "#ff0000"],
  "B-ORG": ["#cceeff", "#00aaff"],
  "B-PER": ["#d6f5d6", "#33cc33"],
  "I-LOC": ["#ffccdd", "#ff0055"],
  "I-ORG": ["#ffffcc", "#ffff00"],
  "I-PER": ["#e6ccff", "#8000ff"],
  O: ["#ffe6cc", "#ff8000"],
};

export { lang2label, tag2Color, sageVConfig };
