import { BasicInfoPage } from "./pages/BasicInfoPage";
import { CopySelectPage } from "./pages/CopySelectPage";
import { DesignDetailPage } from "./pages/DesignDetailPage";
import { ImageUploadPage } from "./pages/ImageUploadPage";
import { OptionSelectPage } from "./pages/OptionSelectPage";
import { ResultPage } from "./pages/ResultPage";
import { ToneSelectPage } from "./pages/ToneSelectPage";

export const STEPS = {
  basic: { path: "/", label: "기본정보" },                
  tone: { path: "/tone", label: "초대 멘트 톤 선택" },              
  image: { path: "/image", label: "내 이미지" },           
  design: { path: "/design", label: "디자인" },             
  result: { path: "/result", label: "결과" },  
  options: { path: "/options", label: "특별한 기능" },             
};

export const routes = [
  { path: STEPS.basic.path, element: <BasicInfoPage /> },
  { path: STEPS.tone.path, element: <ToneSelectPage /> },
  { path: STEPS.image.path, element: <ImageUploadPage /> },
  { path: STEPS.design.path, element: <DesignDetailPage /> },
  { path: STEPS.result.path, element: <ResultPage /> },
  { path: STEPS.options.path, element: <OptionSelectPage /> },
];