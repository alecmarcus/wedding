import { ONE_KiB, ONE_MiB } from "@/constants";

export const getFileSize = (size: number) => {
  if (size < ONE_KiB) {
    return {
      mib: size / ONE_MiB,
      labelled: `${size} bytes`,
    };
  }
  if (size >= ONE_KiB && size < ONE_MiB) {
    return {
      mib: size / ONE_MiB,
      labelled: `${(size / ONE_KiB).toFixed(1)} KiB`,
    };
  }
  return {
    mib: size / ONE_MiB,
    labelled: `${(size / ONE_MiB).toFixed(1)} MiB`,
  };
};
