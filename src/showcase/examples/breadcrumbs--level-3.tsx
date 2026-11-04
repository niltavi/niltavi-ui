// Adapted from HeroUI official demos (Apache-2.0); see ../NOTICE.md.
import {Breadcrumbs} from "@heroui/react";

export default function BreadcrumbsLevel3() {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Item href="#">Home</Breadcrumbs.Item>
      <Breadcrumbs.Item href="#">Category</Breadcrumbs.Item>
      <Breadcrumbs.Item>Current Page</Breadcrumbs.Item>
    </Breadcrumbs>
  );
}
