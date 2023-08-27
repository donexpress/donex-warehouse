import React from "react";
import SpinnerIcon from "./SpinnerIcon";
export const Loading = (props: any) => (
  <>
    {props.loading ? (
      <div className="w-full h-full">
        <SpinnerIcon />
      </div>
    ) : (
      <>{props.children}</>
    )}
  </>
);
