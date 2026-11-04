// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {HardDrive, Persons} from "@gravity-ui/icons";
import {Button, toast} from "@heroui/react";

export function Variants() {
  const t = useCopy();
  return (
    <div className="flex h-full max-w-xl flex-col items-center justify-center">
      <div className="flex w-full flex-wrap items-center justify-center gap-4">
        <Button
          size="sm"
          variant="tertiary"
          onPress={() => {
            const id = toast(t("You have been invited to join a team"), {
              actionProps: {
                children: t("Dismiss"),
                onPress: () => toast.close(id),
                variant: "tertiary",
              },
              description: t("Bob sent you an invitation to join HeroUI team"),
              indicator: <Persons />,
              variant: "default",
            });
          }}
        >
          {t("Default toast")}</Button>
        <Button
          size="sm"
          variant="secondary"
          onPress={() => {
            const id = toast.info(t("You have 2 credits left"), {
              actionProps: {children: t("Upgrade"), onPress: () => toast.close(id)},
              description: t("Get a paid plan for more credits"),
            });
          }}
        >
          {t("Accent toast")}</Button>
        <Button
          className="text-success-soft-foreground"
          size="sm"
          variant="tertiary"
          onPress={() => {
            const id = toast.success(t("You have upgraded your plan"), {
              actionProps: {
                children: t("Billing"),
                className: "bg-success text-success-foreground",
                onPress: () => toast.close(id),
              },
              description: t("You can continue using HeroUI Chat"),
            });
          }}
        >
          {t("Success toast")}</Button>
        <Button
          className="text-warning-soft-foreground"
          size="sm"
          variant="tertiary"
          onPress={() => {
            const id = toast.warning(t("You have no credits left"), {
              actionProps: {
                children: t("Upgrade"),
                className: "bg-warning text-warning-foreground",
                onPress: () => toast.close(id),
              },
              description: t("Upgrade to a paid plan to continue"),
            });
          }}
        >
          {t("Warning toast")}</Button>
        <Button
          size="sm"
          variant="danger-soft"
          onPress={() => {
            const id = toast.danger(t("Storage is full"), {
              actionProps: {children: t("Remove"), onPress: () => toast.close(id), variant: "danger"},
              description:
                t("Remove files to release space. Adding more text to demonstrate longer content display"),
              indicator: <HardDrive />,
            });
          }}
        >
          {t("Danger toast")}</Button>
      </div>
    </div>
  );
}

export default Variants;
