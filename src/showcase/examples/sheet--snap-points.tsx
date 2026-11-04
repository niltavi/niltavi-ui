// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Button, Sheet} from "@heroui/react";

const snapPointValues = ["148px", "355px"];

export function SnapPoints() {
  const t = useCopy();
  return (
    <Sheet snapPoints={snapPointValues}>
      <Sheet.Trigger>
        <Button variant="secondary">{t("Snap Points")}</Button>
      </Sheet.Trigger>
      <Sheet.Backdrop>
        <Sheet.Content>
          <Sheet.Dialog>
            <Sheet.Handle />
            <Sheet.Header>
              <Sheet.Heading>{t("Snap Points")}</Sheet.Heading>
            </Sheet.Header>
            <Sheet.Body>
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted">
                  {t("This sheet opens at 148px and snaps again at 355px. Dragging past the last detent reveals the full sheet, and the backdrop fades in after that point.")}</p>
                {["Dawn by the stream", "A kingfisher at the bridge", "Rest beneath the pines", "Lunch on the ridge", "Home before dusk"].map((stop) => <p key={stop} className="text-sm text-muted">{t(stop)}</p>)}
              </div>
            </Sheet.Body>
          </Sheet.Dialog>
        </Sheet.Content>
      </Sheet.Backdrop>
    </Sheet>
  );
}

export default SnapPoints;
