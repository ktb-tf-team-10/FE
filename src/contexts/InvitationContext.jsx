// src/contexts/InvitationContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";

const InvitationContext = createContext(null);

export const initialInvitationData = {
  groom: {
    name: "",
    fatherName: "",
    motherName: "",
  },
  bride: {
    name: "",
    fatherName: "",
    motherName: "",
  },
  wedding: {
    hallName: "",
    address: "",
    date: "", // YYYY-MM-DD
    time: "", // HH:mm
  },

  extraMessage: "",
  additionalRequest: "",

  tone: null,   // e.g. "WARM"
  frame: null,  // e.g. "romantic"

  assets: {
    styleImages: [], // File[]
    userImages: [],  // File[]
  },
};

/**
 * "groom.name" 같은 path로 중첩 객체를 불변 업데이트
 */
function setByPath(obj, path, value) {
  const keys = path.split(".");
  const next = Array.isArray(obj) ? [...obj] : { ...obj };

  let cur = next;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const prevVal = cur[k];
    cur[k] = Array.isArray(prevVal) ? [...prevVal] : { ...(prevVal ?? {}) };
    cur = cur[k];
  }

  cur[keys[keys.length - 1]] = value;
  return next;
}

export function InvitationProvider({ children }) {
  const [data, setData] = useState(initialInvitationData);

  const actions = useMemo(
    () => ({
      // path 기반 업데이트 (추천)
      updateField: (path, value) => {
        setData((prev) => setByPath(prev, path, value));
      },

      // 덩어리 patch 업데이트 (필요할 때)
      patchData: (partial) => {
        setData((prev) => ({ ...prev, ...partial }));
      },

      // 이미지들
      setStyleImages: (files) => {
        setData((prev) => setByPath(prev, "assets.styleImages", files));
      },
      setUserImages: (files) => {
        setData((prev) => setByPath(prev, "assets.userImages", files));
      },

      reset: () => setData(initialInvitationData),
    }),
    []
  );

  return (
    <InvitationContext.Provider value={{ data, ...actions }}>
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation() {
  const ctx = useContext(InvitationContext);
  if (!ctx) throw new Error("useInvitation must be used within InvitationProvider");
  return ctx;
}
