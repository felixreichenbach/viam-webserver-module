export type Contour = {
  arclength: number;
  area: number;
  hausdorff?: { [key: string]: number };
};

// TODO: Provide threshold values for length, area, and shape from Viam configuration
export const checkContours = (
  ref_contours: Contour[],
  contours: Contour[],
  thresholds: Record<string, number>
) => {
  let result = { length: "", area: "", shape: "" };
  if (ref_contours && ref_contours.length == contours.length) {
    for (const [rci, refcont] of ref_contours.entries()) {
      for (const [ci, contour] of contours.entries()) {
        console.log(
          "diff length",
          ci,
          Math.abs(refcont.arclength - contour.arclength)
        );
        if (
          Math.abs(refcont.arclength - contour.arclength) <
          (thresholds?.length || 0)
        ) {
          result["length"] = "good";
        }
        console.log("diff area", Math.abs(refcont.area - contour.area));
        if (Math.abs(refcont.area - contour.area) < (thresholds?.area || 0)) {
          result["area"] = "good";
        }
        if (contour.hausdorff) {
          console.log("hausdorff", typeof contour.hausdorff);
          const keys = Object.keys(contour.hausdorff);
          keys.forEach((key) => {
            const hausdorffValue = contour.hausdorff
              ? contour.hausdorff[key]
              : undefined;
            console.log("diff hausdorff", hausdorffValue);
            if (
              hausdorffValue !== undefined &&
              hausdorffValue < (thresholds?.shape || 0)
            ) {
              result["shape"] = "good";
            }
          });
        }
        if (result["shape"] === "") {
          result["shape"] = "bad";
        }
      }
      if (result["length"] === "") {
        result["length"] = "bad";
      }
      if (result["area"] === "") {
        result["area"] = "bad";
      }
    }
  }
  return result;
};
