import React from "react";
import SpinnerIcon from "./SpinnerIcon";
export const Loading = (props: any) => (
  <>
    {props.loading ? (
      <div className={props.isFromProtectedRoute ? "w-full h-full height-full-container elements-center" : "w-full h-full"}>
        <SpinnerIcon />
      </div>
    ) : (
      <>{props.children}</>
    )}
  </>
);
