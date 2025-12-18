import React, { useEffect, useMemo } from "react";
import styles from "./DesignDetailPage.module.css";
import ProgressBar from "../components/common/ProgressBar";
import ImageUploader from "../components/common/ImageUploader";
import FrameSelector from "../components/FrameSelector.jsx";
import { useNavigate } from "react-router-dom";
import { STEPS } from "../router.jsx";
import { useInvitation } from "../contexts/InvitationContext.jsx";
import { useFetch } from "../hooks/useFetch.jsx";
import LoadingModal from "../components/common/LoadingModal.jsx";

export function DesignDetailPage() {

  const navigate = useNavigate();
  const { data, setStyleImages, updateField } = useInvitation();
  const { loading, apiFetch, simulate } = useFetch();

  // FrameSelector는 보통 "romantic" 같은 소문자 id를 쓰니까
  // context에는 "ROMANTIC"로 저장하고, 화면에는 소문자로 내려줌
  const frameValueForUI = useMemo(() => {
    const v = data?.frame || "ROMANTIC";
    return String(v).toLowerCase();
  }, [data?.frame]);

  const handleFrameChange = (nextLowerId) => {
    const upper = String(nextLowerId || "").toUpperCase();
    updateField("frame", upper); // ✅ context에 대문자로 저장
  };

  const handleStyleImagesChange = (nextFiles) => {
    // nextFiles: File[]
    setStyleImages(nextFiles); // ✅ context.assets.styleImages에 저장
  };

  const handleNext = () => {
    navigate(STEPS.result.path);
  };

  //[API 호출]
   const handleSubmit = async () => {
      const payload = {
         groom: data.groom,
         bride: data.bride,
         wedding: data.wedding,
         extraMessage: data.extraMessage,
         additionalRequest: data.additionalRequest,
         tone: data.tone,   
         frame: data.frame, 
      };

      try {
         const mainImage = data.assets?.userImages?.[0] || null;
         console.log('메인 이미지: ', mainImage);
         const styleImages = data.assets?.styleImages || [];
         console.log('스타일 이미지: ', styleImages);
         const formData = new FormData();

         if (mainImage) formData.append("weddingImage", mainImage);
         styleImages.forEach((f) => formData.append("styleImages", f));
         formData.append("data", JSON.stringify(payload));

         console.log('요청 바디: ', formData);

         const res = await apiFetch("/api/invitations/design", {
            method: "POST",
            body: formData,
            withAuth: false,
         });

         console.log('이미지 생성 결과', res);

         if (!res.ok) {
         let msg = `요청 실패 (${res.status})`;
         try {
            const errJson = await res.json();
            msg = errJson?.message || msg;
         } catch {}
         throw new Error(msg);
         }

         const result = await res.json().catch(() => null);
         console.log("[submit result]", result);

         //await simulate(5000);

         // ✅ 성공 시 다음 단계로 이동
         navigate(STEPS.result.path);

      }
      catch(error) {
         console.error(error);
         setSubmitError(error?.message || "전송 중 오류가 발생했습니다.");
      }

   }

  // (선택) 확인용 로그
  useEffect(() => {
    console.log("[InvitationContext data]", data);
  }, [data]);

  return (
    <div className={styles.page}>
      <LoadingModal open={loading} />
      <ProgressBar title="청첩장 만들기" currentStep={4} totalSteps={7} />

      <main className={styles.main}>
        <section className={styles.card}>
          <h1 className={`${styles.pageTitle} step-title`}>STEP 4. 디자인 요청 사항</h1>

          {/* 1) 스타일 예시 이미지 */}
          <section className={styles.stepBlock}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>1</div>
              <span className={styles.stepTitle}>스타일 예시 이미지</span>
            </div>
            <p className={styles.stepDesc}>
              원하시는 청첩장 스타일의 참고 이미지를 업로드해주세요. AI가 이 스타일을 참고하여 디자인합니다.
            </p>

            <div className={styles.stepContent}>
              <ImageUploader
                maxCount={3}
                value={data.assets.styleImages}         // ✅ File[]
                onChange={handleStyleImagesChange}      // ✅ File[]
              />
            </div>
          </section>

          {/* 2) 테두리 디자인 선택 */}
          <section className={styles.stepBlock}>
            <div className={styles.stepHeader}>
              <div className={styles.stepNumber}>2</div>
              <span className={styles.stepTitle}>테두리 디자인 선택</span>
            </div>
            <p className={styles.stepDesc}>
              청첩장에 사용할 겉 테두리 프레임을 선택해주세요 (인생네컷 스타일)
            </p>

            <div className={styles.stepContent}>
              <FrameSelector
                value={frameValueForUI}        // 예: "romantic"
                onChange={handleFrameChange}    // ✅ 내부에서 "ROMANTIC"로 저장
              />
            </div>
          </section>
        </section>

        <button type="button" className={styles.nextButton} onClick={handleSubmit}>
          청첩장 만들기
        </button>
      </main>
    </div>
  );
}
