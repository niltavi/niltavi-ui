// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {
  BellFill,
  BellSlash,
  Check,
  Microphone,
  MicrophoneSlash,
  Moon,
  Power,
  Sun,
  VolumeFill,
  VolumeSlashFill,
} from "@gravity-ui/icons";
import {Switch} from "@heroui/react";

export function WithIcons() {
  const t = useCopy();
  const icons = {
    check: {
      off: Power,
      on: Check,
      selectedControlClass: "bg-success",
      selectedIconClass: "text-success",
    },
    darkMode: {
      off: Moon,
      on: Sun,
      selectedControlClass: "bg-rufous",
      selectedIconClass: "text-rufous",
    },
    microphone: {
      off: Microphone,
      on: MicrophoneSlash,
      selectedControlClass: "bg-danger",
      selectedIconClass: "text-danger",
    },
    notification: {
      off: BellSlash,
      on: BellFill,
      selectedControlClass: "bg-warning",
      selectedIconClass: "text-warning",
    },
    volume: {
      off: VolumeFill,
      on: VolumeSlashFill,
      selectedControlClass: "bg-muted",
      selectedIconClass: "text-muted",
    },
  };

  return (
    <div className="flex flex-wrap gap-3">
      {Object.entries(icons).map(([key, value]) => (
        <Switch key={key} defaultSelected aria-label={t(key)} size="lg">
          {({isSelected}) => (
            <Switch.Content>
              <Switch.Control className={isSelected ? value.selectedControlClass : ""}>
                <Switch.Thumb>
                  <Switch.Icon>
                    {t(isSelected ? (
                      <value.on className={`size-3 opacity-100 ${value.selectedIconClass}`} />
                    ) : (
                      <value.off className="size-3 text-inherit opacity-70" />
                    ))}
                  </Switch.Icon>
                </Switch.Thumb>
              </Switch.Control>
            </Switch.Content>
          )}
        </Switch>
      ))}
    </div>
  );
}

export default WithIcons;
