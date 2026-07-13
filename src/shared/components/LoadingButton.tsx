import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

interface LoadingButtonProps extends ComponentPropsWithoutRef<typeof Button> {
  loading?: boolean;
  spinnerPosition?: "start" | "end" | "center";
  children: ReactNode;
}

const LoadingButton = ({
  loading,
  spinnerPosition = "end",
  children,
  ...props
}: LoadingButtonProps) => {
  return (
    <Button disabled={loading} {...props}>
      {spinnerPosition === "start" && loading && <Spinner className="me-2" />}

      {!loading || spinnerPosition !== "center" ? children : null}

      {spinnerPosition === "end" && loading && <Spinner className="ms-2" />}

      {spinnerPosition === "center" && loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      )}
    </Button>
  );
};

export default LoadingButton;
