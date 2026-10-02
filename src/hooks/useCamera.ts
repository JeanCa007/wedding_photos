import { useCallback, useEffect, useRef, useState } from "react";

type FacingMode = "user" | "environment";

export function useCamera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facing, setFacing] = useState<FacingMode>("environment");

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const stop = useCallback(() => {
    stopStream();
    setActive(false);
  }, [stopStream]);

  const start = useCallback(
    async (mode?: FacingMode) => {
      const desired = mode ?? facing;
      setError(null);
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Este dispositivo no permite usar la cámara. Sube tu foto desde la galería.");
        setActive(false);
        return false;
      }
      try {
        stopStream();
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: desired },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
        setFacing(desired);
        setActive(true);
        return true;
      } catch (_e) {
        setError("No pudimos acceder a la cámara. Revisa los permisos o sube desde tu galería.");
        setActive(false);
        return false;
      }
    },
    [facing, stopStream],
  );

  const capture = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      const video = videoRef.current;
      if (!video || !video.videoWidth) {
        resolve(null);
        return;
      }
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(null);
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }
          resolve(new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" }));
        },
        "image/jpeg",
        0.9,
      );
    });
  }, []);

  const switchCamera = useCallback(() => {
    const next: FacingMode = facing === "user" ? "environment" : "user";
    return start(next);
  }, [facing, start]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  return { videoRef, active, error, facing, start, stop, capture, switchCamera, setError };
}