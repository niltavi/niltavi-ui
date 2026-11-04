// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Typography} from "@heroui/react";

export const Primitives = () => {
  const t = useCopy();
  return (
    <div className="flex max-w-xl flex-col gap-4">
      <Typography.Heading level={1}>{t("Dashboard")}</Typography.Heading>
      <Typography.Paragraph>
        {t("Convenience primitives are thin wrappers over Typography, so you can choose explicit composition without learning a second styling system.")}</Typography.Paragraph>
      <Typography.Paragraph color="muted" size="sm">
        {t("Paragraph supports base, sm, and xs sizes.")}</Typography.Paragraph>
      <Typography.Code>{t("Typography.Code")}</Typography.Code>
    </div>
  );
};

export default Primitives;
