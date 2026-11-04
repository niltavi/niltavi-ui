// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Paperclip} from "@gravity-ui/icons";
import {Button, Spinner} from "@heroui/react";
import React, {useState} from "react";

export function LoadingState() {
  const t = useCopy();
  const [isLoading, setLoading] = useState(false);

  const handlePress = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Button isPending={isLoading} onPress={handlePress}>
      {({isPending}) => (
        <>
          {t(isPending ? <Spinner color="current" size="sm" /> : <Paperclip />)}
          {t(isPending ? "Uploading..." : "Upload File")}
        </>
      )}
    </Button>
  );
}

export default LoadingState;
