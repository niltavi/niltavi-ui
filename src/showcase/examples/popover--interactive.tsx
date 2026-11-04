// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Avatar, Button, Popover} from "@heroui/react";
import {useState} from "react";

export function PopoverInteractive() {
  const t = useCopy();
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="flex items-center gap-6">
      <Popover>
        <Popover.Trigger aria-label={t("User profile")}>
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <Avatar.Image
                alt={t("Sarah Johnson")}
                src="https://img.heroui.chat/image/avatar?w=400&h=400&u=1"
              />
              <Avatar.Fallback>{t("SJ")}</Avatar.Fallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">{t("Sarah Johnson")}</p>
              <p className="text-xs text-muted">{t("@sarahj")}</p>
            </div>
          </div>
        </Popover.Trigger>
        <Popover.Content className="w-[320px]">
          <Popover.Dialog>
            <Popover.Heading>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar size="md">
                    <Avatar.Image
                      alt={t("Sarah Johnson")}
                      src="https://img.heroui.chat/image/avatar?w=400&h=400&u=1"
                    />
                    <Avatar.Fallback>{t("SJ")}</Avatar.Fallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{t("Sarah Johnson")}</p>
                    <p className="text-sm text-muted">{t("@sarahj")}</p>
                  </div>
                </div>
                <Button
                  className="rounded-full"
                  size="sm"
                  variant={isFollowing ? "tertiary" : "primary"}
                  onPress={() => setIsFollowing(!isFollowing)}
                >
                  {t(isFollowing ? "Following" : "Follow")}
                </Button>
              </div>
            </Popover.Heading>
            <p className="mt-3 text-sm text-muted">
              {t("Product designer and creative director. Building beautiful experiences that matter.")}</p>
            <div className="mt-3 flex gap-4">
              <div>
                <span className="font-semibold">{t("892")}</span>
                <span className="ms-1 text-sm text-muted">{t("Following")}</span>
              </div>
              <div>
                <span className="font-semibold">{t("12.5K")}</span>
                <span className="ms-1 text-sm text-muted">{t("Followers")}</span>
              </div>
            </div>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
}

export default PopoverInteractive;
