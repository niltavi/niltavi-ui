// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {useCopy} from "../copy";
import {Breadcrumbs} from "@heroui/react";

export default function BreadcrumbsLevel3() {
  const t = useCopy();
  return (
    <Breadcrumbs>
      <Breadcrumbs.Item href="#" onClick={(event) => event.preventDefault()}>{t("Home")}</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#" onClick={(event) => event.preventDefault()}>{t("Category")}</Breadcrumbs.Item>
      <Breadcrumbs.Item>{t("Current Page")}</Breadcrumbs.Item>
    </Breadcrumbs>
  );
}
